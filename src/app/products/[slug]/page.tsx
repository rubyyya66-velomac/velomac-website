import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CTASection } from "@/components/CTASection";
import { Container, Section } from "@/components/Layout";
import { SpecTable } from "@/components/SpecTable";
import { applications } from "@/content/applications";
import { articles } from "@/content/resources";
import { getProductBySlug, products } from "@/content/products";
import { getProductApplicationImage } from "@/data/productApplicationImages";
import type { Product } from "@/types/content";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {};
  }

  return {
    title: product.seo.title,
    description: product.seo.description
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const applicationImage = getProductApplicationImage(product.slug);
  const relatedApplications = getRelatedApplications(product.slug);
  const relatedArticles = articles
    .filter((article) => article.relatedProductSlugs.includes(product.slug))
    .slice(0, 3);
  const selectionNotes = getSelectionNotes(product);
  const quoteDetails = getQuoteDetails(product);

  return (
    <>
      <section className="border-b border-metal-200 bg-gradient-to-br from-white via-white to-blue-50/70">
        <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-20">
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
                Request a Quote
                <span aria-hidden="true">{">"}</span>
              </Link>
              <Link
                href="/applications"
                className="focus-ring inline-flex items-center justify-center border border-metal-200 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:border-industrial-600 hover:text-industrial-700"
              >
                View Applications
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
              Where It Is Used
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              Application Context
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">{applicationImage.summary}</p>
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
              Selection Notes
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              Conditions to Confirm
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              A useful quotation starts with the real operating condition, not only the model name.
            </p>
          </div>
          <RowList items={selectionNotes} />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              Typical Applications
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              Related Site Conditions
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Compare the product with nearby application scenarios before sending site details.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {relatedApplications.map((application) => (
                <ChipLink key={application.slug} href={`/applications#${application.slug}`}>
                  {application.title}
                </ChipLink>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-navy-950">Available configurations</h3>
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
          </div>
        </Container>
      </Section>

      <Section className="bg-metal-50">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              Before Quotation
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              What to Send
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              These details help Velomac recommend a suitable meter configuration and avoid a model-only quotation.
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
                Related Resources
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
                Selection Notes to Review
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
              Technical Data
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              Data for Configuration Review
            </h2>
          </div>
          <div className="grid gap-10">
            <SpecTable table={product.technicalData} />
            {product.flowRange ? <SpecTable table={{ ...product.flowRange, title: product.flowRange.title || "Flow Range" }} /> : null}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Send site details for a better recommendation."
        text="Share the fluid, pipe size, flow range, pressure, temperature, quantity, installation details and signal output needs."
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
