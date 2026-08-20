import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { applications } from "@/content/applications";
import { resources } from "@/content/resources";
import { technologyArticles, technologyCategories } from "@/content/technology";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/products", "/applications", "/technology", "/resources", "/about", "/quality-innovation", "/contact"];
  const productPages = products.map((product) => `/products/${product.slug}`);
  const featuredProductPages = ["/products/vortex-flowmeter/wide-turndown-anti-vibration"];
  const applicationPages = applications.map((application) => `/applications/${application.slug}`);
  const technologyCategoryPages = technologyCategories.map((category) => `/technology/${category.slug}`);
  const technologyPages = technologyArticles.map((article) => `/technology/${article.slug}`);
  const standardPages = [
    ...staticPages,
    ...productPages,
    ...featuredProductPages,
    ...applicationPages,
    ...technologyCategoryPages,
    ...technologyPages
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : path.startsWith("/products") || path.startsWith("/applications/") ? 0.8 : 0.6
  }));

  const publishedResourcePages = resources.map((resource) => ({
    url: absoluteUrl(`/resources/${resource.slug}`),
    ...(resource.publishedDate ? { lastModified: new Date(resource.publishedDate) } : {}),
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  return [...standardPages, ...publishedResourcePages];
}
