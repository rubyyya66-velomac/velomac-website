import type { ProductCategory } from "@/types/content";
import productCatalogData from "./data/product-catalog.json";

export type ProductCatalogGroup = {
  id: string;
  navigationLabel: string;
  title: string;
  description: string;
  dataCategory: ProductCategory;
  productOrder: string[];
};

export const productCatalog = productCatalogData as typeof productCatalogData & {
  groups: ProductCatalogGroup[];
  catalogueDescriptions: Record<string, string>;
};
