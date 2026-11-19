import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, FlaskConical, Gauge, Layers3 } from "lucide-react";
import { Container } from "@/components/Layout";
import type { Product } from "@/types/content";

const checks = [
  {
    title: "Process medium",
    Icon: FlaskConical,
    items: ["Chemical name and composition", "Liquid, gas or steam", "Conductivity for electromagnetic meters", "Suspended solids or entrained gas, if present"]
  },
  {
    title: "Operating conditions",
    Icon: Gauge,
    items: ["Minimum, normal and maximum flow", "Operating pressure and temperature", "Pipe size and connection"]
  },
  {
    title: "Material compatibility",
    Icon: Layers3,
    items: ["Wetted parts, including liner and electrodes", "Corrosion and abrasion", "Cleaning chemicals and cycles"]
  }
];

const process = [
  { kind: "storage", label: "Chemical storage or mixing tank" },
  { kind: "pump", label: "Pump" },
  { kind: "pipe", label: "Process pipeline" },
  { kind: "meter", label: "Flow measurement point" },
  { kind: "receiving", label: "Downstream process or receiving tank" }
] as const;

const parts = [
  ["Measuring tube", "The body of the flow passage."],
  ["Liner material", "The lining forms the inner surface in contact with the liquid."],
  ["Electrode material", "The measuring electrodes contact the liquid and pick up the signal."],
  ["Flow direction", "Direction of liquid through the tube."],
  ["Wetted surface", "The boundary in contact with the liquid, including the electrode faces."]
] as const;

const liningOptions = ["PTFE", "FEP", "Ceramic", "Other available configurations"];

const meterDirections = [
  {
    slug: "electromagnetic-flowmeter",
    medium: "Conductive liquids",
    description: "Consider electromagnetic measurement when the conductive liquid, flow range and installation suit the meter.",
    items: ["Liquid conductivity", "Liner and electrode compatibility", "Full-pipe and installation conditions"]
  },
  {
    slug: "v-cone-flowmeter",
    medium: "Gas, steam or liquid",
    description: "Consider a V-Cone where differential-pressure measurement fits the process.",
    items: ["Medium properties", "Operating flow, pressure and temperature", "Pipe layout and allowable pressure loss"]
  }
];

const essential = [
  ["Chemical name", "Actual medium"],
  ["Concentration", "Chemical concentration"],
  ["Medium state", "Liquid, gas or steam"],
  ["Flow range", "Minimum, normal and maximum"],
  ["Pressure", "Operating pressure"],
  ["Temperature", "Operating temperature"],
  ["Pipe size", "Nominal size (DN)"]
] as const;

const additional = [
  "Conductivity for electromagnetic measurement",
  "Suspended solids or entrained gas",
  "Preferred wetted materials",
  "Cleaning chemicals and cycles",
  "Connection standard and pressure rating",
  "Installation conditions",
  "Output and communication requirements"
];

const headingClass = "scroll-mt-32 text-[1.65rem] font-semibold leading-tight text-navy-950 sm:text-3xl lg:scroll-mt-44 lg:text-[2.125rem]";
const insetClass = "rounded-lg border border-metal-200 bg-white";
const linkClass = "focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-semibold text-industrial-700 underline decoration-industrial-700/40 underline-offset-4 hover:text-navy-950";

