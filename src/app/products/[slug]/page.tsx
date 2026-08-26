import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { Container, Section } from "@/components/Layout";
import { SpecTable } from "@/components/SpecTable";
import { applications } from "@/content/applications";
import { articles } from "@/content/resources";
import { getProductBySlug, products } from "@/content/products";
import { featuredVortexSolution } from "@/content/featuredVortexSolution";
import { productCatalog } from "@/content/productCatalog";
import { getProductApplicationImage } from "@/data/productApplicationImages";
import type { Product } from "@/types/content";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbStructuredData, productStructuredData } from "@/lib/structuredData";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {};
  }

  return buildPageMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path: `/products/${product.slug}`,
    image: product.image,
    imageAlt: product.imageAlt
  });
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const applicationImage = getProductApplicationImage(product.slug);
  const relatedApplications = getRelatedApplications(product.slug);
  const relatedArticles = getRelatedArticles(product.slug);
  const relatedTechnology = getRelatedTechnology(product.slug);
  const selectionNotes = getSelectionNotes(product);
  const quoteDetails = getQuoteDetails(product);
  const productArticle = getIndefiniteArticle(product.name);

  return (
    <>
      <JsonLd data={productStructuredData(product)} />
      <JsonLd
        data={breadcrumbStructuredData([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` }
        ])}
      />
      <section className="border-b border-metal-200 bg-gradient-to-br from-white via-white to-blue-50/70">
        <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500 lg:col-span-2">
            <Link href="/" className="focus-ring transition hover:text-industrial-700">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" className="focus-ring transition hover:text-industrial-700">Products</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700">{product.name}</span>
          </nav>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {product.category}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-navy-950 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{product.shortDescription}</p>
            <p className="mt-5 text-base leading-7 text-slate-600">{product.overview}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="focus-ring inline-flex items-center justify-center gap-2 bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700"
              >
                {productCatalog.detailPage.requestQuoteLabel}
                <span aria-hidden="true">{">"}</span>
              </Link>
              <Link
                href="/applications"
                className="focus-ring inline-flex items-center justify-center border border-metal-200 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:border-industrial-600 hover:text-industrial-700"
              >
                {productCatalog.detailPage.viewApplicationsLabel}
              </Link>
            </div>
          </div>
          <div className="relative bg-white">
            <Image
              src={product.image}
              alt={product.imageAlt}
              width={1040}
              height={760}
              priority
              className="mx-auto h-auto w-full max-w-[720px] object-contain"
            />
          </div>
        </Container>
      </section>

      {product.slug === featuredVortexSolution.parentProductSlug ? (
        <section className="border-b border-metal-200 bg-navy-950 text-white" aria-labelledby="vortex-family-solution">
          <Container className="grid gap-5 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:py-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Featured vortex configuration</p>
              <h2 id="vortex-family-solution" className="mt-2 text-2xl font-semibold leading-8 text-white">
                {featuredVortexSolution.hero.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                For variable-flow applications where mechanical vibration can interfere with vortex signal detection.
              </p>
            </div>
            <Link
              href={`/products/${featuredVortexSolution.parentProductSlug}/${featuredVortexSolution.slug}`}
              className="focus-ring inline-flex w-fit items-center gap-2 border border-blue-300 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-navy-950"
            >
              Explore this configuration <span aria-hidden="true">→</span>
            </Link>
          </Container>
        </section>
      ) : null}

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[6px] bg-navy-950">
            <Image
              src={applicationImage.src}
              alt={applicationImage.alt}
              width={900}
              height={520}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {productCatalog.detailPage.applicationEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {productCatalog.detailPage.applicationTitle}
            </h2>
            <h3 className="mt-5 text-xl font-semibold leading-8 text-navy-950">
              Where is {productArticle} {product.name} typically used?
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-600">{applicationImage.summary}</p>
            <dl className="mt-6 grid gap-4 border-l-2 border-industrial-600 pl-5 text-sm leading-6">
              <div>
                <dt className="font-semibold text-navy-950">Typical media</dt>
                <dd className="mt-1 text-slate-600">{product.typicalMedia.slice(0, 4).join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-950">Selection basis</dt>
                <dd className="mt-1 text-slate-600">{getSelectionBasis(product)}</dd>
              </div>
            </dl>
            <div className="mt-7 divide-y divide-metal-200 border-y border-metal-200">
              {product.typicalApplications.slice(0, 5).map((item) => (
                <p key={item} className="py-3 text-sm font-semibold leading-6 text-navy-950">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-metal-50">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {productCatalog.detailPage.selectionEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {productCatalog.detailPage.selectionTitle}
            </h2>
            <h3 className="mt-5 text-xl font-semibold leading-8 text-navy-950">
              What should be checked before selecting {productArticle} {product.name}?
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {productCatalog.detailPage.selectionText}
            </p>
          </div>
          <RowList items={selectionNotes} />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {productCatalog.detailPage.relatedApplicationsEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {productCatalog.detailPage.relatedApplicationsTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              {productCatalog.detailPage.relatedApplicationsText}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {relatedApplications.map((application) => (
                <ChipLink key={application.slug} href={`/applications/${application.slug}`}>
                  {application.title}
                </ChipLink>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-navy-950">{productCatalog.detailPage.configurationTitle}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.availableTypes.map((type) => (
                <span key={type} className="border border-metal-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  {type}
                </span>
              ))}
            </div>
            <div className="mt-8 space-y-5">
              {product.coreCapabilities.slice(0, 3).map((capability) => (
                <div key={capability.title} className="border-l-2 border-industrial-600 pl-5">
                  <h3 className="text-base font-semibold text-navy-950">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{capability.text}</p>
                </div>
              ))}
            </div>
            {relatedTechnology.length ? (
              <div className="mt-8 border-t border-metal-200 pt-6">
                <h3 className="text-base font-semibold text-navy-950">Related engineering and calibration</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedTechnology.map((item) => (
                    <ChipLink key={item.href} href={item.href}>
                      {item.label}
                    </ChipLink>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section className="bg-metal-50">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {productCatalog.detailPage.quotationEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {productCatalog.detailPage.quotationTitle}
            </h2>
            <h3 className="mt-5 text-xl font-semibold leading-8 text-navy-950">
              What site details should be sent for {productArticle} {product.name} review?
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {productCatalog.detailPage.quotationText}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quoteDetails.map((item) => (
              <div key={item} className="border-l-2 border-industrial-600 bg-white px-4 py-3 text-sm font-semibold text-navy-950">
                {item}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {relatedArticles.length ? (
        <Section>
          <Container>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                {productCatalog.detailPage.resourcesEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
                {productCatalog.detailPage.resourcesTitle}
              </h2>
            </div>
            <div className="mt-8 divide-y divide-metal-200 border-y border-metal-200">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="focus-ring grid gap-2 py-5 transition hover:text-industrial-700 md:grid-cols-[0.28fr_1fr_auto] md:items-center"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                    {article.category}
                  </span>
                  <span className="text-lg font-semibold text-navy-950">{article.title}</span>
                  <span className="text-sm font-semibold text-industrial-700">Read article {">"}</span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="bg-white">
        <Container className="grid gap-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {productCatalog.detailPage.technicalEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {productCatalog.detailPage.technicalTitle}
            </h2>
          </div>
          <div className="grid gap-10">
            <SpecTable table={product.technicalData} />
            {product.flowRange ? <SpecTable table={{ ...product.flowRange, title: product.flowRange.title || "Flow Range" }} /> : null}
          </div>
        </Container>
      </Section>

      <CTASection
        title={productCatalog.detailPage.ctaTitle}
        text={productCatalog.detailPage.ctaText}
        imageSrc={applicationImage.src}
        imageAlt={applicationImage.alt}
        surfaceClassName="bg-industrial-700"
      />
    </>
  );
}

function getRelatedApplications(slug: string) {
  const slugs = getProductBySlug(slug)?.relatedApplicationSlugs || [];
  return slugs
    .map((applicationSlug) => applications.find((application) => application.slug === applicationSlug))
    .filter((application): application is (typeof applications)[number] => Boolean(application));
}

function getSelectionBasis(product: Product) {
  return product.category === "Level Instruments"
    ? "Medium, level range, pressure, temperature, mounting position and required output."
    : "Minimum, normal and maximum flow, pressure, temperature, pipe size and installation conditions.";
}

function getIndefiniteArticle(name: string) {
  return /^[aeiou]/i.test(name) ? "an" : "a";
}

const relatedTechnologyByProduct: Record<string, { href: string; label: string }[]> = {
  "vortex-flowmeter": [
    { href: "/technology/vibration-measurement-test-system", label: "Vibration Measurement Test System" },
    { href: "/technology/flow-calibration-systems", label: "Flow Calibration Systems" },
    { href: "/quality-innovation", label: "Vortex Certification & Patent Evidence" }
  ],
  "electromagnetic-flowmeter": [
    { href: "/technology/master-meter-liquid-calibration", label: "Master-Meter Liquid Calibration" },
    { href: "/technology/gravimetric-liquid-calibration", label: "Gravimetric Liquid Calibration" },
    { href: "/quality-innovation", label: "Electromagnetic Certification Evidence" }
  ],
  "liquid-turbine-flowmeter": [
    { href: "/technology/master-meter-liquid-calibration", label: "Master-Meter Liquid Calibration" }
  ],
  "gas-turbine-flowmeter": [
    { href: "/technology/gas-flow-calibration", label: "Gas Flow Calibration" }
  ],
  "thermal-mass-flowmeter": [
    { href: "/technology/gas-flow-calibration", label: "Gas Flow Calibration" }
  ],
  "v-cone-flowmeter": [
    { href: "/technology/flow-calibration-systems", label: "Flow Calibration Systems" }
  ],
  "swirl-flowmeter": [
    { href: "/technology/gas-flow-calibration", label: "Gas Flow Calibration" }
  ],
  "balanced-differential-pressure-flowmeter": [
    { href: "/technology/flow-calibration-systems", label: "Flow Calibration Systems" }
  ],
  "ultrasonic-flowmeter": [
    { href: "/technology/master-meter-liquid-calibration", label: "Master-Meter Liquid Calibration" }
  ]
};

const curatedResourceSlugsByProduct: Record<string, string[]> = {
  "vortex-flowmeter": [
    "vortex-flowmeter-steam-selection",
    "pharma-utility-flow-measurement-precheck",
    "cement-carbon-capture-utility-flow"
  ],
  "electromagnetic-flowmeter": [
    "flowmeter-data-quality-measurement-point",
    "semiconductor-water-flow-boundaries",
    "concentrator-expansion-slurry-flow"
  ],
  "ultrasonic-flowmeter": [
    "data-center-commissioning-water-flow-record",
    "data-center-water-recovery-flow-measurement",
    "temporary-wastewater-flow-measurement-brownfield-upgrade"
  ],
  "thermal-mass-flowmeter": [
    "cement-carbon-capture-utility-flow",
    "semiconductor-utility-flowmeter-sizing-full-utilization",
    "blast-furnace-gas-flow-measurement"
  ]
};

function getRelatedArticles(productSlug: string) {
  const curatedSlugs = curatedResourceSlugsByProduct[productSlug];

  if (curatedSlugs) {
    return curatedSlugs
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is (typeof articles)[number] => Boolean(article));
  }

  return articles
    .filter((article) => article.relatedProductSlugs.includes(productSlug))
    .slice(0, 3);
}

function getRelatedTechnology(slug: string) {
  return relatedTechnologyByProduct[slug] || [];
}

function getSelectionNotes(product: Product) {
  if (product.category === "Level Instruments") {
    return [
      { label: "Medium", value: product.typicalMedia.slice(0, 3).join(", ") },
      { label: "Measurement range", value: "Confirm tank or vessel height and expected level range." },
      { label: "Pressure / temperature", value: "Share operating condition and design limits." },
      { label: "Connection", value: "Confirm vessel connection, mounting style and access space." },
      { label: "Media compatibility", value: "Review wetted materials against the liquid or solid medium." },
      { label: "Signal / display", value: "Confirm local indication, switch, analog or digital output needs." }
    ];
  }

  if (product.slug === "vortex-flowmeter") {
    return [
      { label: "Media condition", value: "Confirm steam, gas or clean-liquid service and the actual operating state." },
      { label: "Flow envelope", value: "Share minimum, normal and maximum flow before sizing the meter." },
      { label: "Pressure / temperature", value: "Confirm operating values and whether compensation is required." },
      { label: "Pipe layout", value: "Send DN, connection type, upstream fittings and available straight pipe." },
      { label: "Vibration", value: "Describe nearby pumps, compressors, pipe movement or other vibration sources." },
      { label: "Signal / display", value: "Confirm local display, output and receiving-system requirements." }
    ];
  }

  if (product.slug === "electromagnetic-flowmeter") {
    return [
      { label: "Conductivity", value: "Confirm that the liquid is conductive and describe its composition." },
      { label: "Flow range", value: "Share minimum, normal and maximum flow before sizing." },
      { label: "Full pipe", value: "Review whether the selected location can remain completely filled." },
      { label: "Materials", value: "Check liner and electrode compatibility with the process liquid." },
      { label: "Installation", value: "Confirm grounding, pipe arrangement and nearby disturbances." },
      { label: "Signal / display", value: "Confirm local indication and control-system output requirements." }
    ];
  }

  if (product.slug === "gas-turbine-flowmeter") {
    return [
      { label: "Gas composition", value: "Describe the gas and whether the service is clean and dry." },
      { label: "Flow range", value: "Share minimum, normal and maximum operating flow." },
      { label: "Pressure / temperature", value: "Confirm conditions used for density and volume review." },
      { label: "Pipe layout", value: "Send DN, upstream fittings and available straight pipe." },
      { label: "Installation", value: "Note filtration, access and maintenance conditions." },
      { label: "Signal / display", value: "Confirm totalization, local display and output needs." }
    ];
  }

  if (product.slug === "thermal-mass-flowmeter") {
    return [
      { label: "Gas composition", value: "Confirm the gas or gas mixture used at the measurement point." },
      { label: "Gas condition", value: "Share pressure, temperature and any moisture or contamination concerns." },
      { label: "Flow range", value: "Provide minimum, normal and maximum flow for application review." },
      { label: "Pipe / duct", value: "Confirm size, geometry and insertion or inline arrangement." },
      { label: "Installation", value: "Review upstream disturbances, access and sensor position." },
      { label: "Signal / display", value: "Confirm local display, totalization and control-system output." }
    ];
  }

  return [
    { label: "Media", value: product.typicalMedia.slice(0, 4).join(", ") },
    { label: "Flow range", value: "Share minimum, normal and maximum flow before sizing." },
    { label: "Pressure / temperature", value: "Confirm operating and design conditions." },
    { label: "Pipe size", value: "Send DN, connection type and available straight pipe." },
    { label: "Installation condition", value: "Note vibration, access limits, pipe layout and shutdown limits." },
    { label: "Output / signal", value: "Confirm local display, 4-20mA, pulse, RS485 or other site needs." }
  ];
}

function getQuoteDetails(product: Product) {
  if (product.category === "Level Instruments") {
    return [
      "Medium",
      "Tank or vessel type",
      "Measurement range",
      "Pressure",
      "Temperature",
      "Connection type",
      "Quantity",
      "Signal output"
    ];
  }

  if (product.slug === "vortex-flowmeter") {
    return ["Medium and steam condition", "Pipe size / DN", "Minimum / normal / maximum flow", "Pressure and temperature", "Available straight pipe", "Vibration source", "Compensation requirement", "Signal output"];
  }

  if (product.slug === "electromagnetic-flowmeter") {
    return ["Liquid and conductivity", "Pipe size / DN", "Minimum / normal / maximum flow", "Pressure and temperature", "Liner / electrode requirement", "Pipe-full condition", "Grounding details", "Signal output"];
  }

  if (product.slug === "gas-turbine-flowmeter") {
    return ["Gas composition", "Pipe size / DN", "Minimum / normal / maximum flow", "Pressure and temperature", "Cleanliness / filtration", "Available straight pipe", "Quantity", "Signal output"];
  }

  if (product.slug === "thermal-mass-flowmeter") {
    return ["Gas composition", "Pipe or duct size", "Minimum / normal / maximum flow", "Pressure and temperature", "Moisture / contamination", "Insertion or inline arrangement", "Quantity", "Signal output"];
  }

  return [
    "Fluid / media",
    "Pipe size / DN",
    "Flow range",
    "Pressure",
    "Temperature",
    "Quantity",
    "Installation details",
    "Signal output"
  ];
}

function RowList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="divide-y divide-metal-200 border-y border-metal-200 bg-white">
      {items.map((item) => (
        <div key={item.label} className="grid gap-2 py-4 md:grid-cols-[0.32fr_1fr]">
          <h3 className="text-sm font-semibold text-navy-950">{item.label}</h3>
          <p className="text-sm leading-6 text-slate-600">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function ChipLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex border border-metal-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-industrial-600 hover:text-industrial-700"
    >
      {children}
    </Link>
  );
}
