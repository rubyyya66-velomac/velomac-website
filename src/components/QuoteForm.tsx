"use client";

import { useEffect, useRef, useState } from "react";
import { contactContent } from "@/content/contact";
import { products } from "@/content/products";
import { trackAnalyticsEvent } from "@/lib/analytics";

const applicationLabels: Record<string, string> = {
  "steam-measurement": "Steam Measurement",
  "gas-flow-measurement": "Gas Flow Measurement",
  "conductive-liquid-measurement": "Conductive Liquid Measurement",
  "chemical-process-lines": "Chemical Process Lines",
  "high-vibration-pipelines": "High Vibration Pipelines",
  "energy-loss-visibility": "Energy Loss Visibility"
};

function fieldName(label: string) {
  return label.toLowerCase().replaceAll(" / ", "-").replaceAll(" ", "-");
}

export function QuoteForm() {
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedProductInterest, setSelectedProductInterest] = useState("");
  const [sourceProductSlug, setSourceProductSlug] = useState("");
  const [sourceApplicationSlug, setSourceApplicationSlug] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const startedAt = useRef(Date.now());
  const hasStarted = useRef(false);
  const { form } = contactContent;

  useEffect(() => {
    const requestedProductSlug = new URLSearchParams(window.location.search).get("product") || "";
    const requestedProduct = products.find((product) => product.slug === requestedProductSlug);
    if (requestedProduct) {
      setSelectedProductInterest(requestedProduct.name);
      setSourceProductSlug(requestedProduct.slug);
    }
    const requestedApplicationSlug = new URLSearchParams(window.location.search).get("application") || "";
    if (applicationLabels[requestedApplicationSlug]) {
      setSourceApplicationSlug(requestedApplicationSlug);
    }
    trackQuoteForm("quote_form_view");
  }, []);

  function markStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackQuoteForm("quote_form_start");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");
    setSubmissionError("");
    trackQuoteForm("quote_form_submit");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(result?.message || form.errorMessage);
      }

      formElement.reset();
      startedAt.current = Date.now();
      hasStarted.current = false;
      setSubmissionState("success");
      trackQuoteForm("quote_form_success");
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : form.errorMessage);
      setSubmissionState("error");
      trackQuoteForm("quote_form_error");
    }
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
    >
      <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="started-at" value={startedAt.current} readOnly />
      <input type="hidden" name="source-product-slug" value={sourceProductSlug} readOnly />
      <input type="hidden" name="source-application-slug" value={sourceApplicationSlug} readOnly />
      <p className="border-l-2 border-industrial-600 bg-metal-50 px-4 py-3 text-sm leading-6 text-slate-600">
        {form.helperText}
        {sourceApplicationSlug ? ` Application context: ${applicationLabels[sourceApplicationSlug]}.` : ""}
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {form.fields.map((field) => (
          <Field key={field.name} label={field.label}>
            <input
              className="focus-ring min-h-11 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-base text-navy-950 transition focus-visible:border-industrial-600 sm:text-sm"
              name={field.name || fieldName(field.label)}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder || undefined}
            />
          </Field>
        ))}
        <Field label={form.productInterestLabel}>
          <select
            className="focus-ring min-h-11 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-base text-navy-950 transition focus-visible:border-industrial-600 sm:text-sm"
            name={form.productInterestName}
            value={selectedProductInterest}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedProductInterest(value);
              setSourceProductSlug(products.find((product) => product.name === value)?.slug || "");
            }}
          >
            <option value="">{form.productInterestPlaceholder}</option>
            {products.map((product) => (
              <option key={product.slug} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </Field>
        {form.processFields.map((field) => (
          <Field key={field.name} label={field.label}>
            <input
              className="focus-ring min-h-11 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-base text-navy-950 transition focus-visible:border-industrial-600 sm:text-sm"
              name={field.name || fieldName(field.label)}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder || undefined}
            />
          </Field>
        ))}
      </div>
      <Field label={form.requirementsLabel}>
        <textarea
          className="focus-ring min-h-44 w-full rounded-[4px] border border-metal-200 px-3 py-3 text-base text-navy-950 transition focus-visible:border-industrial-600 sm:text-sm"
          name={form.requirementsName}
          placeholder={form.requirementsPlaceholder || undefined}
          required
        />
      </Field>
      <Field label={form.attachmentLabel}>
        <input
          className="focus-ring min-h-11 w-full max-w-full rounded-[4px] border border-dashed border-metal-200 px-3 py-3 text-sm text-slate-600 transition focus-visible:border-industrial-600"
          type="file"
          name={form.attachmentName}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          aria-describedby="quote-attachment-help"
        />
        <span id="quote-attachment-help" className="text-xs font-normal leading-5 text-slate-500">
          PDF, JPG, PNG or WebP, up to 5 MB.
        </span>
      </Field>
      <button
        type="submit"
        disabled={submissionState === "submitting"}
        className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
      >
        {submissionState === "submitting" ? "Submitting..." : form.submitLabel}
        <span aria-hidden="true">{">"}</span>
      </button>
      {submissionState === "success" ? (
        <div className="rounded-[6px] border border-industrial-600 bg-blue-50 px-4 py-4 text-sm leading-6 text-navy-950" role="status">
          {form.confirmationMessage}
        </div>
      ) : null}
      {submissionState === "error" ? (
        <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-900" role="alert">
          {submissionError || form.errorMessage}{" "}
          <a className="font-semibold underline" href={`mailto:${form.errorEmail}`}>
            {form.errorEmail}
          </a>
          .
        </div>
      ) : null}
    </form>
  );
}

function trackQuoteForm(event: string) {
  trackAnalyticsEvent(event, {
    form_type: "quote_request",
    page_path: window.location.pathname
  });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-navy-950">
      <span>{label}</span>
      {children}
    </label>
  );
}
