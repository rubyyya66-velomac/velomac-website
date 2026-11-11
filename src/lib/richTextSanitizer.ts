import sanitizeHtml from "sanitize-html";
import { isDeepStrictEqual } from "node:util";
import { legacySectionsToHtml, plainTextWordCount } from "@/lib/articleBody";
import { articleImageSizes, articleImageSrcSet, normalizeArticleImage } from "@/lib/articleImage";

const allowedHighlightColors = new Set(["#dbeafe", "#e5e7eb", "#fef3c7"]);

export function sanitizeArticleBodyHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [
      "h2",
      "h3",
      "p",
      "strong",
      "em",
      "u",
      "s",
      "mark",
      "ul",
      "ol",
      "li",
      "blockquote",
      "hr",
      "a",
      "br",
      "figure",
      "figcaption",
      "img",
      "table",
      "caption",
      "thead",
      "tbody",
      "tr",
      "th",
      "td"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      mark: ["data-color", "style"],
      th: ["scope"],
      figure: ["data-article-image", "data-width", "data-align", "data-decorative"],
      img: ["src", "alt", "width", "height", "loading", "decoding", "srcset", "sizes", "data-decorative"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2",
      div: "p",
      th: (tagName, attributes) => {
        const attribs: Record<string, string> = {};
        if (attributes.scope === "col" || attributes.scope === "row") attribs.scope = attributes.scope;
        return { tagName, attribs };
      },
      figure: (tagName, attributes) => {
        const attrs = normalizeArticleImage({displayWidth: attributes["data-width"], alignment: attributes["data-align"], decorative: attributes["data-decorative"]});
        return {tagName, attribs: {"data-article-image": "true", "data-width": attrs.displayWidth, "data-align": attrs.alignment, "data-decorative": String(attrs.decorative)}};
      },
      img: (tagName, attributes) => {
        const attrs = normalizeArticleImage({src: attributes.src, alt: attributes.alt, width: attributes.width, height: attributes.height, decorative: attributes["data-decorative"]});
        if (!attrs.src) return {tagName, attribs: {}};
        const srcset = articleImageSrcSet(attrs.src);
        return {tagName, attribs: {
          src: attrs.src, alt: attrs.alt, loading: "lazy", decoding: "async", "data-decorative": String(attrs.decorative),
          ...(attrs.width && attrs.height ? {width: String(attrs.width), height: String(attrs.height)} : {}),
          ...(srcset ? {srcset, sizes: articleImageSizes("100")} : {})
        }};
      },
      a: (tagName, attributes) => {
        const href = sanitizeLinkHref(attributes.href || "");
        const opensInNewTab = attributes.target === "_blank";

        if (!href) {
          return { tagName: "span", attribs: {} };
        }

        return {
          tagName,
          attribs: {
            href,
            ...(opensInNewTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})
          }
        };
      },
      mark: (tagName, attributes) => {
        const color = normalizeHighlightColor(attributes["data-color"]);
        const attribs: Record<string, string> = color
          ? {
              "data-color": color,
              style: `background-color: ${color}`
            }
          : {};

        return {
          tagName,
          attribs
        };
      }
    },
    exclusiveFilter: frame => frame.tag === "img" && !frame.attribs.src,
    allowedStyles: {
      mark: {
        "background-color": [
          /^#dbeafe$/i,
          /^#e5e7eb$/i,
          /^#fef3c7$/i
        ]
      }
    },
    disallowedTagsMode: "discard",
    enforceHtmlBoundary: true
  }).trim();
}

export function sanitizeArticleCollection(content: unknown, existingContent: unknown = []): unknown {
  if (!Array.isArray(content)) {
    throw new Error("Article content must be an array.");
  }

  const existing = new Map((Array.isArray(existingContent) ? existingContent : []).filter(isRecord).map(article => [article.slug, article]));
  return content.map((article) => {
    if (!isRecord(article)) {
      return article;
    }

    // Saving an image in one article must not recalculate or migrate other articles.
    const previous = existing.get(article.slug);
    if (previous && isDeepStrictEqual(previous, article)) return previous;

    const sourceHtml =
      typeof article.bodyHtml === "string" && article.bodyHtml.trim()
        ? article.bodyHtml
        : legacySectionsToHtml(article.sections);
    const bodyHtml = sanitizeArticleBodyHtml(sourceHtml);

    return {
      ...article,
      bodyHtml,
      estimatedWordCount: plainTextWordCount(bodyHtml)
    };
  });
}

function sanitizeLinkHref(value: string) {
  const href = value.trim();

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    /^(https?:|mailto:|tel:)/i.test(href)
  ) {
    return href;
  }

  return "";
}

function normalizeHighlightColor(value: string | undefined) {
  if (!value) {
    return "";
  }

  const normalized = value.trim().toLowerCase();
  return allowedHighlightColors.has(normalized) ? normalized : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
