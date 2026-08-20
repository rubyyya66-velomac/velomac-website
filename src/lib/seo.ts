import type { Metadata } from "next";
import { site } from "@/content/site";

export function absoluteUrl(path = "") {
  const base = site.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website"
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : absoluteUrl(site.logos.header);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      type,
      siteName: site.name,
      title,
      description,
      url: canonical,
      images: [
        {
          url: imageUrl,
          alt: imageAlt || site.logos.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}
