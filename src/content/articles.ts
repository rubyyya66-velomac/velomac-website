import articleData from "./data/articles.json";

export type ArticleSection = {
  heading: string;
  body: string[];
};

export type ResourceArticle = {
  slug: string;
  title: string;
  category: string;
  categories?: string[];
  status?: "published" | "draft";
  summary: string;
  intro?: string;
  description: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  publishedDate?: string;
  estimatedWordCount?: number;
  relatedProducts: string[];
  relatedApplications: string[];
  relatedProductSlugs: string[];
  relatedApplicationSlugs: string[];
  takeaways: string[];
  sections: ArticleSection[];
};

export const editableArticles = articleData as ResourceArticle[];

export const articles = editableArticles.filter((article) => article.status !== "draft");

export const resourceCategories = Array.from(
  new Set(articles.map((article) => article.category))
);

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
