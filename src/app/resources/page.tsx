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
