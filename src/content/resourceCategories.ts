export type ResourceCategoryGroup = "topic" | "industry";

export type ResourceCategory = {
  label: string;
  slug: string;
  group: ResourceCategoryGroup;
  order: number;
  aliases?: string[];
};

export const resourceCategoryConfig = resourceCategoriesData as ResourceCategory[];

function normalizeCategoryLabel(value: string) {
  return value.trim().toLowerCase();
}

export function getResourceCategoryBySlug(slug: string | null | undefined) {
  if (!slug) {
    return undefined;
  }

  return resourceCategoryConfig.find((category) => category.slug === slug);
}

export function getResourceCategoryByLabel(label: string) {
  const normalizedLabel = normalizeCategoryLabel(label);

  return resourceCategoryConfig.find((category) =>
    [category.label, ...(category.aliases || [])].some(
      (candidate) => normalizeCategoryLabel(candidate) === normalizedLabel
    )
  );
}

export function getArticleCategorySlugs(article: {
  category: string;
  categories?: string[];
}) {
  const primaryCategory = getResourceCategoryByLabel(article.category);
  const categorySlugs = [
    ...(article.categories || []),
    ...(primaryCategory ? [primaryCategory.slug] : [])
  ];

  return Array.from(
    new Set(
      categorySlugs.filter((slug) => Boolean(getResourceCategoryBySlug(slug)))
    )
  );
}
import resourceCategoriesData from "./data/resource-categories.json";
