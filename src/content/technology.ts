import technologyData from "./data/technology.json";

export type TechnologyCategoryId =
  | "product-sensor-innovation"
  | "flow-calibration-systems"
  | "testing-calibration"
  | "application-engineering";

export type TechnologyCategory = {
  id: TechnologyCategoryId;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  introduction: string;
  image: TechnologyImage;
  seo: {
    title: string;
    description: string;
  };
};

export type TechnologyImage = {
  src: string;
  alt: string;
  fit: "cover" | "contain";
};

export type TechnologyTable = {
  columns: string[];
  rows: string[][];
};

export type TechnologySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  image?: TechnologyImage;
  table?: TechnologyTable;
};

export type TechnologyArticle = {
  slug: string;
  categoryId: TechnologyCategoryId;
  title: string;
  summary: string;
  introduction: string;
  image: TechnologyImage;
  highlights: {
    label: string;
    value: string;
  }[];
  sections: TechnologySection[];
  relatedSlugs: string[];
  seo: {
    title: string;
    description: string;
  };
};

export const technologyCategories = technologyData.categories as TechnologyCategory[];
export const technologyArticles = technologyData.articles as TechnologyArticle[];

export const technologyContent = {
  metadata: technologyData.metadata,
  hero: technologyData.hero,
  navigation: technologyData.navigation,
  overviewSections: technologyData.overviewSections,
  flowCalibrationOverview: technologyData.flowCalibrationOverview,
  categories: technologyCategories,
  articles: technologyArticles
};

export function getTechnologyCategory(categoryId: TechnologyCategoryId) {
  return technologyCategories.find((category) => category.id === categoryId);
}

export function getTechnologyCategoryBySlug(slug: string) {
  return technologyCategories.find((category) => category.slug === slug);
}

export function getTechnologyArticlesByCategory(categoryId: TechnologyCategoryId) {
  return technologyArticles.filter((article) => article.categoryId === categoryId);
}

export function getTechnologyArticle(slug: string) {
  return technologyArticles.find((article) => article.slug === slug);
}
