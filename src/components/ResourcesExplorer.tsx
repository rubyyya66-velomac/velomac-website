"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getArticleCategorySlugs,
  getResourceCategoryByLabel,
  getResourceCategoryBySlug,
  resourceCategoryConfig,
  type ResourceCategoryGroup
} from "@/content/resourceCategories";

export type ResourceListItem = {
  slug: string;
  title: string;
  category: string;
  categories?: string[];
  summary: string;
  coverImage: string;
  coverAlt: string;
};

type ResourcesExplorerProps = {
  items: ResourceListItem[];
  initialCategorySlug: string | null;
};

const groupLabels: Record<ResourceCategoryGroup, string> = {
  topic: "Browse by Topic",
  industry: "Browse by Industry & Application"
};

export function ResourcesExplorer({
  items,
  initialCategorySlug
}: ResourcesExplorerProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState(
    getResourceCategoryBySlug(initialCategorySlug)?.slug || null
  );
  const featured =
    items.find((article) => article.slug === "flowmeter-quote-site-details") ||
    items[0];

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    items.forEach((article) => {
      getArticleCategorySlugs(article).forEach((slug) => {
        counts.set(slug, (counts.get(slug) || 0) + 1);
      });
    });

    return counts;
  }, [items]);

  const availableCategories = useMemo(
    () =>
      resourceCategoryConfig
        .filter((category) => (categoryCounts.get(category.slug) || 0) > 0)
        .sort((a, b) =>
          a.group === b.group
            ? a.order - b.order
            : a.group === "topic"
              ? -1
              : 1
        ),
    [categoryCounts]
  );

  useEffect(() => {
    function syncCategoryFromUrl() {
      const url = new URL(window.location.href);
      const requestedSlug = url.searchParams.get("category");
      const resolvedCategory = getResourceCategoryBySlug(requestedSlug);

      setActiveCategorySlug(resolvedCategory?.slug || null);

      if (requestedSlug && !resolvedCategory) {
        url.searchParams.delete("category");
        window.history.replaceState(
          {},
          "",
          `${url.pathname}${url.search}${url.hash}`
        );
      }
    }

    window.addEventListener("popstate", syncCategoryFromUrl);
    syncCategoryFromUrl();

    return () => window.removeEventListener("popstate", syncCategoryFromUrl);
  }, []);

  const activeCategory = getResourceCategoryBySlug(activeCategorySlug);
  const filteredItems = activeCategory
    ? items.filter((article) =>
        getArticleCategorySlugs(article).includes(activeCategory.slug)
      )
    : items;
  const showFeatured =
    Boolean(featured) &&
    (!activeCategory ||
      getArticleCategorySlugs(featured).includes(activeCategory.slug));
  const articleCards = filteredItems.filter(
    (article) => !showFeatured || article.slug !== featured.slug
  );

  function selectCategory(slug: string | null) {
    if (slug === activeCategorySlug) {
      return;
    }

    const url = new URL(window.location.href);

    if (slug) {
      url.searchParams.set("category", slug);
    } else {
      url.searchParams.delete("category");
    }

    window.history.pushState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
    setActiveCategorySlug(slug);
  }

  return (
    <>
      {showFeatured ? <FeaturedArticle article={featured} /> : null}

      <nav
        aria-label="Filter flow measurement resources"
        className={showFeatured ? "mt-10" : ""}
      >
        <button
          type="button"
          aria-pressed={!activeCategory}
          onClick={() => selectCategory(null)}
          className={categoryButtonClass(!activeCategory)}
        >
          All Resources
        </button>

        <div className="mt-6 grid gap-7 lg:grid-cols-2 lg:gap-12">
          {(["topic", "industry"] as ResourceCategoryGroup[]).map((group) => {
            const groupCategories = availableCategories.filter(
              (category) => category.group === group
            );

            if (groupCategories.length === 0) {
              return null;
            }

            return (
              <div key={group}>
                <h2 className="text-sm font-semibold text-navy-950">
                  {groupLabels[group]}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {groupCategories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      aria-pressed={activeCategorySlug === category.slug}
                      onClick={() => selectCategory(category.slug)}
                      className={categoryButtonClass(
                        activeCategorySlug === category.slug
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {activeCategory ? (
        <div className="mt-10" aria-live="polite">
          <h2 className="text-2xl font-semibold text-navy-950 sm:text-3xl">
            {activeCategory.label} Resources
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "article" : "articles"}
          </p>
        </div>
      ) : null}

      {articleCards.length > 0 ? (
        <div
          className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${
            activeCategory ? "mt-6" : "mt-12"
          }`}
        >
          {articleCards.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="mt-10 border-t border-metal-200 pt-8">
          <p className="text-lg font-semibold text-navy-950">
            No resources are available in this category yet.
          </p>
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className="focus-ring mt-4 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
          >
            View All Resources
          </button>
        </div>
      ) : null}
    </>
  );
}

function FeaturedArticle({ article }: { article: ResourceListItem }) {
  return (
    <article className="grid overflow-hidden rounded-[6px] border border-metal-200 bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <Link
        href={`/resources/${article.slug}`}
        className="focus-ring relative min-h-[280px] bg-navy-950 sm:min-h-[360px]"
      >
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          sizes="(min-width: 1024px) 620px, 100vw"
          className="object-cover"
          priority
        />
      </Link>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">
          Featured article
        </p>
        <p className="mt-5 text-sm font-semibold text-slate-500">
          {getDisplayCategory(article.category)}
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
          {article.title}
        </h2>
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
          {article.summary}
        </p>
        <Link
          href={`/resources/${article.slug}`}
          className="focus-ring mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
        >
          Read article
          <span aria-hidden="true">{">"}</span>
        </Link>
      </div>
    </article>
  );
}

function ArticleCard({ article }: { article: ResourceListItem }) {
  return (
    <article className="flex min-h-full flex-col overflow-hidden rounded-[6px] border border-metal-200 bg-white transition hover:border-industrial-500">
      <Link
        href={`/resources/${article.slug}`}
        className="focus-ring relative block aspect-[16/9] bg-navy-950"
      >
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          sizes="(min-width: 1024px) 370px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
          {getDisplayCategory(article.category)}
        </p>
        <h2 className="mt-3 text-[1.35rem] font-semibold leading-snug text-navy-950">
          {article.title}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-600">
          {article.summary}
        </p>
        <Link
          href={`/resources/${article.slug}`}
          className="focus-ring mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
        >
          Read article
          <span aria-hidden="true">{">"}</span>
        </Link>
      </div>
    </article>
  );
}

function getDisplayCategory(category: string) {
  return getResourceCategoryByLabel(category)?.label || category.trim();
}

function categoryButtonClass(isActive: boolean) {
  return [
    "min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-industrial-600 focus-visible:ring-offset-2",
    isActive
      ? "border-industrial-700 bg-industrial-700 text-white"
      : "border-metal-200 bg-metal-50 text-navy-950 hover:border-industrial-500 hover:bg-blue-50"
  ].join(" ");
}
