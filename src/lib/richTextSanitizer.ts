import sanitizeHtml from "sanitize-html";
import { legacySectionsToHtml, plainTextWordCount } from "@/lib/articleBody";

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
      "br"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      mark: ["data-color", "style"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2",
      div: "p",
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

export function sanitizeArticleCollection(content: unknown): unknown {
  if (!Array.isArray(content)) {
    throw new Error("Article content must be an array.");
  }

  return content.map((article) => {
    if (!isRecord(article)) {
      return article;
    }

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
