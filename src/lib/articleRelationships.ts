type RelationshipIssue = {
  article: string;
  field: "relatedProductSlugs" | "relatedApplicationSlugs";
  message: string;
};

/** Validate against actual catalogues, not industry labels or guessed URLs. */
export function getArticleRelationshipIssues(
  content: unknown,
  productCatalog: unknown,
  applicationCatalog: unknown
): RelationshipIssue[] {
  if (!Array.isArray(content)) {
    throw new Error("Article content must be an array.");
  }

  const catalogs = {
    relatedProductSlugs: catalogSlugs(productCatalog),
    relatedApplicationSlugs: catalogSlugs(applicationCatalog)
  };
  const issues: RelationshipIssue[] = [];

  content.forEach((article, index) => {
    if (!isRecord(article)) {
      throw new Error(`Article ${index + 1} must be an object.`);
    }
    const label = typeof article.slug === "string" && article.slug
      ? article.slug
      : `Article ${index + 1}`;

    for (const field of ["relatedProductSlugs", "relatedApplicationSlugs"] as const) {
      const values = article[field];
      if (!Array.isArray(values) || values.some((value) => typeof value !== "string")) {
        issues.push({ article: label, field, message: "Use an array of existing page slugs, or [] when none applies." });
        continue;
      }
      for (const value of values as string[]) {
        if (catalogs[field].has(value)) continue;
        const suggestion = Array.from(catalogs[field]).find((slug) => slug === value.trim().toLowerCase());
        issues.push({
          article: label,
          field,
          message: `Unknown slug "${value}".${suggestion ? ` Use "${suggestion}".` : " Choose an existing page slug or remove this association; do not invent a page."}`
        });
      }
    }
  });

  return issues;
}

function catalogSlugs(catalog: unknown): Set<string> {
  if (!Array.isArray(catalog) || !catalog.length || catalog.some((item) => !isRecord(item) || typeof item.slug !== "string" || !item.slug)) {
    throw new Error("The product or application catalogue could not be validated. Reload before saving articles.");
  }
  return new Set(catalog.map((item) => item.slug as string));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
