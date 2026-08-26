import { promises as fs } from "node:fs";
import path from "node:path";

const baseUrl = (process.argv[2] || "http://localhost:3001").replace(/\/$/, "");
const outputPath = process.argv[3] || "reports/seo-audit.json";
const contentRoot = path.join(process.cwd(), "src/content/data");

const products = await readJson("products.json");
const applications = await readJson("applications.json");
const technology = await readJson("technology.json");
const articles = (await readJson("articles.json")).filter((article) => article.status !== "draft");

const routes = [
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
];

const uniqueRoutes = [...new Set(routes)];
const pages = [];

for (const route of uniqueRoutes) {
  const response = await fetch(`${baseUrl}${route}`);
  const html = await response.text();
  const h1Values = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => cleanText(match[1]));

  pages.push({
    route,
    status: response.status,
    title: tagText(html, "title"),
    description: metaContent(html, "name", "description"),
    canonical: linkHref(html, "canonical"),
    h1Count: h1Values.length,
    h1: h1Values,
    robots: metaContent(html, "name", "robots") || "index,follow (default)",
    ogTitle: metaContent(html, "property", "og:title"),
    ogDescription: metaContent(html, "property", "og:description"),
    ogUrl: metaContent(html, "property", "og:url"),
    ogImage: metaContent(html, "property", "og:image"),
    twitterCard: metaContent(html, "name", "twitter:card")
  });
}

const duplicateTitles = duplicateValues(pages, "title");
const duplicateDescriptions = duplicateValues(pages, "description");
const problems = pages.flatMap((page) => {
  const issues = [];
  if (page.status !== 200) issues.push(`HTTP ${page.status}`);
  if (!page.title) issues.push("missing title");
  if (!page.description) issues.push("missing description");
  if (!page.canonical?.startsWith("https://www.velomacflowmeter.com")) issues.push("invalid canonical");
  if (page.h1Count !== 1) issues.push(`${page.h1Count} H1 elements`);
  if (!page.ogTitle || !page.ogDescription || !page.ogUrl || !page.ogImage) issues.push("incomplete Open Graph metadata");
  if (!page.twitterCard) issues.push("missing Twitter card");
  return issues.map((issue) => ({ route: page.route, issue }));
});

const result = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  pageCount: pages.length,
  duplicateTitles,
  duplicateDescriptions,
  problems,
  pages
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(`Audited ${pages.length} indexable pages.`);
console.log(`Problems: ${problems.length}; duplicate titles: ${duplicateTitles.length}; duplicate descriptions: ${duplicateDescriptions.length}.`);
console.log(`Report: ${outputPath}`);

async function readJson(filename) {
  return JSON.parse(await fs.readFile(path.join(contentRoot, filename), "utf8"));
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

function attributeValue(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return match?.[1] || null;
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

function duplicateValues(items, key) {
  const groups = new Map();
  for (const item of items) {
    if (!item[key]) continue;
    groups.set(item[key], [...(groups.get(item[key]) || []), item.route]);
  }
  return [...groups.entries()]
    .filter(([, itemRoutes]) => itemRoutes.length > 1)
    .map(([value, itemRoutes]) => ({ value, routes: itemRoutes }));
}
