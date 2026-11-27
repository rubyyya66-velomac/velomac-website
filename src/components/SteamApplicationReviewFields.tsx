"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { steamConditions, steamFlowUnit, steamInstrumentation, steamMeasurementOutputs, steamSystemOutputs } from "@/lib/steamApplicationReview";

const inputClass = "focus-ring min-h-11 w-full min-w-0 rounded border border-metal-200 bg-white px-3 py-2.5 text-base text-navy-950 placeholder:text-slate-400";

export function SteamApplicationReviewFields() {
  const [output, setOutput] = useState("Not Sure");
  const [outputChanged, setOutputChanged] = useState(false);
  const [unit, setUnit] = useState("Not Sure");
  const [instruments, setInstruments] = useState<string[]>([]);

  return (
    <div className="divide-y divide-metal-200 border-y border-metal-200">
      <input type="hidden" name="medium-type" value="Steam" />
      <input type="hidden" name="medium-name" value="Steam" />
      <section className="py-5">
        <h3 className="text-lg font-semibold text-navy-950">1. Measurement Output &amp; Flow Range</h3>
        <Field label="What flow measurement output do you require?" name="steam-measurement-output">
          <select id="steam-measurement-output" name="steam-measurement-output" value={output} className={inputClass} onChange={(event) => {
            const form = event.currentTarget.form;
            const hasValues = ["minimum-flow", "normal-flow", "maximum-flow"].some((name) => Boolean((form?.elements.namedItem(name) as HTMLInputElement | null)?.value));
            if (!hasValues) setUnit(steamFlowUnit(event.target.value));
            setOutput(event.target.value);
            setOutputChanged(true);
          }}>
            {Object.keys(steamMeasurementOutputs).map((value) => <option key={value}>{value}</option>)}
          </select>
        </Field>
        <Field label="Unit of the flow values you are providing" name="steam-flow-unit">
          <select id="steam-flow-unit" name="steam-flow-unit" value={unit} className={inputClass} onChange={(event) => { setUnit(event.target.value); setOutputChanged(true); }}>
            {["m³/h", "kg/h", "t/h", "Not Sure"].map((value) => <option key={value}>{value}</option>)}
          </select>
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Minimum Flow", "minimum-flow"], ["Normal Flow", "normal-flow"], ["Maximum Flow", "maximum-flow"]].map(([label, name]) => (
            <Field key={name} label={`${label} (${unit})`} name={name}>
              <input id={name} name={name} type="number" inputMode="decimal" step="any" min="0" className={inputClass} aria-describedby="steam-flow-help" placeholder="If known" />
              <input type="hidden" name={`${name}-unit`} value={unit} />
            </Field>
          ))}
        </div>
        <p id="steam-flow-help" className="mt-3 text-sm leading-6 text-slate-600">Please provide the available operating flow range. If only one or two values are available, you may still submit your application.</p>
        {outputChanged ? <p className="mt-2 text-xs leading-5 text-industrial-700" role="status">The required output and your known flow units are recorded separately. Changing the output does not change entered flow values or their units. No automatic conversion is performed.</p> : null}
      </section>

      <section className="py-5">
        <h3 className="text-lg font-semibold text-navy-950">2. Steam Operating Conditions</h3>
        <Select name="steam-condition" label="Steam Condition" options={steamConditions} defaultValue="Not Sure" />
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Quantity name="pressure" label="Operating Pressure" units={["bar", "MPa", "kPa"]} />
          <Select name="steam-pressure-reference" label="Pressure Reference" options={["Gauge Pressure", "Absolute Pressure", "Not Sure"]} defaultValue="Not Sure" />
          <Quantity name="temperature" label="Operating Temperature" units={["°C", "°F"]} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">Please provide the pressure and temperature at the intended flow measurement location, if available.</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">For dry saturated steam in equilibrium, absolute pressure or saturation temperature may establish density. Superheated steam needs both absolute pressure and temperature; wet steam requires separate assessment. Missing values can be confirmed during review.</p>
      </section>

      <details className="group py-4">
        <summary className="focus-ring cursor-pointer py-1 text-base font-semibold text-navy-950">3. Pipe &amp; Installation Details <span className="text-sm font-normal text-slate-500">— optional</span></summary>
        <div className="grid gap-x-4 pb-1 sm:grid-cols-2">
          <Field name="pipe-size-value" label="Pipe Size (DN)"><input id="pipe-size-value" name="pipe-size-value" type="number" min="0" step="any" inputMode="decimal" placeholder="If known" className={inputClass} /><input type="hidden" name="pipe-size-value-unit" value="DN" /></Field>
          <Select name="connection-standard" label="Connection Standard" options={["EN 1092-1", "ASME B16.5", "JIS", "Other", "Not Sure"]} />
          <Quantity name="upstream-straight-run" label="Available Upstream Straight Pipe" units={["D", "mm", "m", "Not Sure"]} nonnegative />
          <Quantity name="downstream-straight-run" label="Available Downstream Straight Pipe" units={["D", "mm", "m", "Not Sure"]} nonnegative />
          <Select name="nearby-fittings" label="Nearby Elbows / Valves / Reducers" options={["None known", "Elbows", "Valves", "Reducers", "Multiple fittings", "Other", "Not Sure"]} />
          <Select name="pipe-orientation" label="Installation Position" options={["Horizontal", "Vertical", "Other", "Not Sure"]} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">D means pipe diameters. Enter available lengths, not a required minimum. Unknown details can be left blank or marked Not Sure.</p>
      </details>

      <details className="py-4">
        <summary className="focus-ring cursor-pointer py-1 text-base font-semibold text-navy-950">4. Existing Instrumentation <span className="text-sm font-normal text-slate-500">— optional</span></summary>
        <fieldset className="mt-3">
          <legend className="text-sm font-semibold text-navy-950">What instrumentation is currently available?</legend>
          <div className="mt-2 grid gap-1 sm:grid-cols-2">
            {steamInstrumentation.map((value) => <label key={value} className="flex min-h-11 items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="steam-instrumentation" value={value} checked={instruments.includes(value)} className="h-4 w-4 accent-blue-700" onChange={(event) => setInstruments((current) => event.target.checked ? (value === "None" || value === "Not Sure" ? [value] : [...current.filter((item) => item !== "None" && item !== "Not Sure"), value]) : current.filter((item) => item !== value))} />{value}</label>)}
          </div>
        </fieldset>
        <Select name="output-communication" label="Required Output / Control System" options={steamSystemOutputs} />
        <p className="mt-3 text-xs leading-5 text-slate-500">Tell us about your existing system or required interface. Availability depends on the selected meter configuration and engineering review.</p>
      </details>
    </div>
  );
}

