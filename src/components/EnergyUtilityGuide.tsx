import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/Layout";
import type { Product } from "@/types/content";

export const utilityPage = {
  slug: "energy-loss-visibility",
  hero: {
    src: "/images/technology/calibration/master-meter-installation-area.jpg",
    alt: "Large stainless-steel liquid-flow pipework and valve in Velomac’s existing calibration facility",
    caption: "Reference photograph: Velomac’s liquid-flow calibration facility."
  }
};

const headingClass = "scroll-mt-32 text-[1.65rem] font-semibold leading-tight text-navy-950 sm:text-3xl lg:scroll-mt-44 lg:text-[2.125rem]";
const eyebrowClass = "text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700";
const bodyClass = "text-sm leading-6 text-slate-700 sm:text-base sm:leading-7";

const meteringPoints = [
  { title: "Plant Utility Header", point: "Main Header", purpose: "Total utility consumption", kind: "header" },
  { title: "Distribution Branch", point: "Branch Line", purpose: "Area-level allocation", kind: "branch" },
  { title: "Individual Equipment", point: "Equipment Line", purpose: "Equipment-level monitoring", kind: "equipment" }
] as const;

const meterDirections = [
  {
    slug: "vortex-flowmeter",
    application: "Steam, gas and suitable clean-liquid measurement.",
    conditions: [
      "Minimum, normal and maximum flow",
      "Pressure, temperature, DN and connection",
      "Pipe layout and vibration where relevant"
    ]
  },
  {
    slug: "electromagnetic-flowmeter",
    application: "Conductive water, wastewater and process liquids.",
    conditions: [
      "Conductivity and full-pipe condition",
      "Liner and electrode compatibility",
      "Flow range, grounding and installation"
    ]
  },
  {
    slug: "thermal-mass-flowmeter",
    application: "Compressed air and suitable industrial gases.",
    conditions: [
      "Gas composition, calibration basis and reference conditions",
      "Minimum, normal and maximum flow",
      "Pressure, temperature; inline or insertion installation"
    ]
  },
  {
    slug: "ultrasonic-flowmeter",
    application: "Water, cooling water and suitable pipeline measurement, including clamp-on and thermal-energy configurations.",
    conditions: [
      "Pipe material, size, geometry and wall condition",
      "Flow range and installation access",
      "Flow-only or thermal-energy measurement arrangement"
    ]
  }
];

const siteDetails = [
  ["Utility / Medium", "Steam, compressed air, water or process liquid"],
  ["Metering Point", "Main header, branch line or equipment line"],
  ["Flow Range", "Minimum, normal and maximum flow, if available"],
  ["Operating Conditions", "Pressure and temperature"],
  ["Pipe Information", "DN, material and installation arrangement"],
  ["Signal Requirements", "4–20 mA, RS485 or other requirements"]
];

