import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CloudFog, Droplets, Flame, Gauge, Thermometer, Wrench } from "lucide-react";
import { Container } from "@/components/Layout";
import { SteamFlowResultGuide } from "@/components/SteamFlowResultGuide";
import type { Product } from "@/types/content";

const headingClass = "scroll-mt-32 text-[1.65rem] font-semibold leading-tight text-navy-950 sm:text-3xl lg:scroll-mt-44";
const eyebrowClass = "text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700";

export function SteamSystemOverview() {
  return (
    <figure className="rounded-lg border border-metal-200 bg-metal-50 p-4 sm:p-5" aria-labelledby="steam-system-title">
      <figcaption id="steam-system-title" className="text-base font-semibold text-navy-950">Steam Distribution &amp; Metering</figcaption>
      <svg viewBox="0 0 600 265" role="img" aria-describedby="steam-system-note" aria-label="Conceptual steam source feeding a main header, a representative vortex metering point, separate pressure and temperature points, and two equipment branches" className="mt-3 h-auto w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="82" width="80" height="122" rx="15" fill="white" stroke="#8296AC" strokeWidth="3" />
        <path d="M27 204v12m50-12v12M34 65c-13-12 13-14 0-28m21 28c-13-12 13-14 0-28m21 28c-13-12 13-14 0-28" stroke="#8296AC" strokeWidth="3" />
        <path d="M93 150h450M450 150v72h93" stroke="#8296AC" strokeWidth="9" />
        <path d="m151 141 12 9-12 9m345-18 12 9-12 9m-13 63 12 9-12 9" stroke="#0057B8" strokeWidth="4" />
        <circle cx="307" cy="150" r="23" fill="white" stroke="#0057B8" strokeWidth="3" />
        <path d="M307 127V98" stroke="#0057B8" strokeWidth="3" />
        <rect x="283" y="67" width="48" height="33" rx="5" fill="#E8F2FC" stroke="#0057B8" strokeWidth="3" />
        <path d="M293 84h28M225 149V66m150 83V66" stroke="#0057B8" strokeWidth="3" />
        <circle cx="225" cy="45" r="22" fill="white" stroke="#8296AC" strokeWidth="3" />
        <circle cx="375" cy="45" r="22" fill="white" stroke="#8296AC" strokeWidth="3" />
        <text x="225" y="54" textAnchor="middle" fill="#004A9C" stroke="none" fontSize="26" fontFamily="Arial, sans-serif">P</text>
        <text x="375" y="54" textAnchor="middle" fill="#004A9C" stroke="none" fontSize="26" fontFamily="Arial, sans-serif">T</text>
        <rect x="545" y="115" width="42" height="63" rx="5" fill="white" stroke="#8296AC" strokeWidth="3" />
        <rect x="545" y="190" width="42" height="63" rx="5" fill="white" stroke="#8296AC" strokeWidth="3" />
      </svg>
      <div className="mt-1 grid grid-cols-3 gap-3 text-center text-sm font-semibold leading-5 text-navy-950">
        <p>Steam source</p><p>Main steam header</p><p>Branches &amp; equipment</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-metal-200 pt-3 text-sm leading-5 text-slate-700">
        <span className="font-semibold text-industrial-700">Vortex metering point</span><span>P: pressure</span><span>T: temperature</span><span>Flow direction →</span>
      </div>
      <p id="steam-system-note" className="mt-2 text-[0.8125rem] leading-5 text-slate-600">Conceptual network. Pressure and temperature points are shown separately where applicable; the sensor arrangement is configuration-specific.</p>
    </figure>
  );
}

