import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import {
  ResourcesExplorer,
  type ResourceListItem
} from "@/components/ResourcesExplorer";
import { Container, Section } from "@/components/Layout";
import { getResourceCategoryBySlug } from "@/content/resourceCategories";
import { articles } from "@/content/resources";
import { resourcesPage } from "@/content/resourcesPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: resourcesPage.metadata.title,
  description: resourcesPage.metadata.description,
  path: "/resources",
  image: articles[0]?.coverImage || "/images/applications/quote-support.png",
  imageAlt: articles[0]?.coverAlt || "Velomac flow measurement resources"
});

type ResourcesPageProps = {
  searchParams?: {
    category?: string | string[];
  };
};

export default function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const requestedCategory = Array.isArray(searchParams?.category)
    ? searchParams?.category[0]
    : searchParams?.category;
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
      <section className="velomac-blue-surface text-white">
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">{resourcesPage.hero.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
              {resourcesPage.hero.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50 sm:text-xl">
              {resourcesPage.hero.description}
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
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
