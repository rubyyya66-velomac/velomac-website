import productApplicationContextData from "@/content/data/product-application-context.json";

export type ProductApplicationImageStatus = "final" | "closest-match" | "todo";

export type ProductApplicationImage = {
  src: string;
  alt: string;
  summary: string;
  status: ProductApplicationImageStatus;
  todo?: string;
};

export const productApplicationImages = productApplicationContextData as Record<string, ProductApplicationImage>;

export function getProductApplicationImage(slug: string): ProductApplicationImage {
  return productApplicationImages[slug] ?? productApplicationImages["vortex-flowmeter"];
}
