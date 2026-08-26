import { promises as fs } from "node:fs";
import path from "node:path";

const baseUrl = new URL(process.argv[2] || "http://localhost:3001");
const outputPath = process.argv[3] || "reports/phase2-audit.json";
const contentRoot = path.join(process.cwd(), "src/content/data");
const canonicalOrigin = "https://www.velomacflowmeter.com";

const products = await readJson("products.json");
const applications = await readJson("applications.json");
const technology = await readJson("technology.json");
const articles = (await readJson("articles.json")).filter((article) => article.status !== "draft");

const routes = [...new Set([
  "/",
  "/products",
  "/applications",
  "/technology",
  "/resources",
  "/about",
  "/quality-innovation",
  "/contact",
  ...products.map((product) => `/products/${product.slug}`),
  "/products/vortex-flowmeter/wide-turndown-anti-vibration",
  ...applications.map((application) => `/applications/${application.slug}`),
  ...technology.categories.map((category) => `/technology/${category.slug}`),
  ...technology.articles.map((article) => `/technology/${article.slug}`),
  ...articles.map((article) => `/resources/${article.slug}`)
])];

const knownRoutes = new Set(routes);
const pages = [];
const incoming = new Map(routes.map((route) => [route, new Set()]));
const internalTargets = new Set();

for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl));
  const html = await response.text();
  const links = extractLinks(html)
    .map((href) => normalizeInternalHref(href))
    .filter((href) => href !== null);
  const uniqueLinks = [...new Set(links)];
  const duplicateTargets = duplicateValues(links);

  for (const target of uniqueLinks) {
    internalTargets.add(target);
    if (knownRoutes.has(target) && target !== route) incoming.get(target)?.add(route);
  }

  const schema = parseJsonLd(html);
  const schemaEntities = schema.values.flatMap(schemaEntitiesFromValue);
  const imageAlts = extractImageAlts(html);
  pages.push({
    route,
    status: response.status,
    canonical: linkHref(html, "canonical"),
    title: tagText(html, "title"),
    description: metaContent(html, "name", "description"),
    h1Count: (html.match(/<h1\b/gi) || []).length,
    xRobotsTag: response.headers.get("x-robots-tag"),
    internalLinkCount: uniqueLinks.length,
    duplicateTargets,
    missingImageAltCount: imageAlts.filter((alt) => alt === null).length,
    emptyImageAltCount: imageAlts.filter((alt) => alt === "").length,
    invalidJsonLdCount: schema.invalid,
    schemaTypes: schema.values.flatMap(schemaTypesFromValue),
    schemaEntities
  });
}

const schemaEntityTypes = new Map();
for (const page of pages) {
  for (const entity of page.schemaEntities) {
    if (!entity.id) continue;
    const types = schemaEntityTypes.get(entity.id) || new Set();
    entity.types.forEach((type) => types.add(type));
    schemaEntityTypes.set(entity.id, types);
  }
}

const schemaRelationshipProblems = [];
for (const page of pages) {
  for (const entity of page.schemaEntities) {
    if (entity.types.some((type) => ["Product", "ProductGroup"].includes(type))) {
      if (entity.mainEntityOfPage.length !== 1 || entity.mainEntityOfPage[0] !== page.canonical) {
        schemaRelationshipProblems.push({
          route: page.route,
          entity: entity.id,
          property: "mainEntityOfPage",
          issue: `expected ${page.canonical}; found ${entity.mainEntityOfPage.join(", ") || "no value"}`
        });
      }
    }
    if (entity.hasVariant.length > 0 && !entity.types.includes("ProductGroup")) {
      schemaRelationshipProblems.push({
        route: page.route,
        entity: entity.id,
        property: "hasVariant",
        issue: `domain must be ProductGroup; found ${entity.types.join(", ") || "no type"}`
      });
    }
    for (const target of entity.hasVariant) {
      const targetTypes = [...(schemaEntityTypes.get(target) || [])];
      if (!targetTypes.includes("Product")) {
        schemaRelationshipProblems.push({
          route: page.route,
          entity: entity.id,
          property: "hasVariant",
          target,
          issue: `range must be Product; found ${targetTypes.join(", ") || "unresolved target"}`
        });
      }
    }
    if (entity.isVariantOf.length > 0 && !entity.types.some((type) => ["Product", "ProductModel"].includes(type))) {
      schemaRelationshipProblems.push({
        route: page.route,
        entity: entity.id,
        property: "isVariantOf",
        issue: `domain must be Product or ProductModel; found ${entity.types.join(", ") || "no type"}`
      });
    }
    for (const target of entity.isVariantOf) {
      const targetTypes = [...(schemaEntityTypes.get(target) || [])];
      if (!targetTypes.some((type) => ["ProductGroup", "ProductModel"].includes(type))) {
        schemaRelationshipProblems.push({
          route: page.route,
          entity: entity.id,
          property: "isVariantOf",
          target,
          issue: `range must be ProductGroup or ProductModel; found ${targetTypes.join(", ") || "unresolved target"}`
        });
      }
    }
  }
}

const targetChecks = [];
for (const target of [...internalTargets].sort()) {
  const response = await fetch(new URL(target, baseUrl), { redirect: "manual" });
  targetChecks.push({
    target,
    status: response.status,
    location: response.headers.get("location")
  });
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
const sitemapText = await sitemapResponse.text();
const sitemapRoutes = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const url = new URL(match[1]);
  return normalizePath(url.pathname);
});

const redirectChecks = baseUrl.hostname === "www.velomacflowmeter.com"
  ? await Promise.all([
      traceRedirect("http://velomacflowmeter.com/"),
      traceRedirect("http://www.velomacflowmeter.com/"),
      traceRedirect("https://velomacflowmeter.com/")
    ])
  : [];

