import type { Metadata } from "next";
import { BuyerTools } from "@/components/BuyerTools";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import {
  ResourcesExplorer,
  type ResourceListItem
} from "@/components/ResourcesExplorer";
import { Container, Section } from "@/components/Layout";
import { getResourceCategoryBySlug } from "@/content/resourceCategories";
import { articles } from "@/content/resources";
import { resourcesPage } from "@/content/resourcesPage";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { breadcrumbStructuredData } from "@/lib/structuredData";

const resourcesUrl = absoluteUrl("/resources");
const shareTitle = "Comparing Flowmeter Quotations? Look Beyond the Unit Price.";
const shareDescription = resourcesPage.metadata.openGraphDescription;
const shareImage = {
  url: absoluteUrl("/images/brand/quotation-comparison-share.png"),
  alt: "Velomac Flow Meter buyer worksheet: compare flowmeter quotations beyond the unit price.",
  width: 1200,
  height: 630
};
const baseMetadata = buildPageMetadata({
  title: resourcesPage.metadata.title,
  description: resourcesPage.metadata.description,
  path: "/resources",
  image: "/images/brand/quotation-comparison-share.png",
  imageAlt: shareImage.alt
});
export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: { ...baseMetadata.openGraph, title: shareTitle, description: shareDescription, images: [shareImage] },
  twitter: { card: "summary_large_image", title: shareTitle, description: shareDescription, images: [shareImage] }
};

type ResourcesPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedCategory = Array.isArray(resolvedSearchParams?.category)
    ? resolvedSearchParams?.category[0]
    : resolvedSearchParams?.category;
  const initialCategorySlug =
    getResourceCategoryBySlug(requestedCategory)?.slug || null;
  const resourceItems: ResourceListItem[] = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    categories: article.categories,
    summary: article.summary,
    coverImage: article.coverImage,
    coverAlt: article.coverAlt
  }));

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${resourcesUrl}#webpage`,
        url: resourcesUrl,
        name: resourcesPage.metadata.title,
        description: resourcesPage.metadata.description,
        inLanguage: "en",
        isPartOf: { "@id": absoluteUrl("/#website") },
        publisher: { "@id": absoluteUrl("/#organization") },
        breadcrumb: { "@id": `${resourcesUrl}#breadcrumb` }
      }} />
      <JsonLd data={{
        ...breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }]),
        "@id": `${resourcesUrl}#breadcrumb`
      }} />
      <section className="velomac-blue-surface text-white">
        <Container className="py-10 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">{resourcesPage.hero.eyebrow}</p>
            <h1 className="mt-4 text-[1.875rem] font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
              {resourcesPage.hero.title}
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-blue-50 sm:mt-5 sm:text-xl">
              {resourcesPage.hero.description}
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <BuyerTools />
          <ResourcesExplorer
            items={resourceItems}
            initialCategorySlug={initialCategorySlug}
          />
        </Container>
      </Section>

      <CTASection
        title={resourcesPage.cta.title}
        text={resourcesPage.cta.text}
        buttonLabel={resourcesPage.cta.buttonLabel}
        href={resourcesPage.cta.buttonHref}
        surfaceClassName="velomac-blue-surface"
      />
    </>
  );
}
