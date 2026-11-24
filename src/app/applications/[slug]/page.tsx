import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { ChemicalProcessGuide } from "@/components/ChemicalProcessGuide";
import { EnergyUtilityGuide, utilityPage } from "@/components/EnergyUtilityGuide";
import { HighVibrationGuide } from "@/components/HighVibrationGuide";
import { JsonLd } from "@/components/JsonLd";
import { Container, Section } from "@/components/Layout";
import { MobileDisclosure } from "@/components/MobileDisclosure";
import { applications, resolveApplicationSlug } from "@/content/applications";
import { products } from "@/content/products";
import { articles } from "@/content/resources";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbStructuredData } from "@/lib/structuredData";

const preferredResourceSlugsByApplication: Record<string, string[]> = {
  "steam-measurement": ["steam-flowmeter-sizing-production-expansion"],
  "gas-flow-measurement": ["lng-feed-gas-composition-flow-measurement-review"],
  "conductive-liquid-measurement": [
    "reclaimed-water-flowmeter-selection-conductivity",
    "ro-train-flow-measurement"
  ]
};

const additionalResourceSlugsByApplication: Record<string, string[]> = {
  "steam-measurement": ["steam-flow-measurement-turbine-power-check"],
  "gas-flow-measurement": [
    "hydrogen-flowmeter-selection-electrolyzer-load",
    "industrial-off-gas-fermentation-flow-measurement"
  ],
  "conductive-liquid-measurement": [
    "produced-water-flow-measurement-after-separation",
    "mine-water-flow-selenium-load",
    "reclaimed-water-flowmeter-sizing-dn500"
  ],
  "chemical-process-lines": ["dle-brine-flow-measurement"]
};

const chemicalGuideSlug = "chemical-process-lines";
const chemicalResourcePriority = ["multi-product-chemical-flowmeter-sizing", "dle-brine-flow-measurement"];

