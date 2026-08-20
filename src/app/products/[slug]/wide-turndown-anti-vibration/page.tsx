import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/Layout";
import { JsonLd } from "@/components/JsonLd";
import { featuredVortexSolution } from "@/content/featuredVortexSolution";
import { getProductBySlug } from "@/content/products";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { breadcrumbStructuredData, productStructuredData } from "@/lib/structuredData";
import { MeasurementRangeTabs } from "./MeasurementRangeTabs";

export function generateStaticParams() {
  return [{ slug: featuredVortexSolution.parentProductSlug }];
}

export const metadata: Metadata = buildPageMetadata({
  title: featuredVortexSolution.metadata.title,
  description: featuredVortexSolution.metadata.description,
  path: `/products/${featuredVortexSolution.parentProductSlug}/${featuredVortexSolution.slug}`,
  image: featuredVortexSolution.hero.image.src,
  imageAlt: featuredVortexSolution.hero.image.alt
});

export default function WideTurndownAntiVibrationPage({ params }: { params: { slug: string } }) {
  if (params.slug !== featuredVortexSolution.parentProductSlug) {
    notFound();
  }

  const parentProduct = getProductBySlug(featuredVortexSolution.parentProductSlug)!;
  const pagePath = `/products/${featuredVortexSolution.parentProductSlug}/${featuredVortexSolution.slug}`;

  return (
    <>
      <JsonLd
        data={{
          ...productStructuredData(parentProduct),
          "@id": `${absoluteUrl(pagePath)}#product`,
          name: featuredVortexSolution.hero.title,
          description: featuredVortexSolution.metadata.description,
          image: absoluteUrl(featuredVortexSolution.hero.image.src),
          url: absoluteUrl(pagePath)
        }}
      />
      <JsonLd
        data={breadcrumbStructuredData([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: parentProduct.name, path: `/products/${parentProduct.slug}` },
          { name: featuredVortexSolution.hero.title, path: pagePath }
        ])}
      />
      <section className="overflow-hidden border-b border-metal-200 bg-metal-50">
        <Container className="grid gap-x-10 gap-y-8 py-12 sm:py-16 lg:grid-cols-[1.28fr_0.72fr] lg:grid-rows-[auto_auto_auto] lg:items-center lg:py-20">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className={technicalLabelClass}>{featuredVortexSolution.hero.eyebrow}</p>
            <h1 className="mt-4 text-[2.55rem] font-semibold leading-[1.06] tracking-[-0.025em] text-navy-950 sm:text-5xl lg:text-[2.8rem] xl:text-[3.1rem]">
              {featuredVortexSolution.hero.title}
            </h1>
            <p className="mt-6 text-xl font-semibold leading-8 text-navy-950">
              {featuredVortexSolution.hero.lead}
            </p>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {featuredVortexSolution.hero.description}
            </p>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:max-w-none">
            <Image
              src={featuredVortexSolution.hero.image.src}
              alt={featuredVortexSolution.hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 520px"
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-3 divide-x divide-metal-200 border-y border-metal-200 lg:col-start-1 lg:row-start-2">
            {featuredVortexSolution.hero.metrics.map((metric) => (
              <EngineeringNumber key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>

          <div className="flex flex-wrap gap-3 lg:col-start-1 lg:row-start-3">
            <PrimaryLink href={featuredVortexSolution.hero.primaryCta.href}>{featuredVortexSolution.hero.primaryCta.label}</PrimaryLink>
            <SecondaryLink href={featuredVortexSolution.hero.secondaryCta.href}>{featuredVortexSolution.hero.secondaryCta.label}</SecondaryLink>
          </div>
        </Container>
      </section>

      <PageSection compact>
        <SectionHeading
          eyebrow={featuredVortexSolution.operatingConditions.eyebrow}
          title={featuredVortexSolution.operatingConditions.title}
          description={featuredVortexSolution.operatingConditions.description}
        />

        <div className="mt-8 border-y border-metal-200 py-6">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-3">
            {featuredVortexSolution.operatingConditions.stages.map((stage, index) => (
              <div key={stage} className="contents">
                <p className="text-center text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-navy-950 sm:text-sm sm:leading-5 sm:tracking-[0.12em]">
                  {stage}
                </p>
                {index < 3 ? <span aria-hidden="true" className="text-xl font-medium text-industrial-600 sm:text-3xl">→</span> : null}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-lg font-semibold leading-8 text-navy-950">
          {featuredVortexSolution.operatingConditions.conclusion}
        </p>
      </PageSection>

      <section className="bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-start lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">{featuredVortexSolution.flowEnvelope.eyebrow}</p>
            <p className="mt-5 text-[5rem] font-semibold leading-none tracking-[-0.05em] text-white sm:text-[7rem]">{featuredVortexSolution.flowEnvelope.value}</p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">{featuredVortexSolution.flowEnvelope.valueLabel}</p>
          </div>
          <div>
            <SectionHeading
              dark
              title={featuredVortexSolution.flowEnvelope.title}
              description={featuredVortexSolution.flowEnvelope.description}
            />
            <div className="mt-9 grid border-y border-white/15 sm:grid-cols-3 sm:divide-x sm:divide-white/15">
              {featuredVortexSolution.flowEnvelope.applications.map((example) => (
                <h3 key={example} className="border-b border-white/15 py-5 text-xl font-semibold leading-7 text-white last:border-b-0 sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                  {example}
                </h3>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <PageSection>
        <SectionHeading
          eyebrow={featuredVortexSolution.engineering.eyebrow}
          title={featuredVortexSolution.engineering.title}
        />
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <VortexEngineeringVisual />
          <div className="divide-y divide-metal-200 border-y border-metal-200">
            {featuredVortexSolution.engineering.mechanisms.map((mechanism) => (
              <div key={mechanism.number} className="grid grid-cols-[3rem_1fr] gap-4 py-6 sm:grid-cols-[4rem_1fr]">
                <p className="pt-1 text-xs font-semibold tracking-[0.16em] text-industrial-700">{mechanism.number}</p>
                <div>
                  <h3 className={h3Class}>{mechanism.title}</h3>
                  <p className={`mt-2 ${bodyClass}`}>{mechanism.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection className="bg-metal-50">
        <SectionHeading eyebrow={featuredVortexSolution.vibration.eyebrow} title={featuredVortexSolution.vibration.title} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          <div>
            <p className="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              {featuredVortexSolution.vibration.description}
            </p>
            <div className="mt-9 border-l-2 border-industrial-600 pl-6">
              <p className="text-5xl font-semibold leading-none tracking-[-0.04em] text-industrial-700 sm:text-6xl">{featuredVortexSolution.vibration.modeValue}</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-navy-950">{featuredVortexSolution.vibration.modeLabel}</p>
            </div>
          </div>
          <SignalProcessingVisual />
        </div>

        <div className="mt-12 grid gap-x-12 border-y border-metal-200 md:grid-cols-2">
          {featuredVortexSolution.vibration.modes.map((mode) => (
            <EditorialRow key={mode.title} title={mode.title} text={mode.text} />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading eyebrow={featuredVortexSolution.engineeringData.eyebrow} title={featuredVortexSolution.engineeringData.title} />
        <div className="mt-10 grid grid-cols-2 border-y border-metal-300 lg:grid-cols-4 lg:divide-x lg:divide-metal-200">
          {featuredVortexSolution.engineeringData.metrics.map((metric) => (
            <MetricStripItem key={metric.label} value={metric.value} label={metric.label} />
          ))}
        </div>
        <p className="border-b border-metal-200 py-6 text-lg leading-8 text-slate-600">
          <span className="font-semibold text-navy-950">{featuredVortexSolution.engineeringData.mediaLabel}:</span>{" "}
          {featuredVortexSolution.engineeringData.media.join(" · ")}
        </p>
      </PageSection>

      <PageSection className="bg-metal-50">
        <div id="full-measurement-range" className="scroll-mt-56 lg:scroll-mt-32">
          <SectionHeading eyebrow={featuredVortexSolution.measurementRange.eyebrow} title={featuredVortexSolution.measurementRange.title} />
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.3fr_0.7fr] lg:items-start lg:gap-16">
            <div>
              <p className="text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
                {featuredVortexSolution.measurementRange.description}
              </p>
              <div className="mt-8 border-l-2 border-industrial-600 pl-5">
                <p className="text-3xl font-semibold tracking-[-0.03em] text-navy-950">{featuredVortexSolution.measurementRange.sizeRange}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{featuredVortexSolution.measurementRange.sizeCountLabel}</p>
              </div>
            </div>
            <MeasurementRangeTabs
              rows={featuredVortexSolution.measurementRange.rows as [string, string, string, string, string][]}
            />
          </div>
        </div>
      </PageSection>

      <section id="application-check" className="scroll-mt-56 bg-industrial-700 py-16 text-white sm:py-20 lg:scroll-mt-28">
        <Container className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">{featuredVortexSolution.applicationReview.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {featuredVortexSolution.applicationReview.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">
              {featuredVortexSolution.applicationReview.description}
            </p>
            <PrimaryLink href={featuredVortexSolution.applicationReview.buttonHref} inverse>
              {featuredVortexSolution.applicationReview.buttonLabel}
            </PrimaryLink>
          </div>
          <div className="grid grid-cols-2 gap-x-8 border-t border-white/25 sm:grid-cols-3">
            {featuredVortexSolution.applicationReview.details.map((detail) => (
              <p key={detail} className="border-b border-white/20 py-5 text-base font-semibold leading-7 text-white">
                {detail}
              </p>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

const technicalLabelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700";
const bodyClass = "text-lg leading-8 text-slate-600";
const h3Class = "text-xl font-semibold leading-7 text-navy-950";

function PageSection({ children, className = "", compact = false }: { children: ReactNode; className?: string; compact?: boolean }) {
  return (
    <section className={`${compact ? "py-14 sm:py-16 lg:py-[4.5rem]" : "py-16 sm:py-20 lg:py-24"} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div>
      {eyebrow ? <p className={dark ? "text-xs font-semibold uppercase tracking-[0.18em] text-blue-200" : technicalLabelClass}>{eyebrow}</p> : null}
      <h2 className={`mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:whitespace-nowrap lg:text-[2.75rem] lg:leading-[1.08] ${dark ? "text-white" : "text-navy-950"}`}>
        {title}
      </h2>
      {description ? <p className={`mt-5 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8 ${dark ? "text-slate-300" : "text-slate-600"}`}>{description}</p> : null}
    </div>
  );
}

function EngineeringNumber({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 px-3 py-5 first:pl-0 last:pr-0 sm:px-5">
      <p className="whitespace-nowrap text-2xl font-semibold tracking-[-0.03em] text-industrial-700 sm:text-3xl">{value}</p>
      <p className="mt-2 text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-slate-500 sm:text-xs sm:tracking-[0.14em]">{label}</p>
    </div>
  );
}

function EditorialRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="py-5 first:pt-0 last:pb-0 md:first:pt-5 md:last:pb-5">
      <h3 className="text-xl font-semibold leading-7 text-navy-950">{title}</h3>
      <p className="mt-2 text-lg leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function PrimaryLink({ href, children, inverse = false }: { href: string; children: ReactNode; inverse?: boolean }) {
  return (
    <Link
      href={href}
      className={`focus-ring mt-8 inline-flex w-fit items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition ${inverse ? "bg-white text-navy-950 hover:bg-blue-100" : "bg-navy-950 text-white hover:bg-industrial-700"}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring mt-8 inline-flex w-fit items-center justify-center border border-metal-200 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:border-industrial-600 hover:text-industrial-700"
    >
      {children}
    </Link>
  );
}

function SignalProcessingVisual() {
  const measured = [42, 70, 35, 82, 48, 66, 28, 76, 44, 88, 40, 61, 32, 72, 46, 80];
  const vortex = [28, 42, 58, 74, 58, 42, 28, 42, 58, 74, 58, 42, 28, 42, 58, 74];

  return (
    <div className="border-y border-metal-200 bg-white px-5 py-8 sm:px-8">
      <p className={technicalLabelClass}>Measured Signal</p>
      <WaveBars values={measured} muted />
      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-metal-200" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">Digital Signal Analysis</p>
        <span className="h-px flex-1 bg-metal-200" />
      </div>
      <p className={technicalLabelClass}>Vortex Signal</p>
      <WaveBars values={vortex} />
    </div>
  );
}

function WaveBars({ values, muted = false }: { values: readonly number[]; muted?: boolean }) {
  return (
    <div className="mt-5 flex h-28 items-center justify-between gap-1" aria-hidden="true">
      {values.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={`w-full max-w-3 ${muted ? "bg-slate-400" : "bg-industrial-600"}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function VortexEngineeringVisual() {
  return (
    <div className="relative min-h-[430px] overflow-hidden border-y border-metal-200 bg-metal-50 technical-grid">
      <div className="absolute inset-x-[8%] top-[38%] h-28 border-y border-metal-400 bg-white/90" />
      <div className="absolute left-[11%] right-[56%] top-1/2 flex -translate-y-1/2 items-center justify-between text-2xl text-industrial-600" aria-hidden="true">
        <span>→</span><span>→</span><span>→</span>
      </div>
      <div className="absolute left-[45%] top-1/2 h-24 w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-navy-950 bg-white" />
      <div className="absolute left-[53%] top-[42%] h-10 w-24 rounded-[50%] border-t-2 border-industrial-600" />
      <div className="absolute left-[58%] top-[50%] h-10 w-28 rounded-[50%] border-b-2 border-industrial-600" />
      <div className="absolute left-[64%] top-[41%] h-12 w-32 rounded-[50%] border-t-2 border-industrial-600" />
      <div className="absolute inset-x-7 bottom-7 grid grid-cols-2 gap-4 border-t border-metal-200 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        <p>Optimized bluff body</p>
        <p className="text-right">Detectable vortex behavior</p>
      </div>
    </div>
  );
}

function MetricStripItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-metal-200 px-0 py-6 odd:pr-5 even:pl-5 lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:pr-0">
      <p className="whitespace-nowrap text-3xl font-semibold tracking-[-0.035em] text-industrial-700 sm:text-4xl">{value}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
    </div>
  );
}
