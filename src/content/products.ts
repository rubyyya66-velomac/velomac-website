import type { Product } from "@/types/content";
import productsData from "./data/products.json";

export const products = productsData as Product[];

export const featuredProducts = products;

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: Product["category"]) {
  return products.filter((product) => product.category === category);
}
