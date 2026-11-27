import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import sanitizeHtml from "sanitize-html";

const base = (process.argv[2] || "http://127.0.0.1:3021").replace(/\/$/, "");
const mode = process.argv[3] || "local";
const target = "/applications/steam-measurement";
const canonical = "https://www.velomacflowmeter.com" + target;
const report = { mode, base, checkedAt: new Date().toISOString() };
const mainOf = (html) => html.match(/<main[^>]*>[\s\S]*?<\/main>/)?.[0] || "";
const decode = (value = "") => value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
const meta = (html, key) => decode(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1]);
const links = (html) => [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>/g)].map((match) => decode(match[1]));
const facts = (html) => ({
  title: decode(html.match(/<title>(.*?)<\/title>/)?.[1]),
  description: meta(html, "description"), canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
  h1: [...mainOf(html).matchAll(/<h1[^>]*>(.*?)<\/h1>/g)].map((match) => match[1]),
  ogTitle: meta(html, "og:title"), ogDescription: meta(html, "og:description"), ogUrl: meta(html, "og:url"),
  ogImage: meta(html, "og:image"), twitterCard: meta(html, "twitter:card"), robots: meta(html, "robots"),
  approximateMainWordCount: (sanitizeHtml(mainOf(html), { allowedTags: [], allowedAttributes: {} }).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length,
  htmlBytes: Buffer.byteLength(html), mainHtmlBytes: Buffer.byteLength(mainOf(html))
});

const response = await fetch(base + target);
assert.equal(response.status, 200);
const html = await response.text();
report.page = { status: response.status, xRobotsTag: response.headers.get("x-robots-tag"), ...facts(html) };
assert.equal(report.page.canonical, canonical);
assert.deepEqual(report.page.h1, ["Industrial Steam Flow Measurement"]);
assert.ok(!/noindex|nosnippet|none/i.test(report.page.robots + " " + (report.page.xRobotsTag || "")));
assert.equal(report.page.ogUrl, canonical); assert.equal(report.page.twitterCard, "summary_large_image");
const bot = await fetch(base + target, { headers: { "user-agent": "Googlebot" } });
report.googlebotUserAgent = { status: bot.status, readablePrimaryContent: (await bot.text()).includes("Industrial Steam Flow Measurement") };
assert.equal(bot.status, 200); assert.ok(report.googlebotUserAgent.readablePrimaryContent);
const tagged = facts(await (await fetch(base + target + "?utm_source=steam_step4_qa&utm_medium=test")).text());
assert.equal(tagged.canonical, canonical);

const robotsResponse = await fetch(base + "/robots.txt");
report.robots = { status: robotsResponse.status, text: await robotsResponse.text() };
assert.equal(robotsResponse.status, 200);
assert.ok(!report.robots.text.includes("Disallow: /applications") && !/^Disallow: \/\s*$/m.test(report.robots.text));
const sitemapResponse = await fetch(base + "/sitemap.xml"); const sitemap = await sitemapResponse.text();
report.sitemap = { status: sitemapResponse.status, entry: sitemap.match(new RegExp(`<url>\\s*<loc>${canonical}</loc>[\\s\\S]*?</url>`))?.[0] };
assert.equal(sitemapResponse.status, 200); assert.ok(report.sitemap.entry);

const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
const graph = scripts.flatMap((item) => item["@graph"] || [item]);
report.structuredData = graph;
assert.equal(graph.filter((item) => item["@type"] === "Organization").length, 1);
assert.equal(graph.filter((item) => item["@type"] === "BreadcrumbList").length, 1);
assert.ok(!graph.some((item) => ["Product", "ProductGroup", "FAQPage"].includes(item["@type"])));
if (mode === "local") {
  assert.equal(report.page.title, "Steam Flow Meter Selection | Velomac");
  assert.equal(report.page.ogTitle, report.page.title); assert.equal(report.page.ogDescription, report.page.description);
  assert.ok(report.page.ogImage.endsWith("/images/products/vortex-flowmeter.jpg"));
  assert.ok(report.sitemap.entry.includes("2026-11-26"));
  const page = graph.find((item) => item["@type"] === "WebPage"); assert.ok(page);
  assert.equal(page.url, canonical); assert.equal(page.breadcrumb["@id"], canonical + "#breadcrumb");
  assert.equal(page.isPartOf["@id"], "https://www.velomacflowmeter.com/#website");
  for (const text of ["Absolute Pressure", "kg/h = m³/h", "saturation temperature", "Wet steam:", "Steam Flow Meter Selection Conditions"]) assert.ok(mainOf(html).includes(text), text);
}

report.internalLinks = [];
for (const href of [...new Set(links(mainOf(html)).filter((href) => href.startsWith("/") && !href.startsWith("//")))]) {
  const result = await fetch(base + href);
  assert.equal(result.status, 200, href);
  report.internalLinks.push({ href, status: result.status, canonical: facts(await result.text()).canonical });
}
const productResponse = await fetch(base + "/products/vortex-flowmeter");
report.productBacklink = { status: productResponse.status, present: links(mainOf(await productResponse.text())).includes(target) };
assert.ok(report.productBacklink.present);
const socialImage = new URL(report.page.ogImage).pathname;
const imageResponse = await fetch(base + socialImage);
report.socialImage = { url: report.page.ogImage, status: imageResponse.status, contentType: imageResponse.headers.get("content-type"), bytes: (await imageResponse.arrayBuffer()).byteLength };
assert.equal(imageResponse.status, 200);
try { report.before = facts(readFileSync("reports/step4-baseline/applications--steam-measurement.html", "utf8")); } catch {}
mkdirSync("reports", { recursive: true });
const path = `reports/steam-step4-${mode}-audit.json`;
writeFileSync(path, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ report: path, title: report.page.title, wordCount: report.page.approximateMainWordCount, internalLinks: report.internalLinks.length, schemaTypes: graph.map((item) => item["@type"]), socialImage: report.socialImage, step4MetadataPresent: report.page.title === "Steam Flow Meter Selection | Velomac" }, null, 2));
