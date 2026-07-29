export type LegacyArticleSection = {
  heading?: unknown;
  body?: unknown;
};

type ListType = "ul" | "ol";

export function legacySectionsToHtml(sections: unknown): string {
  if (!Array.isArray(sections)) {
    return "";
  }

  return sections
    .map((section) => {
      if (!isRecord(section)) {
        return "";
      }

      const heading =
        typeof section.heading === "string" && section.heading.trim()
          ? `<h2>${escapeHtml(section.heading.trim())}</h2>`
          : "";
      const body = Array.isArray(section.body)
        ? section.body.filter((entry): entry is string => typeof entry === "string")
        : [];

      return `${heading}${legacyParagraphsToHtml(body)}`;
    })
    .join("");
}

export function getEditableArticleHtml(article: Record<string, unknown>): string {
  if (typeof article.bodyHtml === "string" && article.bodyHtml.trim()) {
    return article.bodyHtml;
  }

  return legacySectionsToHtml(article.sections);
}

export function plainTextWordCount(value: string): number {
  const text = value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function legacyParagraphsToHtml(paragraphs: string[]): string {
  const fragments: string[] = [];
  let activeList: { type: ListType; items: string[] } | null = null;

  const flushList = () => {
    if (!activeList) {
      return;
    }

    fragments.push(
      `<${activeList.type}>${activeList.items
        .map((item) => `<li><p>${escapeHtml(item)}</p></li>`)
        .join("")}</${activeList.type}>`
    );
    activeList = null;
  };

  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    const listItem = parseListItem(trimmed);

    if (listItem) {
      if (!activeList || activeList.type !== listItem.type) {
        flushList();
        activeList = { type: listItem.type, items: [] };
      }

      activeList.items.push(listItem.text);
      return;
    }

    flushList();
    fragments.push(`<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`);
  });

  flushList();
  return fragments.join("");
}

function parseListItem(value: string) {
  const bulletMatch = value.match(/^(?:[-*•·])\s+(.+)$/);

  if (bulletMatch) {
    return { type: "ul" as const, text: bulletMatch[1] };
  }

  const numberedMatch = value.match(/^\d+[.)]\s+(.+)$/);

  if (numberedMatch) {
    return { type: "ol" as const, text: numberedMatch[1] };
  }

  return null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
