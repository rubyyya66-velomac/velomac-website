import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { resources } from "@/content/resources";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/products", "/applications", "/resources", "/about", "/contact"];
  const productPages = products.map((product) => `/products/${product.slug}`);
  const resourcePages = resources.map((resource) => `/resources/${resource.slug}`);

  return [...staticPages, ...productPages, ...resourcePages].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/products") ? 0.8 : 0.6
  }));
}