export function ChemicalProcessGuide({ products }: { products: Product[] }) {
  return (
    <>
      <section className="border-b border-metal-200 bg-metal-50 py-9 sm:py-12" aria-labelledby="chemical-selection-title">
        <Container>
          <h2 id="chemical-selection-title" className={headingClass}>
            What Should You Check Before Selecting a Chemical Flowmeter?
          </h2>
          <ol className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">
            {checks.map(({ title, Icon, items }, index) => (
              <li key={title} className={`${insetClass} border-t-2 border-t-industrial-600 p-4 sm:p-5`}>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-blue-50 text-industrial-700">
                    <Icon aria-hidden="true" size={19} strokeWidth={1.75} />
                  </span>
                  <h3 className="text-lg font-semibold leading-tight text-navy-950">{title}</h3>
                  <span aria-hidden="true" className="ml-auto self-start text-xs font-semibold text-slate-500">0{index + 1}</span>
                </div>
                <PointList items={items} className="mt-3" />
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="chemical-process-title">
        <Container>
          <h2 id="chemical-process-title" className={headingClass}>Where Does Flow Measurement Fit in a Chemical Process?</h2>
          <figure className="mt-5 overflow-hidden rounded-lg border border-metal-200 bg-metal-50 sm:mt-6">
            <ol className="grid gap-0 px-4 pt-3 sm:px-5 sm:pt-5 md:grid-cols-5 md:gap-4 md:px-6">
              {process.map(({ kind, label }, index) => (
                <li key={kind} className="relative flex items-center gap-3 py-2.5 md:flex-col md:gap-2 md:py-3 md:text-center">
                  <span className={`grid h-[48px] w-[64px] shrink-0 place-items-center rounded-lg md:h-[68px] md:w-[88px] ${kind === "meter" ? "bg-industrial-700 text-white" : "text-industrial-700"}`}>
                    <ProcessSymbol kind={kind} />
                  </span>
                  <span className={`text-sm font-semibold leading-snug sm:text-base ${kind === "meter" ? "text-industrial-700" : "text-navy-950"}`}>{label}</span>
                  {index < process.length - 1 ? (
                    <>
                      <ArrowDown aria-hidden="true" size={14} className="absolute bottom-[-8px] left-[25px] text-slate-500 md:hidden" />
                      <ArrowRight aria-hidden="true" size={16} className="absolute -right-4 top-9 hidden text-slate-500 md:block" />
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
            <figcaption className="mt-3 border-t border-metal-200 px-4 py-3 text-sm leading-5 text-slate-600 sm:px-6">
              <strong className="font-semibold text-navy-950">Illustrative process layout.</strong>{" "}
              One example of pumped liquid transfer, not a P&amp;ID or a prescribed meter location.
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="border-b border-metal-200 bg-metal-50 py-9 sm:py-12" aria-labelledby="chemical-materials-title">
        <Container>
          <h2 id="chemical-materials-title" className={headingClass}>Material Compatibility in Chemical Flow Measurement</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch lg:gap-6">
            <figure className={`${insetClass} overflow-hidden`}>
              <div className="grid place-items-center bg-navy-950 px-3 py-4 sm:px-6 sm:py-5">
                <MeterCutaway />
              </div>
              <figcaption className="px-4 pb-4 pt-3 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-industrial-700">Conceptual cutaway · not a model drawing</p>
                <dl className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                  {parts.map(([label, explanation], index) => (
                    <div key={label}>
                      <dt className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                        <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-blue-50 text-xs text-industrial-700">{index + 1}</span>
                        {label}
                      </dt>
                      <dd className="pl-7 text-sm leading-5 text-slate-600">{explanation}</dd>
                    </div>
                  ))}
                </dl>
              </figcaption>
            </figure>

            <div className={`${insetClass} flex flex-col justify-center p-4 sm:p-6`}>
              <h3 className="text-lg font-semibold leading-tight text-navy-950">Specify the liner and electrodes separately</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                For a conductive chemical liquid, check both materials against the chemical composition, concentration,
                operating temperature and pressure. Include any cleaning chemicals or cycles.
              </p>
              <p className="mt-4 text-sm font-semibold text-navy-950">Electromagnetic lining options</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Example electromagnetic flowmeter lining options">
                {liningOptions.map((option) => (
                  <li key={option} className="rounded-sm bg-blue-50 px-2.5 py-1 text-sm font-semibold text-industrial-700">{option}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm leading-5 text-slate-600">Available options are not compatibility approvals.</p>
              <Link href="/products/electromagnetic-flowmeter#configuration" className={`${linkClass} mt-2`}>
                See electromagnetic configurations <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="chemical-meters-title">
        <Container>
          <h2 id="chemical-meters-title" className={headingClass}>Which Flowmeter Should You Consider?</h2>
          <div className="mt-5 grid gap-4 sm:mt-6 md:grid-cols-2 lg:gap-5">
            {meterDirections.map(({ slug, medium, description, items }) => {
              const product = products.find((item) => item.slug === slug);
              if (!product) return null;

              return (
                <article key={slug} className={`${insetClass} flex flex-col p-4 sm:p-6`}>
                  <div className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_8.5rem]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-industrial-700">{medium}</p>
                      <h3 className="mt-1.5 text-lg font-semibold leading-tight text-navy-950 sm:text-2xl">{product.name}</h3>
                    </div>
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      width={180}
                      height={180}
                      sizes="(min-width: 640px) 136px, 96px"
                      className="h-auto w-full aspect-square object-contain"
                    />
                  </div>
                  <p className="text-sm leading-6 text-slate-700 sm:text-base">{description}</p>
                  <PointList items={items} className="mt-3 pb-3" />
                  <Link href={`/products/${slug}`} className={`${linkClass} mt-auto`}>
                    View {product.name} <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
                  </Link>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-metal-50 py-9 sm:py-12" aria-labelledby="chemical-quote-details-title">
        <Container>
          <h2 id="chemical-quote-details-title" className={headingClass}>What Information Should You Prepare?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Start with what you already have. Additional details can be confirmed during the application review.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:gap-5">
            <div className={`${insetClass} p-4 sm:p-5`}>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
                <Check aria-hidden="true" size={18} className="shrink-0 text-industrial-700" /> Essential information
              </h3>
              <dl className="mt-2 divide-y divide-metal-200 text-sm leading-5">
                {essential.map(([label, detail]) => (
                  <div key={label} className="grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-2 py-2">
                    <dt className="font-semibold text-navy-950">{label}</dt>
                    <dd className="text-slate-700">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={`${insetClass} p-4 sm:p-5`}>
              <h3 className="text-lg font-semibold leading-tight text-navy-950">
                Additional information <span className="text-sm font-medium text-slate-600">(if available)</span>
              </h3>
              <PointList items={additional} className="mt-3 space-y-2" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function PointList({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`grid gap-y-1.5 text-sm leading-5 text-slate-700 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check aria-hidden="true" size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-industrial-700" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProcessSymbol({ kind }: { kind: (typeof process)[number]["kind"] }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 56" className="h-10 w-14 md:h-[52px] md:w-[74px]" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      {kind === "storage" || kind === "receiving" ? (
        <>
          <path d="M20 16h40v23c0 7-9 11-20 11s-20-4-20-11z" fill="currentColor" fillOpacity=".08" />
          <ellipse cx="40" cy="16" rx="20" ry="7" />
          <path d="M20 32c0 4 9 8 20 8s20-4 20-8" opacity=".55" />
          {kind === "storage" ? <path d="M48 48v5h25M36 9V4h8v5" /> : <path d="M5 26h15M40 9V4h23" />}
        </>
      ) : kind === "pump" ? (
        <>
          <path d="M5 34h18m29 0h23v-8H55V14H37c-9 0-16 8-16 17s7 17 16 17c8 0 14-6 17-12" fill="currentColor" fillOpacity=".08" />
          <circle cx="37" cy="31" r="8" />
          <path d="M28 47l-3 5h28l-5-6" />
        </>
      ) : kind === "pipe" ? (
        <>
          <path d="M4 23h72v14H4z" fill="currentColor" fillOpacity=".08" />
          <path d="M16 19v22m48-22v22M26 30h25m-6-5 6 5-6 5" />
        </>
      ) : (
        <>
          <path d="M4 32h17m38 0h17M4 42h17m38 0h17M21 27h38v20H21zM28 28v18m24-18v18M40 27v-9" />
          <circle cx="40" cy="12" r="8" />
          <path d="m40 12 3-3" />
        </>
      )}
    </svg>
  );
}

function MeterCutaway() {
  return (
    <svg viewBox="0 0 536 222" role="img" aria-labelledby="chemical-cutaway-svg-title chemical-cutaway-svg-desc" className="h-auto w-full max-w-[530px]">
      <title id="chemical-cutaway-svg-title">Conceptual electromagnetic flowmeter cutaway</title>
      <desc id="chemical-cutaway-svg-desc">Conductive liquid flows left to right through a lined measuring tube. Two opposing measuring electrodes meet the liquid at its wetted surface. Numbered callouts match the legend.</desc>
      <g fill="#466482" stroke="#B3C8DC" strokeWidth="2">
        <path d="M65 65h406v92H65z" />
        <rect x="48" y="55" width="21" height="112" rx="2" />
        <rect x="467" y="55" width="21" height="112" rx="2" />
      </g>
      <path d="M50 86h436v50H50z" fill="#B6E5FC" />
      <path d="M50 86h436v10H50zm0 40h436v10H50z" fill="#0084BF" />
      <path d="M50 96h436M50 126h436" stroke="#48CAF6" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M259 72h18v24h-18zm0 54h18v24h-18z" fill="#F6CC85" stroke="#FCEDCC" strokeWidth="1.5" />
      <path d="M74 111h86m-12-7 12 7-12 7m38-7h38m-10-6 10 6-10 6m90-6h122m-12-7 12 7-12 7" fill="none" stroke="#00507F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="none" stroke="#D2E6F4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M109 39v19l18 14M199 39v49M268 39v33m14-20h24v92h-29M397 39v48l-12 9m-2 86v-44l-17-27" />
      </g>
      <g fill="#D2E6F4">
        <circle cx="127" cy="72" r="3" /><circle cx="199" cy="88" r="3" />
        <circle cx="268" cy="72" r="3" /><circle cx="277" cy="144" r="3" />
        <circle cx="385" cy="96" r="3" /><circle cx="366" cy="111" r="3" />
      </g>
      <g fill="#0D2D4D" stroke="#91CCF4" strokeWidth="1.5">
        <circle cx="109" cy="26" r="14" /><circle cx="199" cy="26" r="14" />
        <circle cx="268" cy="26" r="14" /><circle cx="397" cy="26" r="14" /><circle cx="383" cy="196" r="14" />
      </g>
      <g fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="19" fontWeight="600" textAnchor="middle">
        <text x="109" y="32.5">1</text><text x="199" y="32.5">2</text>
        <text x="268" y="32.5">3</text><text x="397" y="32.5">5</text><text x="383" y="202.5">4</text>
      </g>
    </svg>
  );
}