export function generateStaticParams() {
  return applications.map((application) => ({ slug: application.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const application = applications.find((item) => item.slug === slug);

  if (!application) {
    return {};
  }

  const image = slug === utilityPage.slug ? utilityPage.hero : application.image;

  return buildPageMetadata({
    title: application.detailPage.metadata.title,
    description: application.detailPage.metadata.description,
    path: `/applications/${application.slug}`,
    image: image.src,
    imageAlt: image.alt
  });
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const application = applications.find((item) => item.slug === slug);

  if (!application) {
    notFound();
  }

  const isChemicalGuide = application.slug === chemicalGuideSlug;
  const isVibrationGuide = application.slug === "high-vibration-pipelines";
  const isUtilityGuide = application.slug === utilityPage.slug;
  const hasCompactHero = isChemicalGuide || isVibrationGuide || isUtilityGuide;
  const relatedProducts = products.filter((product) =>
    application.detailPage.relatedProductSlugs.includes(product.slug)
  );
  const relevantResources = articles.filter((article) =>
    article.relatedApplicationSlugs.some(
      (slug) => resolveApplicationSlug(slug) === application.slug
    )
  );
  const preferredResourceSlugs = preferredResourceSlugsByApplication[application.slug] || [];
  const existingRelatedResources = [
    ...preferredResourceSlugs
      .map((slug) => relevantResources.find((article) => article.slug === slug))
      .filter((article): article is (typeof articles)[number] => Boolean(article)),
    ...relevantResources.filter((article) => !preferredResourceSlugs.includes(article.slug))
  ].slice(0, 3);
  const defaultRelatedResources = [
    ...existingRelatedResources,
    ...(additionalResourceSlugsByApplication[application.slug] || [])
      .filter((slug) => !existingRelatedResources.some((article) => article.slug === slug))
      .map((slug) => relevantResources.find((article) => article.slug === slug))
      .filter((article): article is (typeof articles)[number] => Boolean(article))
  ];
  const relatedResources = isChemicalGuide
    ? [
        ...chemicalResourcePriority.flatMap((resourceSlug) => {
          const article = relevantResources.find((item) => item.slug === resourceSlug);
          return article ? [article] : [];
        }),
        ...defaultRelatedResources.filter((article) => !chemicalResourcePriority.includes(article.slug))
      ]
    : defaultRelatedResources;
  const otherApplications = applications.filter((item) => item.slug !== application.slug).slice(0, 5);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Applications", path: "/applications" },
    { name: application.title, path: `/applications/${application.slug}` }
  ];
  const reviewMediumType = getApplicationReviewMediumType(application.slug);
  const reviewCta = (
    <CTASection
      title={isChemicalGuide ? "Discuss Your Chemical Process Application" : isVibrationGuide ? "Discuss Your High-Vibration Pipeline" : isUtilityGuide ? "Discuss Your Utility Flow Measurement Application" : application.detailPage.ctaTitle}
      text={isChemicalGuide
        ? "Share the chemical, concentration, flow range and operating conditions. We’ll identify what else is needed for meter selection."
        : isVibrationGuide
        ? "Share your medium, pipe size, operating range and vibration conditions for a technical application review."
        : isUtilityGuide
        ? "Share your utility type, measurement point, operating range and installation details. Velomac can review the application conditions and recommend a suitable meter direction."
        : "Share the media, pipe size, flow range, pressure, temperature and installation details for an application review."}
      href="/application-review"
      buttonLabel={isChemicalGuide ? "Review Your Chemical Application" : "Review This Application"}
      reviewCtaContext={{
        sourceType: "application_page",
        sourceSection: "bottom-application-review",
        sourcePath: `/applications/${application.slug}`,
        applicationType: application.slug,
        mediumType: reviewMediumType
      }}
      surfaceClassName="velomac-blue-surface"
    />
  );

  return (
    <>
      <JsonLd data={breadcrumbStructuredData(breadcrumbs)} />

      <section className="border-b border-metal-200 bg-white">
        <Container className={hasCompactHero ? "py-7 sm:py-10 lg:py-12" : "py-10 sm:py-12 lg:py-16"}>
          <Breadcrumb items={breadcrumbs} />
          <div className={hasCompactHero
            ? "mt-5 grid gap-6 lg:mt-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10"
            : "mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14"}>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                {application.detailPage.eyebrow}
              </p>
              <h1 className={isUtilityGuide ? "mt-3 text-[1.875rem] font-semibold leading-[1.12] text-navy-950 sm:text-[2.5rem] sm:leading-[1.08]" : "mt-4 text-[1.875rem] font-semibold leading-[1.12] text-navy-950 sm:text-5xl sm:leading-[1.08]"}>
                {application.detailPage.h1}
              </h1>
              {isUtilityGuide ? (
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700 sm:mt-4 sm:text-base sm:leading-7">
                  <p>Measure steam, compressed air, cooling water and process utilities at defined points across the plant.</p>
                  <p>Start with the operating range, measurement location and purpose before selecting the flowmeter.</p>
                </div>
              ) : (
              <p className="mt-3 text-lg leading-8 text-slate-600 sm:mt-5">
                {isChemicalGuide
                  ? "Flowmeter selection for chemical service starts with the medium, concentration, operating range and wetted-material compatibility."
                  : isVibrationGuide
                  ? "Separate actual process flow from mechanical interference before choosing a meter for a vibration-prone line."
                  : application.detailPage.introduction}
              </p>
              )}
              <Link
                href={`/contact?application=${application.slug}`}
                className="focus-ring mt-7 inline-flex items-center gap-2 bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700"
              >
                Request a Quote <span aria-hidden="true">→</span>
              </Link>
            </div>
            {isUtilityGuide ? (
              <figure>
                <Image src={utilityPage.hero.src} alt={utilityPage.hero.alt} width={845} height={681} priority sizes="(min-width: 1200px) 592px, (min-width: 1024px) 50vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)" className="h-auto w-full object-contain" />
                <figcaption className="mt-2 text-xs leading-5 text-slate-600">{utilityPage.hero.caption}</figcaption>
              </figure>
            ) : (
            <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
              <Image
                src={application.image.src}
                alt={application.image.alt}
                fill
                priority
                sizes={isChemicalGuide || isVibrationGuide ? "(min-width: 1200px) 592px, (min-width: 1024px) 50vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)" : "(max-width: 1024px) 100vw, 650px"}
                className="object-cover"
              />
            </div>
            )}
          </div>
        </Container>
      </section>

      {isChemicalGuide ? (
        <>
          <ChemicalProcessGuide products={relatedProducts} />
          {reviewCta}
        </>
      ) : isVibrationGuide ? (
        <HighVibrationGuide products={relatedProducts} />
      ) : isUtilityGuide ? (
        <EnergyUtilityGuide products={relatedProducts} />
      ) : (
        <>
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <SectionHeading eyebrow="What Needs to Be Measured" title={application.detailPage.measurementTitle} />
          <div>
            <h3 className="text-xl font-semibold leading-8 text-navy-950">{application.detailPage.question}</h3>
            <p className="mt-3 text-lg font-medium leading-8 text-navy-950">{application.detailPage.directAnswer}</p>
            <p className="mt-5 text-base leading-7 text-slate-600">{application.detailPage.measurementText}</p>
            <p className="mt-5 border-l-2 border-industrial-600 pl-5 text-base font-semibold leading-7 text-navy-950">
              {application.focus}
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-metal-200 bg-metal-50">
        <Container>
          <SectionHeading eyebrow="Site Conditions" title="Conditions that affect meter selection" />
          <div className="mt-9 grid gap-px bg-metal-300 md:grid-cols-2">
            <ConditionCard
              title="Operating condition"
              text={
                application.slug === "conductive-liquid-measurement" ? (
                  <>
                    {application.siteCondition}{" "}
                    For pump-fed wastewater and other conductive-liquid lines, check whether start/stop cycles can drain the measuring section or allow air to collect; partial filling can distort electromagnetic flow readings, so confirm the{" "}
                    <Link
                      href="/products/electromagnetic-flowmeter#full-pipe"
                      className="focus-ring font-semibold text-industrial-700 underline underline-offset-4 hover:text-navy-950"
                    >
                      full-pipe installation requirements
                    </Link>{" "}
                    before fixing the meter location.
                  </>
                ) : application.siteCondition
              }
            />
            <ConditionCard title="Selection risk" text={application.challenge} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Recommended Meter Direction" title="Review suitable meter families" />
            <ul className="mt-8 divide-y divide-metal-200 border-y border-metal-200">
              {application.suitableMeters.map((meter) => {
                const product = relatedProducts.find((item) => item.name === meter);
                return (
                  <li key={meter} className="py-4 text-base font-semibold text-navy-950">
                    {product ? (
                      <Link className="focus-ring transition hover:text-industrial-700" href={`/products/${product.slug}`}>
                        {meter} <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      meter
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Final selection depends on the actual media, operating range and installation condition.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Site Details to Prepare" title="Send the working-line information" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {application.detailsToSend.map((detail) => (
                <li key={detail} className="border-l-2 border-industrial-600 bg-metal-50 px-4 py-3 text-sm font-semibold text-navy-950">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {relatedProducts.length ? (
        <Section className="border-y border-metal-200 bg-metal-50">
          <Container>
            <SectionHeading eyebrow="Related Velomac Products" title="Product directions for this application" />
            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <article key={product.slug} className="border border-metal-200 bg-white p-6">
                  <h3 className="text-xl font-semibold text-navy-950">
                    <Link className="focus-ring transition hover:text-industrial-700" href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                  <Link className="focus-ring mt-5 inline-flex text-sm font-semibold text-industrial-700" href={`/products/${product.slug}`}>
                    View product&nbsp;→
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
        </>
      )}

      {relatedResources.length ? (
        <Section className={isUtilityGuide ? "!py-9 sm:!py-12" : undefined}>
          <Container>
            <SectionHeading eyebrow="Related Resources" title={isChemicalGuide ? "Further Reading for Chemical Flow Measurement" : isUtilityGuide ? "Practical Notes for the Application Review" : "Practical notes for the application review"} compact={isUtilityGuide} />
            <MobileDisclosure label="View related resources" className="pt-6 sm:pt-0">
              <div className="divide-y divide-metal-200 border-y border-metal-200 sm:mt-8">
                {relatedResources.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/resources/${article.slug}`}
                    className={isChemicalGuide || isUtilityGuide
                      ? "focus-ring grid gap-1.5 py-3.5 transition hover:text-industrial-700 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-center md:gap-4"
                      : "focus-ring grid gap-2 py-5 transition hover:text-industrial-700 md:grid-cols-[0.28fr_1fr_auto] md:items-center"}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">{article.category}</span>
                    <span className={isChemicalGuide || isUtilityGuide ? "text-base font-semibold leading-snug text-navy-950" : "text-lg font-semibold text-navy-950"}>{article.title}</span>
                    {isChemicalGuide || isUtilityGuide ? (
                      <span aria-hidden="true" className="hidden font-semibold text-industrial-700 md:inline">→</span>
                    ) : (
                      <span className="text-sm font-semibold text-industrial-700">Read {article.category} →</span>
                    )}
                  </Link>
                ))}
              </div>
            </MobileDisclosure>
          </Container>
        </Section>
      ) : null}

      <section className="border-t border-metal-200 bg-white py-10 sm:py-12">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Other Applications</p>
          <nav aria-label="Related applications" className="mt-4 flex flex-wrap gap-3">
            {otherApplications.map((item) => (
              <Link
                key={item.slug}
                href={`/applications/${item.slug}`}
              className={isChemicalGuide || isUtilityGuide
                ? "focus-ring inline-flex min-h-11 items-center rounded-md border border-metal-200 bg-metal-50 px-3 text-sm font-semibold text-slate-700 transition hover:border-industrial-600 hover:text-industrial-700"
                : "focus-ring border border-metal-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-industrial-600 hover:text-industrial-700"}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      {isChemicalGuide ? null : reviewCta}
    </>
  );
}

function getApplicationReviewMediumType(slug: string): "liquid" | "gas" | "steam" | "not-sure" {
  if (slug === "steam-measurement") return "steam";
  if (slug === "gas-flow-measurement") return "gas";
  if (slug === "conductive-liquid-measurement" || slug === "chemical-process-lines") return "liquid";
  return "not-sure";
}

function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={item.path} className="contents">
          {index < items.length - 1 ? (
            <Link href={item.path} className="focus-ring transition hover:text-industrial-700">{item.name}</Link>
          ) : (
            <span className="text-slate-700">{item.name}</span>
          )}
          {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

function SectionHeading({ eyebrow, title, compact = false }: { eyebrow: string; title: string; compact?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">{eyebrow}</p>
      <h2 className={compact ? "mt-2 text-[1.65rem] font-semibold leading-tight text-navy-950 sm:text-3xl lg:text-[2.125rem]" : "mt-3 text-2xl font-semibold leading-tight text-navy-950 sm:text-4xl"}>{title}</h2>
    </div>
  );
}

function ConditionCard({ title, text }: { title: string; text: ReactNode }) {
  return (
    <article className="bg-white p-6 sm:p-7">
      <h3 className="text-xl font-semibold text-navy-950">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-600">{text}</p>
    </article>
  );
}
