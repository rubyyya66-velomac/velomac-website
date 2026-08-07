import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Layout";
import { getProductsByCategory } from "@/content/products";
import type { Product } from "@/types/content";

export const metadata: Metadata = {
  title: "Industrial Measurement Products | Flow and Level Instrumentation",
  description:
    "Explore Velomac flow and level instrumentation for steam, gas, liquids, water and industrial process applications."
};

const flowProductOrder = [
  "vortex-flowmeter",
  "electromagnetic-flowmeter",
  "liquid-turbine-flowmeter",
  "gas-turbine-flowmeter",
  "thermal-mass-flowmeter",
  "ultrasonic-flowmeter",
  "v-cone-flowmeter",
  "balanced-differential-pressure-flowmeter",
  "swirl-flowmeter"
] as const;

const catalogueDescriptions: Record<string, string> = {
  "vortex-flowmeter": "Steam, gas and liquid flow measurement across changing process conditions.",
  "electromagnetic-flowmeter": "For conductive liquids, water, wastewater and chemical applications.",
  "liquid-turbine-flowmeter": "For clean liquid applications with stable flow conditions.",
  "gas-turbine-flowmeter": "For natural gas, industrial gases and compatible gas applications.",
  "thermal-mass-flowmeter": "Direct mass flow measurement for compressed air and industrial gases.",
  "v-cone-flowmeter": "Differential-pressure flow measurement for larger process lines.",
  "swirl-flowmeter": "Gas and steam measurement where compact installation is important.",
  "balanced-differential-pressure-flowmeter": "Differential-pressure flow measurement across process and duct applications.",
  "ultrasonic-flowmeter": "Closed-pipe, clamp-on and other liquid flow measurement applications.",
  "radar-level-transmitter": "Non-contact level measurement for industrial tanks and process vessels.",
  "magnetic-level-gauge": "Direct local level indication for industrial tanks and vessels."
};

const imageScaleClasses: Record<string, string> = {
  "swirl-flowmeter": "scale-[1.1] group-hover:scale-[1.13]",
  "ultrasonic-flowmeter": "scale-[1.08] group-hover:scale-[1.11]",
  "gas-turbine-flowmeter": "scale-[1.07] group-hover:scale-[1.1]",
  "balanced-differential-pressure-flowmeter": "scale-[1.06] group-hover:scale-[1.09]",
  "magnetic-level-gauge": "scale-[1.06] group-hover:scale-[1.09]"
};