const result = {
  generatedAt: new Date().toISOString(),
  baseUrl: baseUrl.href.replace(/\/$/, ""),
  pageCount: pages.length,
  brokenInternalLinks: targetChecks.filter((item) => item.status >= 400),
  redirectingInternalLinks: targetChecks.filter((item) => item.status >= 300 && item.status < 400),
  orphanPages: routes.filter((route) => route !== "/" && incoming.get(route)?.size === 0),
  weaklyLinkedPages: routes
    .filter((route) => route !== "/" && (incoming.get(route)?.size || 0) <= 1)
    .map((route) => ({ route, incomingFrom: [...(incoming.get(route) || [])] })),
  incomingLinks: Object.fromEntries(routes.map((route) => [route, [...(incoming.get(route) || [])].sort()])),
  sitemap: {
    status: sitemapResponse.status,
    urlCount: sitemapRoutes.length,
    missingRoutes: routes.filter((route) => !sitemapRoutes.includes(route)),
    unexpectedRoutes: sitemapRoutes.filter((route) => !knownRoutes.has(route)),
    duplicateRoutes: duplicateValues(sitemapRoutes)
  },
  duplicateTitles: duplicateByField(pages, "title"),
  duplicateDescriptions: duplicateByField(pages, "description"),
  duplicateCanonicals: duplicateByField(pages, "canonical"),
  pagesWithMissingAlt: pages.filter((page) => page.missingImageAltCount > 0 || page.emptyImageAltCount > 0),
  pagesWithInvalidJsonLd: pages.filter((page) => page.invalidJsonLdCount > 0),
  schemaRelationshipProblems,
  redirectChecks,
  pages
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log(`Architecture-audited ${pages.length} pages and ${targetChecks.length} internal targets.`);
console.log(`Broken links: ${result.brokenInternalLinks.length}; orphan pages: ${result.orphanPages.length}; weak pages: ${result.weaklyLinkedPages.length}.`);
console.log(`Missing/empty image ALT pages: ${result.pagesWithMissingAlt.length}; invalid JSON-LD pages: ${result.pagesWithInvalidJsonLd.length}.`);
console.log(`Schema relationship problems: ${result.schemaRelationshipProblems.length}.`);
console.log(`Report: ${outputPath}`);

async function readJson(filename) {
  return JSON.parse(await fs.readFile(path.join(contentRoot, filename), "utf8"));
}

function extractLinks(html) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
}

function normalizeInternalHref(href) {
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null;
  const url = new URL(href, baseUrl);
  if (![baseUrl.origin, canonicalOrigin].includes(url.origin)) return null;
  return normalizePath(url.pathname);
}

function normalizePath(pathname) {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function extractImageAlts(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => attributeValue(match[0], "alt", true));
}

function parseJsonLd(html) {
  const values = [];
  let invalid = 0;
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      values.push(JSON.parse(match[1]));
    } catch {
      invalid += 1;
    }
  }
  return { values, invalid };
}

function schemaTypesFromValue(value) {
  if (Array.isArray(value)) return value.flatMap(schemaTypesFromValue);
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value["@graph"])) return value["@graph"].flatMap(schemaTypesFromValue);
  return Array.isArray(value["@type"]) ? value["@type"] : value["@type"] ? [value["@type"]] : [];
}

function schemaEntitiesFromValue(value) {
  if (Array.isArray(value)) return value.flatMap(schemaEntitiesFromValue);
  if (!value || typeof value !== "object") return [];

  const types = Array.isArray(value["@type"])
    ? value["@type"]
    : value["@type"]
      ? [value["@type"]]
      : [];
  const current = types.length > 0
    ? [{
        id: typeof value["@id"] === "string" ? value["@id"] : null,
        types,
        mainEntityOfPage: schemaReferenceIds(value.mainEntityOfPage),
        hasVariant: schemaReferenceIds(value.hasVariant),
        isVariantOf: schemaReferenceIds(value.isVariantOf)
      }]
    : [];

  return [
    ...current,
    ...Object.values(value).flatMap(schemaEntitiesFromValue)
  ];
}

function schemaReferenceIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(schemaReferenceIds);
  if (typeof value === "string") return [value];
  if (typeof value === "object" && typeof value["@id"] === "string") return [value["@id"]];
  return [];
}

function tagText(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? cleanText(match[1]) : null;
}

function metaContent(html, attribute, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((item) => attributeValue(item, attribute) === value);
  return tag ? attributeValue(tag, "content") : null;
}

function linkHref(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const tag = tags.find((item) => attributeValue(item, "rel") === rel);
  return tag ? attributeValue(tag, "href") : null;
}

function attributeValue(tag, name, preserveEmpty = false) {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  if (!match) return null;
  return preserveEmpty ? match[1] : match[1] || null;
}

function cleanText(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function duplicateValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
}

function duplicateByField(items, field) {
  const groups = new Map();
  for (const item of items) {
    if (!item[field]) continue;
    groups.set(item[field], [...(groups.get(item[field]) || []), item.route]);
  }
  return [...groups.entries()]
    .filter(([, itemRoutes]) => itemRoutes.length > 1)
    .map(([value, itemRoutes]) => ({ value, routes: itemRoutes }));
}

async function traceRedirect(startUrl) {
  const chain = [];
  let current = startUrl;
  for (let index = 0; index < 6; index += 1) {
    const response = await fetch(current, { redirect: "manual" });
    const location = response.headers.get("location");
    chain.push({ url: current, status: response.status, location });
    if (!location || response.status < 300 || response.status >= 400) break;
    current = new URL(location, current).href;
  }
  return {
    startUrl,
    chain,
    finalUrl: current,
    reachesPreferredCanonical: current === `${canonicalOrigin}/`
  };
}