function Field({ name, label, children }: { name: string; label: string; children: ReactNode }) {
  return <div className="mt-3 grid min-w-0 content-start gap-2"><label htmlFor={name} className="text-sm font-semibold leading-5 text-navy-950">{label}</label>{children}</div>;
}

function Select({ name, label, options, defaultValue = "" }: { name: string; label: string; options: string[]; defaultValue?: string }) {
  return <Field name={name} label={label}><select id={name} name={name} className={inputClass} defaultValue={defaultValue}>{!defaultValue ? <option value="">Choose if known</option> : null}{options.map((value) => <option key={value}>{value}</option>)}</select></Field>;
}

function Quantity({ name, label, units, nonnegative = false }: { name: string; label: string; units: string[]; nonnegative?: boolean }) {
  return <Field name={name} label={label}><div className="grid grid-cols-[minmax(0,1fr)_6.25rem]"><input id={name} name={name} type="number" step="any" min={nonnegative ? 0 : undefined} inputMode="decimal" placeholder="If known" className={`${inputClass} rounded-r-none border-r-0`} /><select name={`${name}-unit`} aria-label={`${label} unit`} defaultValue={units[0]} className={`${inputClass} rounded-l-none`}>{units.map((value) => <option key={value}>{value}</option>)}</select></div></Field>;
}
