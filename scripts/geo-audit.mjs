import { promises as fs } from "node:fs";
import path from "node:path";

const baseUrl = (process.argv[2] || "http://localhost:3001").replace(/\/$/, "");
const outputPath = process.argv[3] || "reports/geo-audit.json";
const contentRoot = path.join(process.cwd(), "src/content/data");

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

const pages = [];
const problems = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: { "User-Agent": "Velomac-GEO-Audit/1.0" }
  });
  const html = await response.text();
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => cleanText(match[1]));
  const schemas = parseJsonLd(html, route);
  const schemaTypes = schemas.flatMap(schemaTypesFromValue);
  const page = {
    route,
    status: response.status,
    xRobotsTag: response.headers.get("x-robots-tag"),
    title: tagText(html, "title"),
    description: metaContent(html, "name", "description"),
    canonical: linkHref(html, "canonical"),
    h1,
    schemaTypes,
    serverRendered: h1.length === 1 && cleanText(html).length > 300,
    hasPublishedDate: route.startsWith("/resources/") ? /<time\b[^>]*dateTime=/.test(html) : null
  };

  pages.push(page);

  if (page.status !== 200) addProblem(route, `HTTP ${page.status}`);
  if (page.xRobotsTag) addProblem(route, `unexpected X-Robots-Tag: ${page.xRobotsTag}`);
  if (!page.title) addProblem(route, "missing title");
  if (!page.description) addProblem(route, "missing description");
  if (!page.canonical?.startsWith("https://www.velomacflowmeter.com")) addProblem(route, "invalid canonical");
  if (page.h1.length !== 1) addProblem(route, `${page.h1.length} H1 elements`);
  if (!page.serverRendered) addProblem(route, "main content is not present in server HTML");
  if (!page.schemaTypes.includes("Organization")) addProblem(route, "missing Organization schema");

  if (/^\/products\/[^/]+$/.test(route) && !page.schemaTypes.includes("Product")) {
    addProblem(route, "missing Product schema");
  }
  if (/^\/resources\/[^/]+$/.test(route)) {
    if (!page.schemaTypes.includes("Article")) addProblem(route, "missing Article schema");
    if (!page.hasPublishedDate) addProblem(route, "missing visible publication date");
  }
  if (/^\/(products|applications|resources|technology)\/.+/.test(route) && !page.schemaTypes.includes("BreadcrumbList")) {
    addProblem(route, "missing BreadcrumbList schema");
  }

  const application = applications.find((item) => route === `/applications/${item.slug}`);
  if (application && (!html.includes(application.detailPage.question) || !html.includes(application.detailPage.directAnswer))) {
    addProblem(route, "application question or direct answer missing from server HTML");
  }

  const product = products.find((item) => route === `/products/${item.slug}`);
  const article = product && /^[aeiou]/i.test(product.name) ? "an" : "a";
  if (product && !cleanText(html).includes(`What should be checked before selecting ${article} ${product.name}`)) {
    addProblem(route, "product selection question missing from server HTML");
  }
}

const crawlerAgents = {
  Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  Bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "OAI-SearchBot": "OAI-SearchBot/1.0; +https://openai.com/searchbot",
  GPTBot: "GPTBot/1.2; +https://openai.com/gptbot"
};

const crawlerChecks = [];
for (const [name, userAgent] of Object.entries(crawlerAgents)) {
  const response = await fetch(`${baseUrl}/applications/high-vibration-pipelines`, {
    headers: { "User-Agent": userAgent }
  });
  const html = await response.text();
  const check = {
    name,
    status: response.status,
    xRobotsTag: response.headers.get("x-robots-tag"),
    hasServerRenderedH1: /<h1\b[^>]*>/.test(html),
    challenged: /captcha|access denied|verify you are human/i.test(html)
  };
  crawlerChecks.push(check);
  if (check.status !== 200 || check.xRobotsTag || !check.hasServerRenderedH1 || check.challenged) {
    addProblem("crawler-access", `${name} did not receive an unrestricted server-rendered page`);
  }
}

const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
const robotsText = await robotsResponse.text();
const restrictedChecks = await Promise.all([
  checkRestricted("/admin"),
  checkRestricted("/api/admin/content")
]);
const indexNowKeyResponse = await fetch(`${baseUrl}/indexnow-key.txt`);
const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapText = await sitemapResponse.text();
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const duplicateTitles = duplicateValues(pages, "title");
const duplicateDescriptions = duplicateValues(pages, "description");
if (duplicateTitles.length) addProblem("sitewide", `${duplicateTitles.length} duplicate title groups`);
if (duplicateDescriptions.length) addProblem("sitewide", `${duplicateDescriptions.length} duplicate description groups`);

const result = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  pageCount: pages.length,
  crawlerChecks,
  robots: {
    status: robotsResponse.status,
    allowsPublicByDefault: /User-Agent:\s*\*/i.test(robotsText) && /Allow:\s*\//i.test(robotsText),
    disallowsAdmin: /Disallow:\s*\/admin/i.test(robotsText),
    disallowsApi: /Disallow:\s*\/api\//i.test(robotsText),
    hasSpecificGPTBotRule: /User-Agent:\s*GPTBot/i.test(robotsText)
  },
  restrictedChecks,
  indexNowKey: {
    statusWithoutConfiguredKey: indexNowKeyResponse.status,
    xRobotsTag: indexNowKeyResponse.headers.get("x-robots-tag")
  },
  sitemap: {
    status: sitemapResponse.status,
    urlCount: sitemapUrls.length,
    allAuditedRoutesPresent: pages.every((page) => sitemapUrls.includes(new URL(page.route, "https://www.velomacflowmeter.com").href))
  },
  duplicateTitles,
  duplicateDescriptions,
  problems,
  pages
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(`GEO-audited ${pages.length} indexable pages and ${crawlerChecks.length} crawler identities.`);
console.log(`Problems: ${problems.length}; sitemap URLs: ${sitemapUrls.length}.`);
console.log(`Report: ${outputPath}`);

async function readJson(filename) {
  return JSON.parse(await fs.readFile(path.join(contentRoot, filename), "utf8"));
}

async function checkRestricted(route) {
  const response = await fetch(`${baseUrl}${route}`);
  return {
    route,
    status: response.status,
    xRobotsTag: response.headers.get("x-robots-tag")
  };
}

function parseJsonLd(html, route) {
  const values = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      values.push(JSON.parse(match[1]));
    } catch (error) {
      addProblem(route, `invalid JSON-LD: ${error.message}`);
    }
  }
  return values;
}

function schemaTypesFromValue(value) {
  if (Array.isArray(value)) return value.flatMap(schemaTypesFromValue);
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value["@graph"])) return value["@graph"].flatMap(schemaTypesFromValue);
  return Array.isArray(value["@type"]) ? value["@type"] : value["@type"] ? [value["@type"]] : [];
}

function addProblem(route, issue) {
  problems.push({ route, issue });
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
