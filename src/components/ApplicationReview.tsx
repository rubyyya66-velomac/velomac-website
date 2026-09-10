"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Container } from "@/components/Layout";
import {
  applicationReviewProductOptions,
  getApplicationReviewProductConfig,
  getApplicationReviewProductOption,
  type ApplicationReviewFieldKey,
  type ApplicationReviewProductConfig
} from "@/content/applicationReview";

type MediumType = "" | "Liquid" | "Gas" | "Steam" | "Not sure";
type SubmissionState = "idle" | "submitting" | "success" | "error";

type ApplicationReviewProps = {
  productName: string;
  productSlug: string;
  productCategory: string;
  sourcePath: string;
  anchorId?: string;
  allowProductSelection?: boolean;
  initialProductSlug?: string;
  initialMediumType?: "liquid" | "gas" | "steam" | "not-sure";
  sourceContext?: {
    sourceType?: string;
    sourceSection?: string;
    sourcePath?: string;
    applicationType?: string;
  };
};

type SummaryItem = {
  label: string;
  value: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const flowUnits = ["m³/h", "L/min", "L/h", "kg/h", "t/h", "Nm³/h", "Sm³/h", "GPM", "SCFM", "Other"];
const purposes = ["Flow monitoring", "Process control", "Totalization", "Utility measurement", "Batch / dosing", "Internal transfer", "Other", "Not sure"];
const upstreamItems = ["Pump", "Valve", "Elbow", "Tee", "Reducer", "Expander", "Filter", "Other", "Not sure"];
const siteConditions = ["Standard", "High vibration", "Limited straight run", "Limited installation space", "Outdoor", "Other", "Not sure"];

export function ApplicationReview({
  productName,
  productSlug,
  productCategory,
  sourcePath,
  anchorId = "application-review",
  allowProductSelection = false,
  initialProductSlug,
  initialMediumType,
  sourceContext
}: ApplicationReviewProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const [mediumType, setMediumType] = useState<MediumType>(() => normalizeMediumType(initialMediumType));
  const [selectedProductSlug, setSelectedProductSlug] = useState(() => {
    if (!allowProductSelection) return productSlug;
    return getApplicationReviewProductOption(initialProductSlug || "")?.value || "not-sure-yet";
  });
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [quickError, setQuickError] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const selectedProduct = getApplicationReviewProductOption(selectedProductSlug);
  const activeProductSlug = allowProductSelection ? selectedProduct?.value || "not-sure-yet" : productSlug;
  const activeProductName = allowProductSelection ? selectedProduct?.label || "Not sure yet" : productName;
  const productConfig = getApplicationReviewProductConfig(activeProductSlug);

  useEffect(() => {
    trackApplicationReview("application_review_view", activeProductSlug, productCategory, mediumType, sourcePath, sourceContext);
    // The view event represents the initial module impression, not selector changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function resetApplicationReview() {
      setMediumType(normalizeMediumType(initialMediumType));
      setSelectedProductSlug(
        allowProductSelection
          ? getApplicationReviewProductOption(initialProductSlug || "")?.value || "not-sure-yet"
          : productSlug
      );
      setMoreDetailsOpen(false);
      setContactOpen(false);
      setSummary([]);
      setQuickError("");
      setSubmissionState("idle");
      hasStarted.current = false;
    }

    window.addEventListener("velomac:application-review-reset", resetApplicationReview);
    return () => window.removeEventListener("velomac:application-review-reset", resetApplicationReview);
  }, [allowProductSelection, initialMediumType, initialProductSlug, productSlug]);

  function markStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackApplicationReview("application_review_start", activeProductSlug, productCategory, mediumType, sourcePath, sourceContext);
  }

  function toggleMoreDetails() {
    const nextOpen = !moreDetailsOpen;
    setMoreDetailsOpen(nextOpen);
    if (nextOpen) {
      trackApplicationReview("more_details_open", activeProductSlug, productCategory, mediumType, sourcePath, sourceContext);
    }
  }

  function openContactStep() {
    const form = formRef.current;
    if (!form) return;

    const validationMessage = validateQuickReview(form);
    if (validationMessage) {
      setQuickError(validationMessage);
      return;
    }

    setQuickError("");
    setSummary(buildApplicationSummary(new FormData(form)));
    setContactOpen(true);
    window.requestAnimationFrame(() => {
      contactRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const validationMessage = validateQuickReview(form);
    if (validationMessage) {
      setQuickError(validationMessage);
      setContactOpen(false);
      return;
    }

    const formData = new FormData(form);
    const currentSummary = buildApplicationSummary(formData);
    setSummary(currentSummary);
    setSubmissionState("submitting");
    trackApplicationReview("application_review_submit", activeProductSlug, productCategory, mediumType, sourcePath, sourceContext);

    const payload = {
      "inquiry-type": "Flowmeter Application Review",
      name: readValue(formData, "name"),
      email: readValue(formData, "email"),
      company: readValue(formData, "company"),
      "country-region": readValue(formData, "country-region"),
      "whatsapp-phone": readValue(formData, "whatsapp-phone"),
      "product-interest": activeProductName,
      "product-slug": activeProductSlug,
      "product-category": productCategory,
      "source-page": allowProductSelection ? "Flowmeter Application Review" : productName,
      "page-path": sourcePath,
      "page-url": window.location.href,
      "source-type": sourceContext?.sourceType || "direct",
      "source-section": sourceContext?.sourceSection || "application-review",
      "source-origin-path": sourceContext?.sourcePath || sourcePath,
      "application-type": sourceContext?.applicationType || "",
      "medium-fluid": currentSummary.find((item) => item.label === "Medium")?.value || "Not provided",
      "pipe-size": currentSummary.find((item) => item.label === "Pipe")?.value || "Not provided",
      "flow-range": currentSummary.find((item) => item.label === "Flow")?.value || "Not provided",
      "temperature-pressure": `${currentSummary.find((item) => item.label === "Pressure")?.value || "Not provided"}; ${currentSummary.find((item) => item.label === "Temperature")?.value || "Not provided"}`,
      requirements: buildApplicationData(formData)
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Application review submission failed.");
      }

      setSubmissionState("success");
      try {
        sessionStorage.setItem("velomac-application-review-session-state", "submitted");
      } catch {
        // Submission success is not dependent on session storage availability.
      }
      window.dispatchEvent(new Event("velomac:application-review-submitted"));
      trackApplicationReview("application_review_success", activeProductSlug, productCategory, mediumType, sourcePath, sourceContext);
    } catch {
      setSubmissionState("error");
      trackApplicationReview("application_review_error", activeProductSlug, productCategory, mediumType, sourcePath, sourceContext);
    }
  }

  return (
    <section
      id={anchorId}
      data-product-name={activeProductName}
      data-product-slug={activeProductSlug}
      data-product-category={productCategory}
      data-page-path={sourcePath}
      className="scroll-mt-28 border-y border-metal-200 bg-metal-50 py-16 sm:py-20 lg:py-24"
    >
      <Container className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 xl:gap-20">
        <div className="lg:pt-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Application Review</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.015em] text-navy-950 sm:text-4xl lg:text-[2.5rem]">
            Choose the Meter From the Application, Not the Pipe Size
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            A few operating details are enough to start an application review.
          </p>
          <p className="mt-7 border-y border-metal-200 py-4 text-sm font-semibold tracking-[0.04em] text-navy-950 sm:text-base">
            Medium <span className="px-1 text-industrial-600">→</span> Flow <span className="px-1 text-industrial-600">→</span> P/T <span className="px-1 text-industrial-600">→</span> Pipe <span className="px-1 text-industrial-600">→</span> Purpose
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">Installation and project details can be added if available.</p>

          <div className="mt-10 border-l-2 border-industrial-600 pl-5">
            <h3 className="text-base font-semibold text-navy-950">What information is useful for flowmeter selection?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Flowmeter selection usually starts with the medium, operating flow range, pressure, temperature, pipe size and measurement purpose. Additional properties such as conductivity, viscosity, gas composition or installation conditions can be reviewed where relevant.
            </p>
          </div>
        </div>

        <div className="min-w-0">
          {submissionState === "success" ? (
            <SuccessState sourcePath={sourcePath} />
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onFocusCapture={markStarted}
              onChange={(event) => {
                if (contactOpen) setSummary(buildApplicationSummary(new FormData(event.currentTarget)));
              }}
              className="bg-white px-5 shadow-sm sm:px-8"
            >
              {allowProductSelection ? (
                <div className="border-t border-metal-200 py-7">
                  <Field label="Flowmeter technology (optional)">
                    <select
                      name="review-product"
                      className={inputClass}
                      value={selectedProductSlug}
                      onChange={(event) => setSelectedProductSlug(event.target.value)}
                    >
                      {applicationReviewProductOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </Field>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Choose a direction if you have one. Otherwise, start from the operating conditions.</p>
                </div>
              ) : null}
              <div className="divide-y divide-metal-200 border-y border-metal-200">
                <QuickReviewFields mediumType={mediumType} onMediumTypeChange={setMediumType} />
              </div>

              <button
                type="button"
                aria-expanded={moreDetailsOpen}
                aria-controls={`${anchorId}-more-details`}
                onClick={toggleMoreDetails}
                className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                <span aria-hidden="true" className="text-lg leading-none">{moreDetailsOpen ? "−" : "+"}</span>
                Add more application details
              </button>
              <p className="mt-1 text-sm text-slate-500">Optional information for a more detailed review.</p>

              {moreDetailsOpen ? (
                <OptionalApplicationDetails
                  id={`${anchorId}-more-details`}
                  mediumType={mediumType}
                  productConfig={productConfig}
                />
              ) : null}

              {!contactOpen ? (
                <div className="border-t border-metal-200 py-7">
                  <button
                    type="button"
                    onClick={openContactStep}
                    className="focus-ring inline-flex min-h-12 w-full items-center justify-center bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 sm:w-auto"
                  >
                    Review My Application <span aria-hidden="true" className="ml-2">→</span>
                  </button>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Send us what you know. Missing details can be confirmed during the review.
                  </p>
                  {quickError ? <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{quickError}</p> : null}
                </div>
              ) : (
                <div ref={contactRef} className="border-t border-metal-200 py-8">
                  <ApplicationSummary items={summary} />
                  <ContactStep submissionState={submissionState} />
                </div>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}

function QuickReviewFields({
  mediumType,
  onMediumTypeChange
}: {
  mediumType: MediumType;
  onMediumTypeChange: (value: MediumType) => void;
}) {
  return (
    <>
      <FormSection number="01" title="What is flowing?">
        <div className="grid gap-5">
          <Field label="Medium name">
            <input name="medium-name" placeholder="Water, steam, compressed air, wastewater..." className={inputClass} />
          </Field>
          <fieldset>
            <legend className={labelClass}>Medium type</legend>
            <ChipOptions
              name="medium-type"
              options={["Liquid", "Gas", "Steam", "Not sure"]}
              value={mediumType}
              onChange={(value) => onMediumTypeChange(value as MediumType)}
            />
          </fieldset>
        </div>
      </FormSection>

      <FormSection number="02" title="Flow range">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Minimum", "minimum-flow"],
            ["Normal", "normal-flow"],
            ["Maximum", "maximum-flow"]
          ].map(([label, name]) => (
            <ValueWithUnit key={name} label={label} name={name} units={flowUnits} />
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">Only one flow value is needed to start. Meter sizing should consider the operating range, not pipe size alone.</p>
      </FormSection>

      <FormSection number="03" title="Operating conditions">
        <div className="grid gap-4 sm:grid-cols-2">
          <ValueWithUnit label="Pressure" name="pressure" units={["bar", "MPa", "kPa", "psi", "Not sure"]} />
          <ValueWithUnit label="Temperature" name="temperature" units={["°C", "°F", "Not sure"]} />
        </div>
      </FormSection>

      <FormSection number="04" title="Pipe size">
        <ValueWithUnit label="Pipe size" name="pipe-size-value" units={["DN", "mm", "inch", "Not sure"]} inputMode="text" />
        <p className="mt-3 text-xs leading-5 text-slate-500">Final meter sizing may differ from the pipe size.</p>
      </FormSection>

      <FormSection number="05" title="What do you need the measurement for?">
        <ChipOptions name="measurement-purpose" options={purposes} />
      </FormSection>
    </>
  );
}

function OptionalApplicationDetails({
  id,
  mediumType,
  productConfig
}: {
  id: string;
  mediumType: MediumType;
  productConfig: ApplicationReviewProductConfig | null;
}) {
  const focusFields = productConfig?.fields || [];

  return (
    <div id={id} className="mt-7 border-t border-metal-200 pb-8">
      {productConfig ? (
        <OptionalSection title={productConfig.heading} description="A few checks relevant to this product page.">
          <ProductSpecificFields fields={productConfig.fields} />
        </OptionalSection>
      ) : null}

      <OptionalSection title="Installation" description="Add only the site details you already know.">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField name="pipe-orientation" label="Pipe orientation" options={["Horizontal", "Vertical", "Other", "Not sure"]} />
          {mediumType === "Liquid" && !focusFields.includes("fullPipe") ? <SelectField name="full-pipe" label="Full pipe?" options={["Yes", "No", "Not sure"]} /> : null}
          {!focusFields.includes("straightRun") ? <StraightRunFields /> : null}
        </div>
        <CheckboxGroup name="immediately-upstream" label="Immediately upstream" options={upstreamItems} />
        <CheckboxGroup name="site-condition" label="Site condition" options={siteConditions} />
      </OptionalSection>

      <MediumSpecificFields mediumType={mediumType} excludedFields={focusFields} />
    </div>
  );
}

function ProductSpecificFields({ fields }: { fields: ApplicationReviewFieldKey[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        switch (field) {
          case "siteVibration":
            return <SelectField key={field} name="site-vibration" label="Site vibration" options={["Low", "Moderate", "High", "Not sure"]} />;
          case "ptCompensation":
            return <SelectField key={field} name="pt-compensation" label="P/T compensation" options={["Required", "Not required", "Not sure"]} />;
          case "straightRun":
            return <StraightRunFields key={field} />;
          case "conductivity":
            return <ValueOrNotSure key={field} name="conductivity" label="Conductivity" unit="µS/cm" />;
          case "fullPipe":
            return <SelectField key={field} name="full-pipe" label="Full pipe?" options={["Yes", "No", "Not sure"]} />;
          case "solids":
            return <SelectField key={field} name="solids-present" label="Solids present?" options={["Yes", "No", "Not sure"]} />;
          case "gasComposition":
            return <Field key={field} label="Gas composition"><input name="gas-composition" className={inputClass} placeholder="If known" /></Field>;
          case "compositionStability":
            return <SelectField key={field} name="composition-stability" label="Composition stability" options={["Stable", "Variable", "Not sure"]} />;
          case "moisture":
            return <SelectField key={field} name="moisture" label="Moisture" options={["Dry", "Some moisture possible", "Wet", "Not sure"]} />;
          case "viscosity":
            return <ValueOrNotSure key={field} name="viscosity" label="Viscosity" unit="mPa·s" />;
          case "liquidCondition":
            return <SelectField key={field} name="liquid-condition" label="Liquid condition" options={["Clean", "Some particles possible", "Particles present", "Not sure"]} />;
          case "installationType":
            return <SelectField key={field} name="installation-type" label="Installation type" options={["Clamp-on", "Inline", "Not sure"]} />;
          case "pipeConstruction":
            return (
              <div key={field} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                <Field label="Pipe material"><input name="pipe-material" className={inputClass} placeholder="If known" /></Field>
                <ValueOrNotSure name="pipe-wall-thickness" label="Pipe wall thickness" unit="mm" />
              </div>
            );
        }
      })}
    </div>
  );
}

function MediumSpecificFields({ mediumType, excludedFields }: { mediumType: MediumType; excludedFields: ApplicationReviewFieldKey[] }) {
  if (!mediumType || mediumType === "Not sure") return null;

  if (mediumType === "Liquid") {
    return (
      <OptionalSection title="Liquid details" description="Useful only where these properties affect the application.">
        <div className="grid gap-5 sm:grid-cols-2">
          {!excludedFields.includes("conductivity") ? <ValueOrNotSure name="conductivity" label="Conductivity" unit="µS/cm" /> : null}
          {!excludedFields.includes("viscosity") ? <ValueOrNotSure name="viscosity" label="Viscosity" unit="mPa·s" /> : null}
          {!excludedFields.includes("solids") ? <SelectField name="solids-present" label="Solids present?" options={["Yes", "No", "Not sure"]} /> : null}
          <SelectField name="entrained-gas" label="Entrained gas / bubbles?" options={["Yes", "No", "Not sure"]} />
          <SelectField name="corrosive" label="Corrosive?" options={["Yes", "No", "Not sure"]} />
        </div>
      </OptionalSection>
    );
  }

  if (mediumType === "Gas") {
    return (
      <OptionalSection title="Gas details" description="Add composition or condition information if it is available.">
        <div className="grid gap-5 sm:grid-cols-2">
          {!excludedFields.includes("gasComposition") ? <Field label="Gas composition"><input name="gas-composition" className={inputClass} placeholder="If known" /></Field> : null}
          {!excludedFields.includes("compositionStability") ? <SelectField name="composition-stability" label="Composition" options={["Stable", "Variable", "Not sure"]} /> : null}
          {!excludedFields.includes("moisture") ? <SelectField name="moisture" label="Moisture" options={["Dry", "Some moisture possible", "Wet", "Not sure"]} /> : null}
          <SelectField name="flow-basis" label="Flow basis" options={["Actual", "Normal", "Standard", "Mass", "Not sure"]} />
          <SelectField name="particulates" label="Particulates" options={["Yes", "No", "Not sure"]} />
        </div>
      </OptionalSection>
    );
  }

  return (
    <OptionalSection title="Steam details" description="Flow, pressure and temperature are reused from the quick review above.">
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField name="steam-type" label="Steam type" options={["Saturated", "Superheated", "Not sure"]} />
        {!excludedFields.includes("ptCompensation") ? <SelectField name="pt-compensation" label="P/T compensation" options={["Required", "Not required", "Not sure"]} /> : null}
        <Field label="Steam quality"><input name="steam-quality" className={inputClass} placeholder="Optional" /></Field>
      </div>
    </OptionalSection>
  );
}

function ContactStep({ submissionState }: { submissionState: SubmissionState }) {
  return (
    <div className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">Contact step</p>
      <h3 className="mt-2 text-2xl font-semibold text-navy-950">Where should we send the review follow-up?</h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Name"><input name="name" className={inputClass} required autoComplete="name" /></Field>
        <Field label="Work Email"><input name="email" type="email" className={inputClass} required autoComplete="email" /></Field>
        <Field label="Company"><input name="company" className={inputClass} autoComplete="organization" /></Field>
        <Field label="Country / Region"><input name="country-region" className={inputClass} autoComplete="country-name" /></Field>
        <Field label="Phone / WhatsApp"><input name="whatsapp-phone" className={inputClass} autoComplete="tel" /></Field>
        <Field label="Additional notes"><textarea name="additional-notes" className={`${inputClass} min-h-24 resize-y`} /></Field>
      </div>
      <button
        type="submit"
        disabled={submissionState === "submitting"}
        className="focus-ring mt-7 inline-flex min-h-12 w-full items-center justify-center bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {submissionState === "submitting" ? "Sending..." : "Send Application Review"}
        <span aria-hidden="true" className="ml-2">→</span>
      </button>
      {submissionState === "error" ? (
        <p className="mt-4 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900" role="alert">
          The application review could not be sent. Your entries are still here—please check your connection and try again.
        </p>
      ) : null}
    </div>
  );
}

function ApplicationSummary({ items }: { items: SummaryItem[] }) {
  return (
    <div className="bg-metal-50 px-5 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">Application summary</p>
      <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-semibold leading-6 text-navy-950">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SuccessState({ sourcePath }: { sourcePath: string }) {
  return (
    <div className="border-y border-industrial-600 bg-white px-6 py-10 shadow-sm sm:px-9 sm:py-12" role="status">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Application received</p>
      <h3 className="mt-3 text-3xl font-semibold leading-tight text-navy-950">Thank you. We will review the operating conditions and selection details you provided.</h3>
      <p className="mt-5 text-base leading-7 text-slate-600">If another value is needed, we can follow up with the specific point to confirm.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href={sourcePath} className="focus-ring inline-flex min-h-11 items-center bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700">Back to Product</Link>
        <Link href="/products#flow-measurement" className="focus-ring inline-flex min-h-11 items-center border border-metal-300 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:border-industrial-600 hover:text-industrial-700">Explore Flowmeters</Link>
      </div>
    </div>
  );
}

function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 py-6 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:py-7">
      <p className="pt-0.5 text-xs font-semibold tracking-[0.16em] text-industrial-700">{number}</p>
      <div>
        <h3 className="text-lg font-semibold text-navy-950">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

function OptionalSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="border-b border-metal-200 py-7">
      <h3 className="text-lg font-semibold text-navy-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <Field label={label}>
      <select name={name} className={inputClass} defaultValue="">
        <option value="">Choose if known</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </Field>
  );
}

function ValueWithUnit({ label, name, units, inputMode = "decimal" }: { label: string; name: string; units: string[]; inputMode?: "decimal" | "text" }) {
  return (
    <Field label={label}>
      <span className="grid grid-cols-[minmax(0,1fr)_7.5rem]">
        <input
          name={name}
          inputMode={inputMode}
          type={inputMode === "decimal" ? "number" : "text"}
          step={inputMode === "decimal" ? "any" : undefined}
          className={`${inputClass} rounded-r-none border-r-0`}
          placeholder="Value"
        />
        <select name={`${name}-unit`} className={`${inputClass} rounded-l-none`} defaultValue={units[0]} aria-label={`${label} unit`}>
          {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
        </select>
      </span>
    </Field>
  );
}

function ValueOrNotSure({ name, label, unit }: { name: string; label: string; unit: string }) {
  return (
    <Field label={label}>
      <span className="grid grid-cols-[minmax(0,1fr)_7rem]">
        <input name={name} type="number" step="any" inputMode="decimal" className={`${inputClass} rounded-r-none border-r-0`} placeholder="Value" />
        <select name={`${name}-unit`} className={`${inputClass} rounded-l-none`} defaultValue={unit} aria-label={`${label} unit or uncertainty`}>
          <option value={unit}>{unit}</option>
          <option value="Not sure">Not sure</option>
        </select>
      </span>
    </Field>
  );
}

function StraightRunFields() {
  return (
    <fieldset className="sm:col-span-2">
      <legend className={labelClass}>Available straight run</legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <Field label="Upstream"><span className="relative"><input name="upstream-straight-run" type="number" min="0" step="any" className={`${inputClass} pr-10`} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500">D</span></span></Field>
        <Field label="Downstream"><span className="relative"><input name="downstream-straight-run" type="number" min="0" step="any" className={`${inputClass} pr-10`} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500">D</span></span></Field>
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="straight-run-not-sure" value="Not sure" className="h-4 w-4 accent-blue-700" /> Not sure</label>
    </fieldset>
  );
}

function ChipOptions({ name, options, value, onChange }: { name: string; options: string[]; value?: string; onChange?: (value: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => (
        <label key={option} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === undefined ? undefined : value === option}
            onChange={onChange ? () => onChange(option) : undefined}
            className="peer sr-only"
          />
          <span className="focus-ring inline-flex min-h-10 items-center border border-metal-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-industrial-500 hover:text-navy-950 peer-checked:border-industrial-700 peer-checked:bg-blue-50 peer-checked:text-navy-950 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-industrial-600">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <fieldset className="mt-6">
      <legend className={labelClass}>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-3">
        {options.map((option) => (
          <label key={option} className="inline-flex min-h-9 items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name={name} value={option} className="h-4 w-4 accent-blue-700" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function validateQuickReview(form: HTMLFormElement) {
  const data = new FormData(form);
  if (!readValue(data, "medium-name") && !readValue(data, "medium-type")) {
    return "Please add a medium name or choose a medium type.";
  }

  const flowValues = ["minimum-flow", "normal-flow", "maximum-flow"].map((name) => readValue(data, name));
  if (!flowValues.some(Boolean)) {
    return "Please add at least one flow value—minimum, normal or maximum.";
  }

  return "";
}

function buildApplicationSummary(data: FormData): SummaryItem[] {
  const mediumName = readValue(data, "medium-name");
  const mediumType = readValue(data, "medium-type");
  const medium = mediumName && mediumType ? `${mediumName} · ${mediumType}` : mediumName || mediumType || "Not provided";
  const flows = [
    formatNamedValue("Min", data, "minimum-flow"),
    formatNamedValue("Normal", data, "normal-flow"),
    formatNamedValue("Max", data, "maximum-flow")
  ].filter(Boolean);

  return [
    { label: "Medium", value: medium },
    { label: "Flow", value: flows.join(" · ") || "Not provided" },
    { label: "Pressure", value: formatValue(data, "pressure") },
    { label: "Temperature", value: formatValue(data, "temperature") },
    { label: "Pipe", value: formatValue(data, "pipe-size-value") },
    { label: "Purpose", value: readValue(data, "measurement-purpose") || "Not provided" }
  ];
}

function buildApplicationData(data: FormData) {
  const summary = buildApplicationSummary(data);
  const optionalRows: Array<[string, string]> = [
    ["Pipe orientation", readValue(data, "pipe-orientation")],
    ["Full pipe", readValue(data, "full-pipe")],
    ["Upstream straight run", suffixValue(readValue(data, "upstream-straight-run"), "D")],
    ["Downstream straight run", suffixValue(readValue(data, "downstream-straight-run"), "D")],
    ["Straight run", readValue(data, "straight-run-not-sure")],
    ["Immediately upstream", readValues(data, "immediately-upstream")],
    ["Site condition", readValues(data, "site-condition")],
    ["Site vibration", readValue(data, "site-vibration")],
    ["P/T compensation", readValue(data, "pt-compensation")],
    ["Conductivity", formatOptionalValue(data, "conductivity")],
    ["Viscosity", formatOptionalValue(data, "viscosity")],
    ["Solids present", readValue(data, "solids-present")],
    ["Entrained gas / bubbles", readValue(data, "entrained-gas")],
    ["Corrosive", readValue(data, "corrosive")],
    ["Gas composition", readValue(data, "gas-composition")],
    ["Composition stability", readValue(data, "composition-stability")],
    ["Moisture", readValue(data, "moisture")],
    ["Flow basis", readValue(data, "flow-basis")],
    ["Particulates", readValue(data, "particulates")],
    ["Steam type", readValue(data, "steam-type")],
    ["Steam quality", readValue(data, "steam-quality")],
    ["Liquid condition", readValue(data, "liquid-condition")],
    ["Installation type", readValue(data, "installation-type")],
    ["Pipe material", readValue(data, "pipe-material")],
    ["Pipe wall thickness", formatOptionalValue(data, "pipe-wall-thickness")],
    ["Additional notes", readValue(data, "additional-notes")]
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return [
    "Application:",
    ...summary.map((item) => `${item.label}: ${item.value}`),
    ...(optionalRows.length ? ["", "Additional Details:", ...optionalRows.map(([label, value]) => `${label}: ${value}`)] : [])
  ].join("\n");
}

function formatNamedValue(label: string, data: FormData, name: string) {
  const value = readValue(data, name);
  if (!value) return "";
  return `${label} ${value} ${readValue(data, `${name}-unit`)}`.trim();
}

function formatValue(data: FormData, name: string) {
  const value = readValue(data, name);
  const unit = readValue(data, `${name}-unit`);
  if (unit === "Not sure") return value ? `${value} · unit not sure` : "Not sure";
  return value ? `${value} ${unit}`.trim() : "Not provided";
}

function formatOptionalValue(data: FormData, name: string) {
  const value = readValue(data, name);
  const unit = readValue(data, `${name}-unit`);
  if (unit === "Not sure") return "Not sure";
  return value ? `${value} ${unit}`.trim() : "";
}

function suffixValue(value: string, suffix: string) {
  return value ? `${value} ${suffix}` : "";
}

function readValue(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readValues(data: FormData, name: string) {
  return data.getAll(name).filter((value): value is string => typeof value === "string" && Boolean(value.trim())).join(", ");
}

function normalizeMediumType(value?: "liquid" | "gas" | "steam" | "not-sure"): MediumType {
  if (value === "liquid") return "Liquid";
  if (value === "gas") return "Gas";
  if (value === "steam") return "Steam";
  if (value === "not-sure") return "Not sure";
  return "";
}

function trackApplicationReview(
  event: string,
  productSlug: string,
  productCategory: string,
  mediumType: MediumType,
  pagePath: string,
  sourceContext?: ApplicationReviewProps["sourceContext"]
) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    product_slug: productSlug,
    product_category: productCategory,
    medium_type: mediumType || "not_provided",
    page_path: pagePath,
    ...(sourceContext?.sourceType ? { source_type: sourceContext.sourceType } : {}),
    ...(sourceContext?.sourceSection ? { source_section: sourceContext.sourceSection } : {}),
    ...(sourceContext?.applicationType ? { application_type: sourceContext.applicationType } : {})
  });
}

const inputClass = "focus-ring min-h-11 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-2.5 text-base text-navy-950 transition placeholder:text-slate-400 focus-visible:border-industrial-600";
const labelClass = "text-sm font-semibold text-navy-950";
