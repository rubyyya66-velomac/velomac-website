import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Gauge, MoveVertical, Radio } from "lucide-react";
import { Container } from "@/components/Layout";
import type { Product } from "@/types/content";

const analysisPath = "/technology/wide-turndown-anti-vibration-vortex-flowmeter";
const testPath = "/technology/vibration-measurement-test-system";
const dedicatedPath = "/products/vortex-flowmeter/wide-turndown-anti-vibration";
const headingClass = "scroll-mt-32 text-[1.65rem] font-semibold leading-tight text-navy-950 sm:text-3xl lg:scroll-mt-44 lg:text-[2.125rem]";
const linkClass = "focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-semibold text-industrial-700 underline decoration-industrial-700/40 underline-offset-4 hover:text-navy-950";

const stages = [
  {
    title: "Confirmed Zero Flow",
    note: "No actual process flow.",
    illustration: "zero",
    description: "A pipeline and vortex meter with no process flow. No closed valve is used as proof of zero flow."
  },
  {
    title: "External Mechanical Vibration",
    note: "Nearby equipment transmits vibration to the pipe.",
    illustration: "vibration",
    description: "An external motor transmits mechanical vibration to a pipeline. The marks indicate pipe vibration, not fluid movement."
  },
  {
    title: "Possible False Flow Indication",
    note: "Interference may appear as a flow reading.",
    illustration: "indication",
    description: "An illustrative meter signal with an apparent flow indication caused by interference; this is not actual process flow or recorded test data."
  }
] as const;

const conditions = [
  { title: "Vibration source", Icon: Radio, points: ["Nearby pumps and compressors", "Motors and process equipment"] },
  { title: "Mechanical installation", Icon: MoveVertical, points: ["Pipe supports and movement", "Reducers and nearby fittings", "Meter position"] },
  { title: "Operating conditions", Icon: Gauge, points: ["Medium", "Minimum, normal and maximum flow", "Operating pressure and temperature"] }
];

const basicDetails = ["Medium and pipe size", "Minimum, normal and maximum flow", "Operating pressure and temperature"];
const vibrationDetails = ["Vibration source", "Pipe layout and support condition", "Meter installation position"];

