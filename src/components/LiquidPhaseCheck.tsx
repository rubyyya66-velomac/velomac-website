"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ApplicationReviewLink } from "@/components/ApplicationReviewLink";
import { Container } from "@/components/Layout";
import { trackAnalyticsEvent } from "@/lib/analytics";

const PRESSURE_UNITS = [
  "bar(g)",
  "bar(a)",
  "kPa(g)",
  "kPa(a)",
  "MPa(g)",
  "MPa(a)",
  "psi(g)",
  "psi(a)",
];

const ABSOLUTE_PRESSURE_UNITS = ["bar(a)", "kPa(a)", "MPa(a)", "psi(a)"];
const TEMPERATURE_UNITS = ["°C", "°F"];
const STORAGE_KEY = "velomac-liquid-phase-check";

type PhaseCheckState = {
  operatingPressureValue: string;
  operatingPressureUnit: string;
  operatingTemperatureValue: string;
  operatingTemperatureUnit: string;
  vaporPressureValue: string;
  vaporPressureUnit: string;
  minimumDownstreamPressureValue: string;
  minimumDownstreamPressureUnit: string;
  entrainedGas: string;
  viscosityAtOperatingTemperature: string;
  densitySpecificGravity: string;
  solidsPresence: string;
};

const INITIAL_STATE: PhaseCheckState = {
  operatingPressureValue: "",
  operatingPressureUnit: "bar(g)",
  operatingTemperatureValue: "",
  operatingTemperatureUnit: "°C",
  vaporPressureValue: "",
  vaporPressureUnit: "bar(a)",
  minimumDownstreamPressureValue: "",
  minimumDownstreamPressureUnit: "bar(g)",
  entrainedGas: "",
  viscosityAtOperatingTemperature: "",
  densitySpecificGravity: "",
  solidsPresence: "",
};

function trackEvent(event: string) {
  trackAnalyticsEvent(event, {
    source_page: "liquid_turbine_flowmeter",
  });
}

function FieldShell({
  label,
  children,
  help,
}: {
  label: string;
  children: ReactNode;
  help?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy-950">{label}</span>
      <span className="mt-2 block">{children}</span>
      {help ? (
        <span className="mt-2 block text-xs leading-5 text-slate-600">{help}</span>
      ) : null}
    </label>
  );
}

function ValueWithUnit({
  label,
  value,
  unit,
  units,
  placeholder,
  help,
  onValueChange,
  onUnitChange,
}: {
  label: string;
  value: string;
  unit: string;
  units: string[];
  placeholder: string;
  help?: string;
  onValueChange: (value: string) => void;
  onUnitChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label} help={help}>
      <span className="grid grid-cols-[minmax(0,1fr)_7.25rem] overflow-hidden rounded-sm border border-metal-200 bg-white focus-within:border-industrial-600 focus-within:ring-1 focus-within:ring-industrial-600/20">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          aria-label={`${label} value`}
          className="min-h-11 min-w-0 border-0 bg-transparent px-3 py-2 text-base text-navy-950 outline-none placeholder:text-slate-400"
        />
        <select
          value={unit}
          onChange={(event) => onUnitChange(event.target.value)}
          aria-label={`${label} unit`}
          className="min-h-11 border-0 border-l border-metal-200 bg-metal-50 px-2 text-sm font-medium text-navy-950 outline-none"
        >
          {units.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </span>
    </FieldShell>
  );
}

