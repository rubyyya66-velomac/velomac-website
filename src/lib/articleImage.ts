export type ArticleImageAttributes = {
  src: string;
  alt: string;
  caption: string;
  decorative: boolean;
  displayWidth: "50" | "75" | "100";
  alignment: "left" | "center" | "right";
  width: number | null;
  height: number | null;
};

// Article images reuse the existing, public Media Library. Never persist data/blob URLs.
export function safeArticleImageSrc(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/images/") || /[\\\u0000-\u001f<>"']/.test(value)) return "";
  try {
    const url = new URL(value, "https://www.velomacflowmeter.com");
    const decoded = decodeURIComponent(url.pathname);
    if (!decoded.startsWith("/images/") || decoded.includes("..") || /[\\\u0000-\u001f]/.test(decoded) || url.search || url.hash) return "";
    return /\.(jpe?g|png|webp|svg)$/i.test(url.pathname) ? url.pathname : "";
  } catch {
    return "";
  }
}

export function imageDimension(value: unknown): number | null {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 && number <= 50000 ? number : null;
}

export function normalizeArticleImage(value: Partial<Record<keyof ArticleImageAttributes, unknown>>): ArticleImageAttributes {
  const decorative = value.decorative === true || value.decorative === "true";
  return {
    src: safeArticleImageSrc(value.src),
    alt: decorative ? "" : typeof value.alt === "string" ? value.alt : "",
    caption: typeof value.caption === "string" ? value.caption : "",
    decorative,
    displayWidth: value.displayWidth === "50" || value.displayWidth === "75" ? value.displayWidth : "100",
    alignment: value.alignment === "left" || value.alignment === "right" ? value.alignment : "center",
    width: imageDimension(value.width),
    height: imageDimension(value.height)
  };
}

export function articleImageSrcSet(src: string) {
  const safeSrc = safeArticleImageSrc(src);
  if (!safeSrc || /\.svg$/i.test(safeSrc)) return "";
  // Next.js's existing image optimizer; these are supported default widths.
  return [384, 640, 828, 1080, 1920].map(width => `/_next/image?url=${encodeURIComponent(safeSrc)}&w=${width}&q=75 ${width}w`).join(", ");
}

export function articleImageSizes(displayWidth: ArticleImageAttributes["displayWidth"]) {
  return `(max-width: 640px) calc(100vw - 40px), ${displayWidth === "50" ? "400" : displayWidth === "75" ? "600" : "800"}px`;
}