export function HighVibrationGuide({ products }: { products: Product[] }) {
  const swirl = products.find((product) => product.slug === "swirl-flowmeter");

  return (
    <>
      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="vibration-problem-title">
        <Container>
          <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            <h2 id="vibration-problem-title" className={headingClass}>Can Pipe Vibration Look Like Flow?</h2>
            <div className="max-w-2xl text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
              <p>Even when process flow is confirmed at zero, vibration from nearby pumps, compressors or pipework may cause a vortex meter to display a false flow reading.</p>
              <Link href={analysisPath} className={`${linkClass} mt-2`}>
                Explore Velomac Anti-Vibration Signal Analysis <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
              </Link>
            </div>
          </div>

          <figure className="mt-5 overflow-hidden rounded-lg border border-metal-200 bg-metal-50 sm:mt-7" aria-labelledby="vibration-diagram-title">
            <figcaption id="vibration-diagram-title" className="border-b border-metal-200 px-4 py-3 text-base font-semibold text-navy-950 sm:px-6">
              How Mechanical Vibration Affects Flow Measurement
            </figcaption>
            <ol className="grid gap-5 px-4 py-4 sm:px-6 sm:py-5 md:grid-cols-3 md:gap-8">
              {stages.map((stage, index) => (
                <li key={stage.illustration} className="relative grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-x-3 md:flex md:flex-col md:items-stretch">
                  <SignalIllustration kind={stage.illustration} description={stage.description} />
                  <div className="md:mt-2">
                    <p className="text-xs font-semibold text-industrial-700">0{index + 1}</p>
                    <h3 className="mt-1 text-base font-semibold leading-snug text-navy-950">{stage.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{stage.note}</p>
                  </div>
                  {index < stages.length - 1 ? (
                    <>
                      <ArrowRight aria-hidden="true" size={18} className="absolute -right-6 top-9 hidden text-slate-500 md:block" />
                      <ArrowDown aria-hidden="true" size={15} className="absolute -bottom-[18px] left-11 text-slate-500 md:hidden" />
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-metal-200 px-4 py-3 sm:px-6">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Review together</span>
              {["Vibration source", "Pipe supports", "Meter position", "Operating flow range"].map((item) => (
                <span key={item} className="text-sm font-semibold text-navy-950">{item}</span>
              ))}
            </div>
          </figure>
          <p className="mt-2 text-xs leading-5 text-slate-500">Illustrative signal path, not a test result. Mechanical vibration does not produce a false reading in every installation.</p>
        </Container>
      </section>

      <section className="border-b border-metal-200 bg-metal-50 py-9 sm:py-12" aria-labelledby="vibration-conditions-title">
        <Container>
          <h2 id="vibration-conditions-title" className={headingClass}>What Should Be Checked Before Selecting a Flowmeter?</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-6">
            {conditions.map(({ title, Icon, points }) => (
              <div key={title} className="border-l-2 border-industrial-600 bg-white px-4 py-4 sm:px-5">
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950 sm:text-lg">
                  <Icon aria-hidden="true" size={19} strokeWidth={1.7} className="shrink-0 text-industrial-700" />{title}
                </h3>
                <PointList items={points} className="mt-3" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="vibration-meter-title">
        <Container>
          <h2 id="vibration-meter-title" className={headingClass}>Which Meter Direction Fits the Application?</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-5">
            <article className="rounded-lg border border-metal-200 border-t-2 border-t-industrial-600 bg-metal-50 p-4 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-industrial-700">Primary direction · compatible steam, gas and liquid</p>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_4.5rem] gap-x-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
                <div>
                  <h3 className="text-xl font-semibold leading-tight text-navy-950 sm:text-2xl">Vortex Flowmeter</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">Dedicated direction: Wide-Turndown Anti-Vibration Vortex Flowmeter.</p>
                </div>
                <p className="col-span-2 mt-2 text-sm leading-6 text-slate-700 sm:col-span-1 sm:row-start-2">Review this configuration for vibration-related signal interference. Suitability depends on the medium, operating range and installation.</p>
                <Image
                  src="/images/products/wide-turndown-anti-vibration-vortex-flowmeter.png"
                  alt="Velomac wide-turndown anti-vibration vortex flowmeter with complete transmitter and flanged meter body"
                  width={1137}
                  height={1350}
                  sizes="(min-width: 640px) 128px, 72px"
                  className="col-start-2 row-start-1 h-auto w-full self-center object-contain sm:row-span-2"
                />
              </div>
              <Link href={dedicatedPath} className={`${linkClass} mt-3`}>
                Explore the Anti-Vibration Vortex Solution <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
              </Link>
              <Link href="/products/vortex-flowmeter" className="focus-ring mt-1 block w-fit rounded-sm py-2 text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-industrial-700">
                View Vortex Flowmeter configurations
              </Link>
            </article>

            {swirl ? (
              <article className="flex flex-col rounded-lg border border-metal-200 p-4 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Conditional alternative · gas and steam</p>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_4.5rem] gap-x-3 sm:grid-cols-[minmax(0,1fr)_6.5rem]">
                  <div>
                    <h3 className="text-xl font-semibold text-navy-950 sm:text-2xl">{swirl.name}</h3>
                  </div>
                  <p className="col-span-2 mt-2 text-sm leading-6 text-slate-700 sm:col-span-1 sm:row-start-2">Consider where compact installation or compensation is relevant, subject to process and installation review.</p>
                  <Image src={swirl.image} alt={swirl.imageAlt} width={900} height={900} sizes="(min-width: 640px) 104px, 72px" className="col-start-2 row-start-1 h-auto w-full self-start object-contain sm:row-span-2" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">This is not the same verified anti-vibration capability as the dedicated vortex configuration.</p>
                <Link href="/products/swirl-flowmeter" className={`${linkClass} mt-auto pt-3`}>
                  View Swirl Flowmeter <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
                </Link>
              </article>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="border-b border-metal-200 bg-metal-50 py-9 sm:py-12" aria-labelledby="vibration-evidence-title">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8">
            <figure className="overflow-hidden rounded-lg border border-metal-200 bg-white">
              <Image
                src="/images/technology/vibration-test-system-photo.jpg"
                alt="Velomac vibration test setup with vortex flowmeter, vibration sensor and motor on the test line"
                width={1800}
                height={1350}
                sizes="(min-width: 1200px) 469px, (min-width: 1024px) 40vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)"
                className="aspect-[4/3] h-auto w-full object-contain"
              />
              <figcaption className="border-t border-metal-200 px-4 py-2 text-xs leading-5 text-slate-600">Existing in-house airflow and vibration test setup.</figcaption>
            </figure>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-industrial-700">Technical evidence</p>
              <h2 id="vibration-evidence-title" className={`${headingClass} mt-2`}>See the Conditions Behind the Test Result</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">Velomac’s in-house system applies controlled airflow and mechanical vibration, then records meter output for comparison under defined test conditions.</p>
              <Link href={testPath} className={`${linkClass} mt-3`}>
                See How Velomac Tests Vibration Interference <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-metal-200 py-9 sm:py-12" aria-labelledby="vibration-details-title">
        <Container>
          <h2 id="vibration-details-title" className={headingClass}>What Information Should You Share for Application Review?</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-7">
            <div className="rounded-lg bg-metal-50 p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-navy-950">Basic operating information</h3>
              <PointList items={basicDetails} className="mt-3" />
            </div>
            <div className="rounded-lg border border-metal-200 p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-navy-950">Vibration and installation information</h3>
              <PointList items={vibrationDetails} className="mt-3" />
              <p className="mt-3 border-t border-metal-200 pt-3 text-sm leading-6 text-slate-600">Vibration frequency or acceleration is useful <strong className="font-semibold text-navy-950">if available</strong>—it is not required to start the review.</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function PointList({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`grid gap-y-2 text-sm leading-5 text-slate-700 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check aria-hidden="true" size={14} className="mt-[3px] shrink-0 text-industrial-700" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SignalIllustration({ kind, description }: { kind: (typeof stages)[number]["illustration"]; description: string }) {
  return (
    <svg viewBox="0 0 260 130" role="img" aria-label={description} className="h-auto w-full max-w-[290px] text-industrial-700 md:max-w-none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <desc>{description}</desc>
      {kind === "zero" ? (
        <>
          <path d="M12 77h236v25H12z" fill="#E7EDF4" stroke="#8296AC" />
          <path d="M61 70v39m138-39v39M113 70V50h34v20" />
          <circle cx="130" cy="34" r="18" fill="#FFFFFF" />
          <path d="M122 34h16M130 41v-7" />
          <path d="M27 89h20m167 0h20" stroke="#8296AC" strokeDasharray="3 5" />
        </>
      ) : kind === "vibration" ? (
        <>
          <path d="M18 91h226v22H18z" fill="#E7EDF4" stroke="#8296AC" />
          <rect x="33" y="22" width="62" height="36" rx="7" fill="#E8F2FC" />
          <path d="M45 29v22m11-22v22m11-22v22m11-22v22M95 34h18v12H95M42 58l-4 9h54l-5-9" />
          <path d="m125 35 10 8-10 8 10 8-10 8 10 8-10 8m41-40 8 8-8 8 8 8-8 8" stroke="#0072CE" />
          <path d="M192 87v30m-5-35 5 5 5-5m-10 40 5-5 5 5" stroke="#8296AC" />
        </>
      ) : (
        <>
          <path d="M14 96h232v19H14z" fill="#E7EDF4" stroke="#8296AC" />
          <path d="M119 95V78h23v17M44 91v29m172-29v29" />
          <rect x="69" y="16" width="123" height="62" rx="8" fill="#FFFFFF" />
          <path d="M81 48h14l7-13 10 27 10-27 10 27 10-27 9 13h28" stroke="#0072CE" />
          <path d="M54 33h-8m5 18H38m23 14-10 6" stroke="#8296AC" />
        </>
      )}
    </svg>
  );
}