export default function ProductsPage() {
  const flowmeters = getProductsByCategory("Flowmeters");
  const levelInstruments = getProductsByCategory("Level Instruments");
  const flowmeterBySlug = new Map(flowmeters.map((product) => [product.slug, product]));
  const orderedFlowmeters = flowProductOrder
    .map((slug) => flowmeterBySlug.get(slug))
    .filter((product): product is Product => Boolean(product));

  return (
    <>
      <section className="velomac-blue-surface text-white">
        <Container className="py-12 sm:py-14 lg:py-16">
          <div className="max-w-4xl">
            <p className={darkEyebrowClass}>Products</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
              Industrial Measurement Products
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50 sm:text-xl">
              Flow and level instrumentation for industrial applications.
            </p>
          </div>
        </Container>
      </section>

      <section id="flow-measurement" className="scroll-mt-28 py-16 sm:py-20 lg:py-24">
        <Container>
          <CategoryHeader
            category="Flow Measurement"
            description="Flow measurement technologies for steam, gas, liquids, water and industrial process applications."
          />

          <FeaturedVortexSolution />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orderedFlowmeters.map((product) => (
              <CatalogueProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section id="level-measurement" className="scroll-mt-28 border-t border-metal-200 bg-metal-50 py-16 sm:py-20 lg:py-24">
        <Container>
          <CategoryHeader
            category="Level Measurement"
            description="Level measurement and local level indication for industrial vessels and tanks."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {levelInstruments.map((product) => (
              <CatalogueProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function CategoryHeader({
  category,
  description
}: {
  category: string;
  description: string;
}) {
  return (
    <header className="border-b border-metal-300 pb-7">
      <h2 className={categoryTitleClass}>{category}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{description}</p>
    </header>
  );
}

function FeaturedVortexSolution() {
  return (
    <article className="relative mt-10 grid overflow-hidden border border-metal-300 bg-white shadow-[0_18px_50px_rgba(7,26,45,0.08)] lg:grid-cols-[0.58fr_0.42fr]">
      <div className="border-t-4 border-industrial-600 px-6 pb-5 pt-7 sm:px-8 sm:pb-6 sm:pt-8 lg:col-start-1 lg:row-start-1 lg:px-10 lg:pt-10">
        <p className={eyebrowClass}>Featured Vortex Solution</p>
        <h3 className="mt-4 max-w-2xl text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.02em] text-navy-950 sm:text-[2.1rem] lg:text-[2.2rem]">
          Wide-Turndown <span className="whitespace-nowrap">Anti-Vibration</span> Vortex Flowmeter
        </h3>
      </div>

      <Link
        href="/products/vortex-flowmeter/wide-turndown-anti-vibration"
        aria-label="Explore the Wide-Turndown Anti-Vibration Vortex Flowmeter"
        className="focus-ring group relative min-h-[360px] border-y border-metal-200 bg-metal-50 sm:min-h-[420px] lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:min-h-[500px] lg:border-b-0 lg:border-l lg:border-t-4 lg:border-t-industrial-600"
      >
        <Image
          src="/images/products/wide-turndown-anti-vibration-vortex-flowmeter.png"
          alt="Velomac wide-turndown anti-vibration vortex flowmeter with complete transmitter, meter body and flanges"
          fill
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-contain p-5 transition duration-300 group-hover:scale-[1.025] sm:p-7 lg:p-8"
        />
      </Link>

      <div className="grid grid-cols-3 divide-x divide-metal-200 border-b border-metal-200 px-6 sm:px-8 lg:col-start-1 lg:row-start-2 lg:px-10">
        <FeaturedFact value="1:70" label="Turndown" />
        <FeaturedFact value="±0.5%" label="Accuracy" />
        <FeaturedFact value="4-Level" label="Anti-Vibration Mode" />
      </div>

      <p className="px-6 py-6 text-base leading-7 text-slate-600 sm:px-8 sm:text-lg sm:leading-8 lg:col-start-1 lg:row-start-3 lg:px-10">
        Variable flow and mechanical vibration can challenge the same measurement point. This configuration is developed around both operating conditions.
      </p>

      <div className="px-6 pb-8 sm:px-8 lg:col-start-1 lg:row-start-4 lg:px-10 lg:pb-10">
        <Link
          href="/products/vortex-flowmeter/wide-turndown-anti-vibration"
          className="focus-ring inline-flex items-center gap-2 bg-navy-950 px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-industrial-700"
        >
          Explore the Solution <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function FeaturedFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 px-3 py-5 first:pl-0 last:pr-0 sm:px-5">
      <p className="whitespace-nowrap text-2xl font-semibold tracking-[-0.03em] text-industrial-700 sm:text-3xl">{value}</p>
      <p className="mt-2 text-[12px] font-semibold uppercase leading-4 tracking-[0.1em] text-slate-500 sm:text-[13px] sm:tracking-[0.12em]">{label}</p>
    </div>
  );
}

function CatalogueProductCard({ product }: { product: Product }) {
  const imageScaleClass = imageScaleClasses[product.slug] ?? "scale-[1.04] group-hover:scale-[1.07]";

  return (
    <article className="group flex h-full min-h-[460px] flex-col overflow-hidden rounded-[6px] border border-metal-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-industrial-600">
      <Link href={`/products/${product.slug}`} className="focus-ring relative block h-60 overflow-hidden border-b border-metal-200 bg-metal-50 sm:h-64">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-contain p-4 transition duration-300 ${imageScaleClass}`}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h4 className="text-xl font-semibold leading-7 text-navy-950 sm:min-h-14">{product.name}</h4>
        <p className="mt-3 flex-1 text-base leading-7 text-slate-600 sm:min-h-[5.25rem]">
          {catalogueDescriptions[product.slug] ?? product.shortDescription}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="focus-ring mt-5 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-industrial-700 transition hover:text-navy-950"
        >
          View details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

const categoryTitleClass = "text-[1.9rem] font-semibold leading-tight tracking-[-0.01em] text-navy-950 sm:text-4xl";
const eyebrowClass = "text-[13px] font-semibold uppercase tracking-[0.16em] text-industrial-700";
const darkEyebrowClass = "text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-100";
