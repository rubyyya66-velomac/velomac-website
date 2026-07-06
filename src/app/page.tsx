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
import type { Product } from "@/types/content";

export const metadata: Metadata = {
  title: homepage.metadata.title,
  description: homepage.metadata.description
};

export default function HomePage() {
  const primaryProducts = homepage.productsPreview.featuredProductSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
  const secondaryProducts = featuredProducts.filter((product) => !homepage.productsPreview.featuredProductSlugs.includes(product.slug));

  return (
    <>
      <HeroSection />
      <TrustStrip />

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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">Site details that shape meter selection</p>
            <div className="mt-6 grid gap-x-12 border-y border-metal-200 sm:grid-cols-2">
              {homepage.siteConditions.inputs.map((item, index) => (
                <Link
                  key={item}
                  href="/contact"
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

      <Section className="homepage-reveal border-y border-metal-100 bg-metal-50">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow={homepage.productsPreview.eyebrow}
              title={homepage.productsPreview.title}
              description={homepage.productsPreview.description}
            />
            <Link
              href="/products"
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
        notes={[
          {
            title: "In-House Calibration",
            text: "Meters are checked before shipment to support stable field measurement."
          },
          {
            title: "Factory-Close Configuration",
            text: "Product configuration stays close to production and technical support."
          },
          {
            title: "Application-Based Model Selection",
            text: "Selection starts with media, flow range, pressure, temperature and installation details."
          }
        ]}
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
              href="/resources"
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
                <h3 className="mt-3 text-xl font-semibold text-navy-950">{resource.title}</h3>
                <Link
                  href={`/resources/${resource.slug}`}
                  className="focus-ring mt-5 inline-flex items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
                >
                  Read article
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
        detailChips={["Media", "Pipe size", "Flow range", "Pressure / temperature", "Installation photo", "Process vibration"]}
        surfaceClassName="velomac-blue-surface"
      />
    </>
  );
}
