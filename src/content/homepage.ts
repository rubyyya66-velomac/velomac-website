import homepageData from "./data/homepage.json";

export const homepage = homepageData as typeof homepageData & {
  productsPreview: typeof homepageData.productsPreview & {
    featuredProductSlugs: string[];
    cardSummaries: Record<string, string>;
  };
};