export function EnergyUtilityGuide({ products }: { products: Product[] }) {
  return (
    <>
      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="utility-boundary-title">
        <Container>
          <p className={eyebrowClass}>What Needs to Be Measured</p>
          <h2 id="utility-boundary-title" className={`${headingClass} mt-2`}>Define the Utility Boundary and Metering Point</h2>
          <div className={`mt-3 grid gap-2 lg:grid-cols-2 lg:gap-8 ${bodyClass}`}>
            <p>Start by identifying where utility consumption needs to be measured: the main supply header, a distribution branch or an individual equipment line.</p>
            <p>The selected measurement point should match the purpose, whether it is total utility consumption, area-level allocation or equipment-level monitoring.</p>
          </div>

          <figure className="mt-5 rounded-lg border border-metal-200 bg-metal-50 p-4 sm:mt-6 sm:p-6" aria-label="Possible utility metering locations from the plant header to an equipment line">
            <ol className="grid gap-5 md:grid-cols-3 md:gap-8">
              {meteringPoints.map((point, index) => (
                <li key={point.kind} className="relative grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-3 md:flex md:flex-col md:items-stretch">
                  <MeteringPointSymbol kind={point.kind} />
                  <div className="md:mt-1">
                    <h3 className="text-base font-semibold leading-snug text-navy-950">{point.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-industrial-700">{point.point}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{point.purpose}</p>
                  </div>
                  {index < meteringPoints.length - 1 ? (
                    <>
                      <ArrowRight aria-hidden="true" size={18} className="absolute -right-6 top-9 hidden text-slate-500 md:block" />
                      <ArrowDown aria-hidden="true" size={16} className="absolute -bottom-[18px] left-8 text-slate-500 md:hidden" />
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
            <figcaption className="mt-4 border-t border-metal-200 pt-3 text-[0.8125rem] leading-5 text-slate-600">
              Illustrative utility metering locations. Final positioning depends on the measurement objective and installation conditions. Not all three points need to be metered.
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="utility-chilled-water-title">
        <Container>
          <p className={eyebrowClass}>Operating Condition</p>
          <h2 id="utility-chilled-water-title" className={`${headingClass} mt-2 max-w-4xl`}>Chilled Water: How Temperature Difference Affects Flow Demand</h2>
          <p className={`mt-3 max-w-4xl ${bodyClass}`}>In chilled water systems, the water-side temperature difference (ΔT) directly affects the theoretical flow required to deliver a given cooling load.</p>

          <figure className="mt-5 sm:mt-6" aria-labelledby="utility-comparison-caption">
            <figcaption id="utility-comparison-caption" className="mb-3 scroll-mt-32 text-sm font-semibold text-slate-600 lg:scroll-mt-44">Same cooling load · same assumed water properties · illustrative example</figcaption>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              {[{ label: "Case A", delta: 6, flow: 100 }, { label: "Case B", delta: 3, flow: 200 }].map((example) => (
                <div key={example.label} className={`rounded-lg border border-metal-200 p-5 sm:p-6 ${example.label === "Case B" ? "border-t-2 border-t-industrial-600 bg-metal-50" : "bg-white"}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-600">{example.label}</p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
                    <p className="text-5xl font-semibold leading-none tracking-tight text-industrial-700 sm:text-6xl">{example.delta}°C</p>
                    <p className="text-base font-semibold text-slate-600">ΔT</p>
                  </div>
                  <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-navy-950">
                    <span className="text-3xl font-semibold leading-none sm:text-4xl">{example.flow}</span>
                    <span className="text-xl font-semibold">m³/h</span>
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Theoretical water flow</p>
                </div>
              ))}
            </div>
            <p className="mt-4 border-l-2 border-industrial-600 pl-4 text-base font-semibold leading-6 text-navy-950 sm:text-lg sm:leading-7">At the same cooling load, reducing the chilled-water ΔT from 6°C to 3°C doubles the theoretical water flow required.</p>
          </figure>

          <p className={`mt-4 max-w-4xl ${bodyClass}`}>Monitoring flow alongside supply and return water temperatures helps engineers assess water transport demand and investigate low-ΔT operation.</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2 lg:gap-8">
            <p className="text-[0.8125rem] leading-5 text-slate-600">Illustrative comparison for water at the same cooling load. Actual system assessment should consider measured flow, supply and return temperatures, fluid properties and operating conditions. A lower ΔT alone does not establish excessive circulation.</p>
            <p className="text-sm leading-6 text-slate-700"><strong className="font-semibold text-navy-950">Flow is not ΔT.</strong> The flowmeter measures flow. Temperature difference requires separate supply and return temperature measurements, or a suitable thermal energy meter configuration.</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-metal-200 bg-metal-50 py-9 sm:py-12" aria-labelledby="utility-selection-title">
        <Container>
          <p className={eyebrowClass}>Recommended Meter Direction</p>
          <h2 id="utility-selection-title" className={`${headingClass} mt-2`}>Select the Flowmeter Based on the Utility</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-5">
            {meterDirections.map((direction) => {
              const product = products.find((item) => item.slug === direction.slug);
              if (!product) return null;
              return (
                <article key={direction.slug} className="rounded-lg border border-metal-200 bg-white px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3">
                  <h3 className="text-lg font-semibold text-navy-950 sm:text-xl">
                    <Link href={`/products/${product.slug}`} className="focus-ring flex min-h-11 items-center justify-between gap-3 rounded-sm py-2 text-industrial-700 hover:text-navy-950">
                      {product.name}<ArrowRight aria-hidden="true" size={17} className="shrink-0" />
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{direction.application}</p>
                  <ul className="mt-3 grid gap-1.5 border-t border-metal-200 pt-3 text-sm leading-5 text-slate-600">
                    {direction.conditions.map((condition) => (
                      <li key={condition} className="flex items-start gap-2"><span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-industrial-700" /><span>{condition}</span></li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Final selection depends on the utility, operating range, installation and required measurement arrangement.</p>
        </Container>
      </section>

      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="utility-details-title">
        <Container>
          <p className={eyebrowClass}>Site Details</p>
          <h2 id="utility-details-title" className={`${headingClass} mt-2`}>What Information Should You Prepare?</h2>
          <dl className="mt-5 divide-y divide-metal-200 border-y border-metal-200">
            {siteDetails.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-5">
                <dt className="text-sm font-semibold leading-6 text-navy-950">{label}</dt>
                <dd className="text-sm leading-6 text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-700"><strong className="font-semibold text-navy-950">For cooling water:</strong> provide supply temperature, return temperature or ΔT where available. Indicate whether you need flow monitoring or thermal energy measurement.</p>
        </Container>
      </section>
    </>
  );
}

function MeteringPointSymbol({ kind }: { kind: (typeof meteringPoints)[number]["kind"] }) {
  return (
    <svg viewBox="0 0 240 84" role="img" aria-label={`Simplified flowmeter at the ${kind === "header" ? "main header" : kind === "branch" ? "branch line" : "equipment line"}; a possible metering point, not a required installation`} className="h-auto w-full text-industrial-700" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d={kind === "equipment" ? "M12 49h158" : "M12 49h216"} stroke="#8296AC" strokeWidth={kind === "header" ? 9 : 5} />
      {kind === "branch" ? <path d="M28 16v61" stroke="#8296AC" strokeWidth="9" /> : null}
      {kind === "equipment" ? <rect x="172" y="23" width="50" height="51" rx="4" fill="#E7EDF4" stroke="#8296AC" /> : null}
      <circle cx="112" cy="49" r="19" fill="#FFFFFF" />
      <path d="M101 56V42l11 10 11-10v14" />
      <path d={kind === "equipment" ? "m146 44 6 5-6 5" : "m199 44 6 5-6 5"} />
    </svg>
  );
}