export default function LiquidPhaseCheck() {
  const [values, setValues] = useState<PhaseCheckState>(INITIAL_STATE);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const viewedRef = useRef(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setValues({ ...INITIAL_STATE, ...(JSON.parse(stored) as Partial<PhaseCheckState>) });
      }
    } catch {
      // Keep the default empty state when session storage is unavailable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      // The phase check remains usable without storage persistence.
    }
  }, [hydrated, values]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !viewedRef.current) {
          viewedRef.current = true;
          trackEvent("liquid_phase_check_view");
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function updateValue<Key extends keyof PhaseCheckState>(key: Key, value: PhaseCheckState[Key]) {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("liquid_phase_check_started");
    }
    setValues((current) => ({ ...current, [key]: value }));
  }

  const messages = useMemo(() => {
    const next: string[] = [];
    const hasAllPrimary = Boolean(
      values.operatingPressureValue &&
        values.operatingTemperatureValue &&
        values.vaporPressureValue &&
        values.minimumDownstreamPressureValue &&
        values.entrainedGas,
    );

    if (["Yes", "Possible", "Not sure"].includes(values.entrainedGas)) {
      next.push(
        "Include this condition in the application review before final turbine sizing.",
      );
    }

    if (hasAllPrimary) {
      next.push(
        "Liquid condition details added. Continue with flow range and sizing information.",
      );
    } else if (values.vaporPressureValue && values.minimumDownstreamPressureValue) {
      next.push(
        "These values should be reviewed together with the expected meter pressure drop and local pressure conditions.",
      );
    } else if (!values.vaporPressureValue) {
      next.push(
        "You can still submit the application. Fluid information can be reviewed during selection.",
      );
    }

    return next;
  }, [values]);

  function handleReviewClick() {
    trackEvent("liquid_phase_check_cta");
    window.dispatchEvent(
      new CustomEvent("velomac:application-review-prefill", {
        detail: {
          productSlug: "liquid-turbine-flowmeter",
          mediumType: "liquid",
          operatingPressureValue: values.operatingPressureValue,
          operatingPressureUnit: values.operatingPressureUnit,
          operatingTemperatureValue: values.operatingTemperatureValue,
          operatingTemperatureUnit: values.operatingTemperatureUnit,
          vaporPressureValue: values.vaporPressureValue,
          vaporPressureUnit: values.vaporPressureUnit,
          minimumDownstreamPressureValue: values.minimumDownstreamPressureValue,
          minimumDownstreamPressureUnit: values.minimumDownstreamPressureUnit,
          entrainedGas: values.entrainedGas,
          viscosityAtOperatingTemperature: values.viscosityAtOperatingTemperature,
          densitySpecificGravity: values.densitySpecificGravity,
          solidsPresence: values.solidsPresence,
          sourceSection: "liquid-phase-check",
        },
      }),
    );
  }

  return (
    <section
      ref={sectionRef}
      id="liquid-phase-check"
      data-application-review-entry
      className="scroll-mt-32 border-y border-metal-200 bg-metal-50 py-12 md:py-16"
    >
      <Container>
        <div className="max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Pre-selection check</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy-950 md:text-4xl">
            Screen for Vapor Formation Before Selecting a Liquid Turbine Flowmeter
          </h2>
          <div className="mt-4 max-w-3xl space-y-2 text-base leading-7 text-slate-700">
            <p>
              Liquid turbine selection starts with more than flow range. For liquids that may
              approach their vapor-pressure condition, review pressure, temperature and
              downstream pressure before final sizing.
            </p>
            <p>
              Possible entrained gas should also be identified because the meter should be
              evaluated around the actual liquid condition.
            </p>
          </div>
        </div>

        <div className="mt-7 overflow-hidden border border-metal-200 bg-white shadow-[0_16px_45px_rgba(15,32,57,0.06)]">
          <div className="border-b border-metal-200 px-5 py-5 md:px-7">
            <h3 className="text-xl font-semibold text-navy-950">Liquid Phase Check</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Share what you know. These conditions can be reviewed before final turbine sizing.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-6 px-5 py-6 md:grid-cols-2 md:px-7">
            <ValueWithUnit
              label="Operating Pressure at the Meter"
              value={values.operatingPressureValue}
              unit={values.operatingPressureUnit}
              units={PRESSURE_UNITS}
              placeholder="e.g. 6"
              help="Use the pressure expected at the intended meter location and identify whether it is gauge or absolute."
              onValueChange={(value) => updateValue("operatingPressureValue", value)}
              onUnitChange={(value) => updateValue("operatingPressureUnit", value)}
            />
            <ValueWithUnit
              label="Operating Temperature"
              value={values.operatingTemperatureValue}
              unit={values.operatingTemperatureUnit}
              units={TEMPERATURE_UNITS}
              placeholder="e.g. 70"
              onValueChange={(value) => updateValue("operatingTemperatureValue", value)}
              onUnitChange={(value) => updateValue("operatingTemperatureUnit", value)}
            />
            <ValueWithUnit
              label="Vapor Pressure at Operating Temperature"
              value={values.vaporPressureValue}
              unit={values.vaporPressureUnit}
              units={ABSOLUTE_PRESSURE_UNITS}
              placeholder="If known"
              help="Use vapor pressure at the stated operating temperature. Vapor pressure is an absolute pressure value."
              onValueChange={(value) => updateValue("vaporPressureValue", value)}
              onUnitChange={(value) => updateValue("vaporPressureUnit", value)}
            />
            <ValueWithUnit
              label="Minimum Downstream Pressure"
              value={values.minimumDownstreamPressureValue}
              unit={values.minimumDownstreamPressureUnit}
              units={PRESSURE_UNITS}
              placeholder="e.g. 4.5"
              help="Use the lowest expected downstream pressure and identify whether it is gauge or absolute."
              onValueChange={(value) => updateValue("minimumDownstreamPressureValue", value)}
              onUnitChange={(value) => updateValue("minimumDownstreamPressureUnit", value)}
            />
            <FieldShell label="Entrained Gas or Bubbles Present?">
              <select
                value={values.entrainedGas}
                onChange={(event) => updateValue("entrainedGas", event.target.value)}
                className="min-h-11 w-full rounded-sm border border-metal-200 bg-white px-3 py-2 text-base text-navy-950 outline-none focus:border-industrial-600 focus:ring-1 focus:ring-industrial-600/20"
              >
                <option value="">Select if known</option>
                <option value="No known gas">No known gas</option>
                <option value="Yes">Yes</option>
                <option value="Possible">Possible</option>
                <option value="Not sure">Not sure</option>
              </select>
            </FieldShell>

            <div className="md:col-span-2">
              <button
                type="button"
                aria-expanded={detailsOpen}
                onClick={() => {
                  setDetailsOpen((current) => !current);
                  if (!detailsOpen) trackEvent("liquid_phase_check_expand");
                }}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-industrial-700 hover:text-navy-950"
              >
                <span>{detailsOpen ? "−" : "+"}</span>
                {detailsOpen ? "Hide Liquid Details" : "Add Liquid Details"}
              </button>
            </div>

            {detailsOpen ? (
              <div className="grid gap-6 border-t border-metal-200 pt-6 md:col-span-2 md:grid-cols-3">
                <FieldShell label="Viscosity at Operating Temperature">
                  <input
                    type="text"
                    value={values.viscosityAtOperatingTemperature}
                    onChange={(event) =>
                      updateValue("viscosityAtOperatingTemperature", event.target.value)
                    }
                    placeholder="e.g. 5 cP at 70°C"
                    className="min-h-11 w-full rounded-sm border border-metal-200 px-3 py-2 text-base text-navy-950 outline-none placeholder:text-slate-400 focus:border-industrial-600 focus:ring-1 focus:ring-industrial-600/20"
                  />
                </FieldShell>
                <FieldShell label="Density / Specific Gravity">
                  <input
                    type="text"
                    value={values.densitySpecificGravity}
                    onChange={(event) => updateValue("densitySpecificGravity", event.target.value)}
                    placeholder="If known"
                    className="min-h-11 w-full rounded-sm border border-metal-200 px-3 py-2 text-base text-navy-950 outline-none placeholder:text-slate-400 focus:border-industrial-600 focus:ring-1 focus:ring-industrial-600/20"
                  />
                </FieldShell>
                <FieldShell label="Solids or Particles Present?">
                  <select
                    value={values.solidsPresence}
                    onChange={(event) => updateValue("solidsPresence", event.target.value)}
                    className="min-h-11 w-full rounded-sm border border-metal-200 bg-white px-3 py-2 text-base text-navy-950 outline-none focus:border-industrial-600 focus:ring-1 focus:ring-industrial-600/20"
                  >
                    <option value="">Select if known</option>
                    <option value="None known">None known</option>
                    <option value="Yes">Yes</option>
                    <option value="Possible">Possible</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                </FieldShell>
              </div>
            ) : null}
          </div>

          <div className="border-t border-metal-200 bg-metal-50 px-5 py-5 md:px-7">
            <div className="space-y-2" aria-live="polite">
              {messages.map((message) => (
                <p key={message} className="text-sm leading-6 text-slate-700">
                  {message}
                </p>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ApplicationReviewLink
                href="#application-review"
                sourceType="product"
                sourcePath="/products/liquid-turbine-flowmeter"
                sourceSection="liquid-phase-check"
                productSlug="liquid-turbine-flowmeter"
                onNavigate={handleReviewClick}
                className="inline-flex min-h-12 items-center justify-center bg-industrial-700 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-navy-950 sm:w-auto"
              >
                Review Your Liquid Application
              </ApplicationReviewLink>
              <a
                href="#technical-data"
                className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-industrial-700 hover:text-navy-950 sm:justify-start"
              >
                See Liquid Turbine Technical Data →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 grid border-y border-metal-200 md:grid-cols-3 md:divide-x md:divide-metal-200">
          {[
            ["01", "Check Liquid Condition", "P/T, vapor pressure, downstream pressure, gas"],
            ["02", "Check Operating Range", "Minimum, normal and maximum flow"],
            ["03", "Size the Meter", "Meter size and configuration"],
          ].map(([number, title, copy]) => (
            <div key={number} className="flex gap-4 py-4 md:px-5 first:md:pl-0">
              <span className="text-xs font-semibold tracking-[0.18em] text-industrial-700">{number}</span>
              <div>
                <h3 className="text-sm font-semibold text-navy-950">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <h3 className="text-xl font-semibold text-navy-950">
              Why does vapor pressure matter when selecting a liquid turbine flowmeter?
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              If local liquid pressure approaches the vapor-pressure condition, vapor may form
              around the measurement point. Operating P/T, downstream pressure and meter pressure
              loss should therefore be reviewed before final turbine sizing when this condition is
              relevant.
            </p>
          </div>
          <div className="border-l-2 border-industrial-600/35 pl-5 text-sm leading-6 text-slate-700">
            <p>
              Especially worth reviewing for hydrocarbons, fuels, condensate, solvents and other
              liquids where vapor formation may become relevant under operating conditions.
            </p>
            <p className="mt-3">
              Valves, reducers and other local restrictions can change pressure conditions around
              the measurement point. Include nearby piping details when they may affect the
              application.
            </p>
          </div>
        </div>

        <div className="mt-7 border-t border-metal-200 pt-5 text-sm leading-6 text-slate-600">
          <p>
            Liquid condition should be reviewed before final turbine sizing when vapor formation,
            low downstream pressure or entrained gas may be present.
          </p>
          <p className="mt-1">
            This is an application-condition review rather than an instrument-setting adjustment.
          </p>
        </div>
      </Container>
    </section>
  );
}
