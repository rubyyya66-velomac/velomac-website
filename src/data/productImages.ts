import { products } from "@/content/products";

export type ProductImageStatus = "final";

export type ProductImage = {
  src: string;
  alt: string;
  status: ProductImageStatus;
};

export const productImages = Object.fromEntries(
  products.map((product) => [
    product.slug,
    {
      src: product.image,
      alt: product.imageAlt,
      status: "final" as const
    }
  ])
) as Record<string, ProductImage>;

export const productImageReplacementList = products.map((product) => ({
  slug: product.slug,
  path: product.image,
  status: "final" as const
}));

export const productsStillNeedingFinalPhotography: string[] = [];

export function getProductImage(slug: string): ProductImage {
  return (
    productImages[slug] ?? {
      src: "/images/products/vortex-flowmeter.jpg",
      alt: "Velomac flowmeter product photo",
      status: "final"
    }
  );
}
