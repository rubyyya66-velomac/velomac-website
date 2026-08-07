import type { MetadataRoute } from "next";
import { applications } from "@/content/applications";
import { products } from "@/content/products";
import { resources } from "@/content/resources";
import { technologyArticles, technologyCategories } from "@/content/technology";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/products", "/applications", "/technology", "/resources", "/about", "/quality-innovation", "/contact"];
  const productPages = products.map((product) => `/products/${product.slug}`);
  const applicationPages = applications.map((application) => `/applications/${application.slug}`);
  const technologyCategoryPages = technologyCategories.map((category) => `/technology/${category.slug}`);
  const technologyPages = technologyArticles.map((article) => `/technology/${article.slug}`);
  const resourcePages = resources.map((resource) => `/resources/${resource.slug}`);

  return [...staticPages, ...productPages, ...applicationPages, ...technologyCategoryPages, ...technologyPages, ...resourcePages].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/products") ? 0.8 : 0.6
  }));
}
