import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { applications } from "@/content/applications";
import { resources } from "@/content/resources";
import { technologyArticles, technologyCategories } from "@/content/technology";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/products", "/applications", "/application-review", "/technology", "/resources", "/about", "/quality-innovation", "/contact"];
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
    url: absoluteUrl(path)
  }));

  const publishedResourcePages = resources.map((resource) => ({
    url: absoluteUrl(`/resources/${resource.slug}`),
    lastModified: new Date(resource.modifiedDate || resource.publishedDate)
  }));

  return [...standardPages, ...publishedResourcePages];
}
