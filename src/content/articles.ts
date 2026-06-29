import articleData from "./articles.json";

export type ArticleSection = {
  heading: string;
  body: string[];
};

export type ResourceArticle = {
  slug: string;
  title: string;
  category: string;
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

export const articles = articleData as ResourceArticle[];

export const resourceCategories = Array.from(
  new Set(articles.map((article) => article.category))
);

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
