import type { Product } from "@/types/content";
import productsData from "./data/products.json";

export const products = productsData as Product[];

export const featuredProducts = products;

const productSlugAliases: Record<string, string> = {
  "balanced-dp-flowmeter": "balanced-differential-pressure-flowmeter"
};

export function getProductBySlug(slug: string) {
  const canonicalSlug = productSlugAliases[slug] || slug;
  return products.find((product) => product.slug === canonicalSlug);
}

export function getProductsByRelatedSlugs(slugs: string[]) {
  const canonicalSlugs = new Set(slugs.map((slug) => productSlugAliases[slug] || slug));
  return products.filter((product) => canonicalSlugs.has(product.slug));
}

export function getProductsByCategory(category: Product["category"]) {
  return products.filter((product) => product.category === category);
}