export function SteamApplicationGuide({ products }: { products: Product[] }) {
  const vortex = products.find((product) => product.slug === "vortex-flowmeter");
  return (
    <>
      <SteamFlowResultGuide />

      <section className="border-b border-metal-200 bg-metal-50 py-9 sm:py-12" aria-labelledby="steam-conditions-title">
        <Container>
          <p className={eyebrowClass}>Operating Conditions</p>
          <h2 id="steam-conditions-title" className={`${headingClass} mt-2`}>Steam Flow Meter Selection Conditions</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-5">
            <article className="rounded-lg border border-metal-200 bg-white p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-950"><Gauge aria-hidden="true" size={20} className="text-industrial-700" />Flow Range</h3>
              <div className="relative mt-5 flex h-7 items-center justify-between px-2" aria-hidden="true">
                <div className="absolute inset-x-2 h-0.5 bg-metal-200" />
                {[false, true, false].map((active, index) => <span key={index} className={`relative h-3.5 w-3.5 rounded-full border-2 border-industrial-600 ${active ? "bg-industrial-600" : "bg-white"}`} />)}
              </div>
              <div className="mt-1 grid grid-cols-3 gap-2 text-center text-sm font-semibold leading-5 text-navy-950"><p><span className="block sm:inline">Minimum</span>{" "}Flow</p><p><span className="block sm:inline">Normal</span>{" "}Flow</p><p><span className="block sm:inline">Maximum</span>{" "}Flow</p></div>
              <p className="mt-3 text-[0.8125rem] leading-5 text-slate-600">Conceptual positions, not a numerical scale or turndown claim.</p>
            </article>
            <article className="rounded-lg border border-metal-200 bg-white p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-950"><CloudFog aria-hidden="true" size={20} className="text-industrial-700" />Steam Condition</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-5 text-slate-700">
                <li className="flex items-center gap-3"><CloudFog aria-hidden="true" size={19} className="shrink-0 text-industrial-700" />Saturated Steam</li>
                <li className="flex items-center gap-3"><Flame aria-hidden="true" size={19} className="shrink-0 text-industrial-700" />Superheated Steam</li>
                <li className="flex items-center gap-3"><Droplets aria-hidden="true" size={19} className="shrink-0 text-industrial-700" />Wet Steam / Condensate Risk</li>
              </ul>
            </article>
            <article className="rounded-lg border border-metal-200 bg-white p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-950"><Thermometer aria-hidden="true" size={20} className="shrink-0 text-industrial-700" />Operating Pressure &amp; Temperature</h3>
              <dl className="mt-3 divide-y divide-metal-200 text-sm leading-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2"><dt className="text-slate-700">Operating Pressure</dt><dd className="font-semibold text-navy-950">bar · kPa · MPa</dd></div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2"><dt className="text-slate-700">Operating Temperature</dt><dd className="font-semibold text-navy-950">°C</dd></div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2"><dt className="text-slate-700">Pressure Reference</dt><dd className="font-semibold text-navy-950">Gauge / Absolute</dd></div>
              </dl>
            </article>
            <article className="rounded-lg border border-metal-200 bg-white p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-950"><Wrench aria-hidden="true" size={20} className="text-industrial-700" />Pipe &amp; Installation</h3>
              <svg viewBox="0 0 300 34" aria-hidden="true" className="mt-3 h-8 w-full" fill="none" strokeLinecap="round"><path d="M7 17h286" stroke="#8296AC" strokeWidth="6" /><rect x="131" y="5" width="38" height="24" rx="3" fill="white" stroke="#0057B8" strokeWidth="2" /><path d="m218 11 8 6-8 6" stroke="#0057B8" strokeWidth="2" /></svg>
              <ul className="mt-2 grid gap-x-4 gap-y-1.5 text-sm leading-5 text-slate-700 sm:grid-cols-2">
                {["Pipe Diameter (DN)", "Connection Standard", "Available Straight Pipe", "Nearby Valves and Fittings", "Installation Position", "Insulation Conditions"].map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          </div>
        </Container>
      </section>

      {vortex ? (
        <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="steam-product-title">
          <Container className="grid gap-5 sm:grid-cols-[0.55fr_1fr] sm:items-center sm:gap-8">
            <Image src={vortex.image} alt={vortex.imageAlt} width={900} height={900} sizes="(min-width: 640px) 224px, 160px" className="mx-auto h-auto w-full max-w-[160px] object-contain sm:max-w-[224px]" />
            <div>
              <p className={eyebrowClass}>Product Direction</p>
              <h2 id="steam-product-title" className={`${headingClass} mt-2`}>Steam Vortex Flowmeter</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">Review a vortex configuration against the steam condition, operating flow range and installation layout.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Vortex Flowmeter / Multivariable Vortex Flowmeter: confirm the selected configuration and its instrumentation requirements.</p>
              <Link href={`/products/${vortex.slug}`} className="focus-ring mt-3 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-industrial-700 underline underline-offset-4 hover:text-navy-950">Vortex flowmeters for steam measurement<ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="steam-installation-title">
        <Container>
          <p className={eyebrowClass}>Installation Considerations</p>
          <h2 id="steam-installation-title" className={`${headingClass} mt-2`}>Review the Measuring Line, Not Only the Meter</h2>
          <figure className="mt-5 rounded-lg border border-metal-200 bg-metal-50 p-4 sm:p-5" aria-labelledby="steam-installation-caption">
            <div className="grid grid-cols-3 gap-3 text-sm leading-5 text-slate-700"><span>Nearby elbow / valve</span><span className="text-center font-semibold text-navy-950">Vortex flowmeter</span><span className="text-right font-semibold text-industrial-700">Flow direction →</span></div>
            <svg viewBox="0 0 800 180" role="img" aria-describedby="steam-installation-caption" aria-label="Conceptual left-to-right vortex installation with an upstream elbow and valve, upstream straight pipe, the vortex metering point and downstream straight pipe; no required lengths are specified" className="mt-2 h-auto w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M24 166h52V103q0-23 23-23h665" stroke="#8296AC" strokeWidth="8" />
              <path d="m160 64 35 32V64l-35 32zM178 63V43m-13 0h26" fill="white" stroke="#8296AC" strokeWidth="3" />
              <circle cx="405" cy="80" r="24" fill="white" stroke="#0057B8" strokeWidth="3" />
              <path d="M405 56V42" stroke="#0057B8" strokeWidth="3" /><rect x="381" y="9" width="48" height="33" rx="5" fill="white" stroke="#0057B8" strokeWidth="3" />
              <path d="m287 71 12 9-12 9m294-18 12 9-12 9" stroke="#0057B8" strokeWidth="4" />
              <path d="M235 80h21m384 0h21" stroke="#F5F8FC" strokeWidth="15" />
              <path d="m238 73 5 14m6-14 5 14m389-14 5 14m6-14 5 14" stroke="#8296AC" strokeWidth="3" />
              <path d="M227 127h144m-144-7v14m144-14v14m68-7h270m-270-7v14m270-14v14" stroke="#8296AC" strokeWidth="2" />
            </svg>
            <div className="grid grid-cols-2 gap-3 text-center text-sm font-semibold leading-5 text-navy-950"><p className="w-full sm:ml-auto sm:w-1/2">Upstream straight pipe</p><p className="w-full sm:w-[85%]">Downstream straight pipe</p></div>
            <figcaption id="steam-installation-caption" className="mt-4 border-t border-metal-200 pt-3 text-[0.8125rem] leading-5 text-slate-600">Illustrative only and not to scale; not a universal arrangement or a substitute for the installation manual. Verify straight-run, sensor-position and insulation requirements for the selected model and surrounding fittings.</figcaption>
          </figure>
        </Container>
      </section>
    </>
  );
}
