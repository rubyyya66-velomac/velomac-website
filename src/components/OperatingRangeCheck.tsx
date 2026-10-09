"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ApplicationReviewLink } from "@/components/ApplicationReviewLink";

const flowUnits = ["m³/h", "L/min", "L/h", "kg/h", "t/h"] as const;

type RangeResult = {
  minimum: number;
  normal: number;
  maximum: number;
  unit: (typeof flowUnits)[number];
  ratio: number;
  withinRange: boolean;
};

type OperatingRangeCheckProps = {
  pagePath: string;
  productSlug: string;
};

export function OperatingRangeCheck({ pagePath, productSlug }: OperatingRangeCheckProps) {
  const [minimum, setMinimum] = useState("");
  const [normal, setNormal] = useState("");
  const [maximum, setMaximum] = useState("");
  const [unit, setUnit] = useState<(typeof flowUnits)[number]>("m³/h");
  const [result, setResult] = useState<RangeResult | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const minimumValue = Number(minimum);
    const normalValue = Number(normal);
    const maximumValue = Number(maximum);

    if (!Number.isFinite(minimumValue) || minimumValue <= 0) {
      setResult(null);
      setError("Minimum flow must be greater than 0.");
      return;
    }

    if (!Number.isFinite(maximumValue) || maximumValue <= minimumValue) {
      setResult(null);
      setError("Maximum flow should be greater than minimum flow.");
      return;
    }

    if (!Number.isFinite(normalValue) || normalValue < minimumValue || normalValue > maximumValue) {
      setResult(null);
      setError("Normal flow should sit between minimum and maximum flow.");
      return;
    }

    const ratio = maximumValue / minimumValue;
    const nextResult = {
      minimum: minimumValue,
      normal: normalValue,
      maximum: maximumValue,
      unit,
      ratio,
      withinRange: ratio <= 70
    };

    setError("");
    setResult(nextResult);
    trackRangeCheck("vortex_range_check", productSlug, pagePath, {
      required_turndown: Number(ratio.toFixed(2)),
      result: nextResult.withinRange ? "within_1_70" : "exceeds_1_70",
      selected_unit: unit
    });
  }

  function prefillApplicationReview() {
    if (!result) return;

    trackRangeCheck("vortex_range_review_application", productSlug, pagePath, {
      required_turndown: Number(result.ratio.toFixed(2)),
      selected_unit: result.unit
    });

    window.dispatchEvent(
      new CustomEvent("velomac:application-review-prefill", {
        detail: {
          productSlug,
          minimumFlow: String(result.minimum),
          normalFlow: String(result.normal),
          maximumFlow: String(result.maximum),
          flowUnit: result.unit
        }
      })
    );
  }

  return (
    <div
      id="operating-range-check"
      data-application-review-entry
      aria-labelledby="operating-range-check-title"
      className="mt-10 scroll-mt-28 border-t border-white/15 pt-8 sm:mt-14 sm:pt-10"
    >
      <div className="bg-white text-navy-950 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
        <div className="grid gap-7 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:px-10">
          <div className="lg:py-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              Preliminary operating range check
            </p>
            <h2 id="operating-range-check-title" className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.015em] sm:text-3xl">
              What Does 1:70 Need to Cover in Your Application?
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-6 text-slate-600 sm:text-base sm:leading-7">
              Enter your operating flow range to make a quick preliminary check before reviewing the full application.
            </p>
            <p className="mt-5 border-l-2 border-industrial-600 pl-4 text-sm leading-6 text-slate-500">
              This compares operating span only. Final selection also depends on the medium, pressure, temperature, density, pipe size, velocity and installation conditions.
            </p>
          </div>

          <div className="min-w-0">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_0.9fr]">
                <RangeInput label="Minimum Flow" value={minimum} onChange={setMinimum} placeholder="e.g. 2" />
                <RangeInput label="Normal Flow" value={normal} onChange={setNormal} placeholder="e.g. 40" />
                <RangeInput label="Maximum Flow" value={maximum} onChange={setMaximum} placeholder="e.g. 100" />
                <label className="block">
                  <span className="text-sm font-semibold text-navy-950">Unit</span>
                  <select
                    value={unit}
                    onChange={(event) => setUnit(event.target.value as (typeof flowUnits)[number])}
                    className={inputClass}
                  >
                    {flowUnits.map((flowUnit) => (
                      <option key={flowUnit} value={flowUnit}>{flowUnit}</option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="focus-ring mt-5 inline-flex min-h-12 w-full items-center justify-center bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 sm:w-auto"
              >
                Check Your Operating Range
              </button>
              {error ? <p role="alert" className="mt-3 text-sm font-semibold leading-6 text-red-700">{error}</p> : null}
            </form>

            {result ? (
              <div className="mt-6 border-t border-metal-200 pt-5" aria-live="polite">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Your operating range</p>
                <p className="mt-2 text-lg font-semibold text-navy-950">
                  {formatFlow(result.minimum)} <span className="text-industrial-600">→</span> {formatFlow(result.normal)} <span className="text-industrial-600">→</span> {formatFlow(result.maximum)} {result.unit}
                </p>
                <p className="mt-1 text-xs text-slate-500">Minimum → Normal → Maximum</p>

                <div className="mt-5 grid border-y border-metal-200 sm:grid-cols-2 sm:divide-x sm:divide-metal-200">
                  <div className="py-4 sm:pr-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Your application</p>
                    <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-industrial-700">1:{formatRatio(result.ratio)}</p>
                    <p className="mt-1 text-xs font-semibold text-navy-950">Required range</p>
                  </div>
                  <div className="border-t border-metal-200 py-4 sm:border-t-0 sm:pl-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Anti-Vibration Vortex</p>
                    <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-navy-950">Up to 1:70</p>
                    <p className="mt-1 text-xs font-semibold text-navy-950">Stated maximum turndown</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  {result.withinRange
                    ? "This operating span falls within the stated maximum turndown range. Final meter selection still depends on the complete application conditions."
                    : "This operating span exceeds the stated 1:70 range. Let us review the application and suitable meter configuration."}
                </p>

                <ApplicationReviewLink
                  href="#application-review"
                  sourceType="product"
                  sourceSection="operating-range-check"
                  sourcePath={pagePath}
                  productSlug={productSlug}
                  onNavigate={prefillApplicationReview}
                  className="focus-ring mt-4 inline-flex min-h-11 w-fit items-center justify-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
                >
                  Review Your Application <span aria-hidden="true">→</span>
                </ApplicationReviewLink>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function RangeInput({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-navy-950">{label}</span>
      <input
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function formatFlow(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(value);
}

function formatRatio(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function trackRangeCheck(event: string, productSlug: string, pagePath: string, details: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    product_slug: productSlug,
    page_path: pagePath,
    source_section: "operating-range-check",
    ...details
  });
}

const inputClass = "focus-ring mt-2 min-h-11 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-2.5 text-base text-navy-950 transition placeholder:text-slate-400 focus-visible:border-industrial-600";
