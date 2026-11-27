import { ArrowDown } from "lucide-react";
import { Container } from "@/components/Layout";

export function SteamFlowResultGuide() {
  return (
    <section aria-labelledby="steam-flow-result-title" className="border-b border-metal-200 py-9 sm:py-12">
      <Container>
      <h2 id="steam-flow-result-title" className="scroll-mt-32 text-[1.65rem] font-semibold leading-tight text-navy-950 sm:text-3xl lg:scroll-mt-44">
        What Flow Result Does Your Application Require?
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
        Confirm whether the required output is operating volumetric flow (m³/h) or steam mass flow (kg/h or t/h). For mass-flow measurement, confirm the steam condition and available pressure and temperature data at the measuring point before defining the density-compensation arrangement.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="rounded-md border border-metal-200 bg-white p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-industrial-700">Measured input</p>
          <h3 className="text-base font-semibold text-navy-950">Operating Volumetric Flow</h3>
          <p className="mt-1 text-2xl font-semibold text-industrial-700">m³/h</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">Volume of steam passing through the pipeline under actual operating conditions.</p>
        </article>
        <article className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-industrial-700">Calculated output</p>
          <h3 className="text-base font-semibold text-navy-950">Steam Mass Flow</h3>
          <p className="mt-1 text-2xl font-semibold text-industrial-700">kg/h or t/h</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">Mass of steam passing through the pipeline. Density compensation may be required when deriving mass flow from volumetric measurement.</p>
        </article>
      </div>

      <figure aria-labelledby="steam-conversion-diagram-title" className="mt-4 rounded-md border border-metal-200 bg-white p-3 sm:p-4">
        <figcaption id="steam-conversion-diagram-title" className="text-sm font-semibold text-navy-950">How the Mass-Flow Result Is Calculated</figcaption>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-0">
          <div className="flex flex-col items-center justify-between gap-2 rounded-sm border-t-2 border-industrial-600 bg-metal-50 px-3 py-3 text-center text-sm leading-5 text-slate-700 sm:px-4">
            <p>Vortex Flow Measurement</p>
            <ArrowDown aria-hidden="true" size={16} className="shrink-0 text-industrial-700" />
            <p className="font-semibold text-navy-950">Operating Volumetric Flow <span className="block font-normal text-industrial-700">m³/h · measured basis</span></p>
          </div>
          <div className="flex flex-col items-center justify-between gap-2 rounded-sm border-t-2 border-slate-400 bg-metal-50 px-3 py-3 text-center text-sm leading-5 text-slate-700 sm:px-4">
            <p>Absolute Pressure · Operating Temperature · Steam Condition</p>
            <ArrowDown aria-hidden="true" size={16} className="shrink-0 text-industrial-700" />
            <p className="font-semibold text-navy-950">Steam Density Determination <span className="block font-normal text-industrial-700">kg/m³ · from steam properties</span></p>
          </div>
          <ArrowDown aria-hidden="true" size={16} className="my-1.5 hidden justify-self-center text-industrial-700 sm:block" />
          <ArrowDown aria-hidden="true" size={16} className="my-1.5 justify-self-center text-industrial-700" />
          <div className="rounded-sm border-l-2 border-industrial-600 bg-blue-50 px-3 py-2.5 text-center text-navy-950 sm:col-span-2">
            <p className="text-sm font-semibold">Compensated Mass Flow · calculated output</p>
            <p className="mt-1 text-sm leading-5">Mass flow = operating volumetric flow × steam density</p>
            <p className="mt-1 text-sm font-semibold text-industrial-700">kg/h = m³/h × kg/m³</p>
          </div>
        </div>
        <p className="mt-2 text-[0.8125rem] leading-5 text-slate-600">Volume flow and density are separate calculation inputs. Pressure and temperature inputs depend on the steam condition below. Pressure-based density calculations use absolute pressure; convert gauge readings using the applicable atmospheric pressure.</p>
      </figure>

      <ul aria-label="Steam condition qualifications" className="mt-3 grid gap-2 text-sm leading-5 text-slate-700 sm:grid-cols-3 sm:gap-5">
        <li><strong className="font-semibold text-navy-950">Saturated steam:</strong> for dry saturated steam in equilibrium, either absolute pressure OR saturation temperature can determine density.</li>
        <li><strong className="font-semibold text-navy-950">Superheated steam:</strong> both absolute pressure AND temperature are required to determine density.</li>
        <li><strong className="font-semibold text-navy-950">Wet steam:</strong> review quality or moisture separately. Ordinary pressure/temperature compensation alone does not establish accurate actual mass flow.</li>
      </ul>
      <p className="mt-3 text-[0.8125rem] leading-5 text-slate-600">
        General measurement principle, not a promise of integrated compensation. Confirm sensor integration, external instruments and where calculations are performed for the selected configuration.
      </p>
      <p className="mt-2 text-[0.8125rem] leading-5 text-slate-600">
        Technical background:{" "}<a href="https://www.spiraxsarco.com/learn-about-steam/flowmetering/instrumentation" target="_blank" rel="noopener noreferrer" className="focus-ring text-industrial-700 underline underline-offset-4">Steam density compensation</a>{" · "}<a href="https://www.spiraxsarco.com/learn-about-steam/steam-engineering-principles-and-heat-transfer/engineering-units" target="_blank" rel="noopener noreferrer" className="focus-ring text-industrial-700 underline underline-offset-4">Gauge and absolute pressure</a>.
      </p>
      </Container>
    </section>
  );
}
