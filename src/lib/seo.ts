import { site } from "@/content/site";

export function absoluteUrl(path = "") {
  const base = site.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
