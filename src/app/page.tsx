import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ApplicationCard } from "@/components/ApplicationCard";
import { Container, Section, SectionHeader } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CTASection } from "@/components/CTASection";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { TrustStrip } from "@/components/TrustStrip";
import { applications } from "@/content/applications";
import { featuredProducts, getProductBySlug } from "@/content/products";
import { homepage } from "@/content/homepage";
import { resources } from "@/content/resources";
import { site } from "@/content/site";
import { buildPageMetadata } from "@/lib/seo";
import type { Product } from "@/types/content";

export const metadata: Metadata = buildPageMetadata({
  title: homepage.metadata.title,
  description: homepage.metadata.description,
  path: "/",
  image: homepage.hero.image.src,
  imageAlt: homepage.hero.image.alt
});

export default function HomePage() {
  const primaryProducts = homepage.productsPreview.featuredProductSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
  const secondaryProducts = featuredProducts.filter((product) => !homepage.productsPreview.featuredProductSlugs.includes(product.slug));

  return (
    <>
      <HeroSection />
      <TrustStrip />

      <Section className="homepage-reveal border-y border-metal-200 bg-metal-50">
        <Container>
          <article className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                {homepage.featuredVortex.eyebrow}
              </p>
              <h2 className="mt-4 max-w-3xl text-[1.95rem] font-semibold leading-[1.1] tracking-[-0.025em] text-navy-950 sm:text-[2.25rem] lg:text-[2.35rem] xl:text-[2.65rem]">
                {homepage.featuredVortex.title}
              </h2>

              <div className="mt-8 grid grid-cols-3 divide-x divide-metal-300 border-y border-metal-300">
                {homepage.featuredVortex.facts.map((fact) => (
                  <HomepageFeaturedFact key={fact.label} value={fact.value} label={fact.label} />
                ))}
              </div>

              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {homepage.featuredVortex.description}
              </p>

              <Link
                href={homepage.featuredVortex.ctaHref}
                className="focus-ring mt-8 inline-flex items-center gap-2 bg-navy-950 px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-industrial-700"
              >
                {homepage.featuredVortex.ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <Link
              href={homepage.featuredVortex.ctaHref}
              aria-label={`${homepage.featuredVortex.ctaLabel}: ${homepage.featuredVortex.title}`}
              className="focus-ring group relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px]"
            >
              <Image
                src={homepage.featuredVortex.image.src}
                alt={homepage.featuredVortex.image.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-contain transition duration-300 group-hover:scale-[1.025] lg:scale-[1.06] lg:group-hover:scale-[1.085]"
              />
            </Link>
          </article>
        </Container>
      </Section>

      <Section className="homepage-reveal bg-white">
        <Container className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <SectionHeader
              title={homepage.siteConditions.title}
              description={homepage.siteConditions.description}
            />
            <div className="mt-8 overflow-hidden rounded-[10px] border border-metal-200 bg-navy-950 shadow-soft">
              <div className="relative aspect-[16/9]">
                <Image
                  src={homepage.siteConditions.image.src}
                  alt={homepage.siteConditions.image.alt}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="lg:self-stretch lg:content-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">{homepage.siteConditions.detailLabel}</p>
            <div className="mt-6 grid gap-x-12 border-y border-metal-200 sm:grid-cols-2">
              {homepage.siteConditions.inputs.map((item, index) => (
                <Link
                  key={item}
                  href={homepage.siteConditions.detailHref}
                  className={`focus-ring group flex items-center justify-between gap-7 border-t border-metal-200 py-7 text-xl font-semibold leading-7 text-navy-950 transition hover:text-industrial-700 sm:text-[1.35rem] ${
                    index === 0 ? "border-t-0" : ""
                  } ${index === 1 ? "sm:border-t-0" : ""}`}
                >
                  <span>{item}</span>
                  <span
                    aria-hidden="true"
                    className="h-px w-14 shrink-0 bg-industrial-600 transition group-hover:w-20"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section
        id="technology"
        className="homepage-reveal scroll-mt-28 border-y border-navy-800 bg-navy-950 !py-10 text-white sm:!py-12 lg:!py-12"
      >
        <Container className="grid gap-y-7 lg:!max-w-[1280px] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-8 lg:gap-y-6">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              {homepage.technology.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]">
              {homepage.technology.title}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
              {homepage.technology.description}
            </p>
          </div>

          <figure className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="relative aspect-[1522/1033] w-full overflow-hidden">
              <Image
                src={homepage.technology.image.src}
                alt={homepage.technology.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-contain"
              />
            </div>
          </figure>

          <div className="lg:col-start-1 lg:row-start-2">
            <ol className="border-t border-white/15">
              {homepage.technology.capabilities.map((capability) => (
                <li
                  key={capability.number}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-white/15 py-3.5 sm:grid-cols-[3rem_minmax(0,1fr)]"
                >
                  <p className="pt-1 text-xs font-semibold tracking-[0.16em] text-blue-200">
                    {capability.number}
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 text-white">
                      {capability.title}
                    </h3>
                    <p className="mt-0.5 text-base leading-6 text-blue-100">
                      {capability.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href={homepage.technology.ctaHref}
              className="focus-ring mt-5 inline-flex w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-blue-100 hover:text-industrial-700"
            >
              {homepage.technology.ctaLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="homepage-reveal border-y border-metal-100 bg-metal-50">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow={homepage.productsPreview.eyebrow}
              title={homepage.productsPreview.title}
              description={homepage.productsPreview.description}
            />
            <Link
              href={homepage.productsPreview.buttonHref}
              className="focus-ring inline-flex w-fit items-center gap-2 border border-navy-950 bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-industrial-600 hover:bg-industrial-700"
            >
              {homepage.productsPreview.buttonLabel}
              <span aria-hidden="true">{">"}</span>
            </Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {primaryProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={{
                  ...product,
                  shortDescription: homepage.productsPreview.cardSummaries[product.slug] || product.shortDescription
                }}
                variant="featured"
                imageScale="large"
              />
            ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {secondaryProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={{
                  ...product,
                  shortDescription: homepage.productsPreview.cardSummaries[product.slug] || product.shortDescription
                }}
                variant="compact"
                imageScale="large"
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="homepage-reveal bg-white">
        <Container>
          <SectionHeader
            eyebrow={homepage.applicationsPreview.eyebrow}
            title={homepage.applicationsPreview.title}
            description={homepage.applicationsPreview.description}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application, index) => (
              <ApplicationCard key={application.slug} application={application} variant={index < 3 ? "featured" : "default"} />
            ))}
          </div>
        </Container>
      </Section>

      <StatsSection
        eyebrow={homepage.whyVelomac.eyebrow}
        title={homepage.whyVelomac.title}
        description={site.timelineLine}
        stats={homepage.whyVelomac.stats}
        notes={homepage.whyVelomac.notes}
      />

      <Section className="homepage-reveal bg-white">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow={homepage.resourcesPreview.eyebrow}
              title={homepage.resourcesPreview.title}
              description={homepage.resourcesPreview.description}
            />
            <Link
              href={homepage.resourcesPreview.buttonHref}
              className="focus-ring inline-flex w-fit items-center gap-2 border border-navy-950 bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-industrial-600 hover:bg-industrial-700"
            >
              {homepage.resourcesPreview.buttonLabel}
              <span aria-hidden="true">{">"}</span>
            </Link>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-6 border-t border-metal-200 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {resources.slice(0, 3).map((resource) => (
              <article key={resource.slug} className="py-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">{resource.category}</p>
                <h3 className="mt-3 text-xl font-semibold text-navy-950">
                  <Link className="focus-ring transition hover:text-industrial-700" href={`/resources/${resource.slug}`}>
                    {resource.title}
                  </Link>
                </h3>
                <Link
                  href={`/resources/${resource.slug}`}
                  className="focus-ring mt-5 inline-flex items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
                >
                  {site.buttons.readArticle}
                  <span aria-hidden="true">{">"}</span>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title={homepage.bottomCta.title}
        text={homepage.bottomCta.text}
        buttonLabel={homepage.bottomCta.buttonLabel}
        href={homepage.bottomCta.buttonHref}
        detailChips={homepage.bottomCta.detailChips}
        surfaceClassName="velomac-blue-surface"
      />
    </>
  );
}

function HomepageFeaturedFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 px-3 py-5 first:pl-0 last:pr-0 sm:px-5 sm:py-6">
      <p className="whitespace-nowrap text-[1.75rem] font-semibold tracking-[-0.03em] text-industrial-700 sm:text-[2rem] lg:text-[2.15rem]">
        {value}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-600 sm:text-[12px] sm:tracking-[0.1em]">
        {label}
      </p>
    </div>
  );
}
