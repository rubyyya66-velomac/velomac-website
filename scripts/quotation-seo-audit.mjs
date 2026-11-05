import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import sharp from "sharp";

const base = process.argv[2] ?? "http://127.0.0.1:3012";
const canonical = "https://www.velomacflowmeter.com/resources";
const target = "/resources#buyer-tools-heading";
const download = "/downloads/quotation-scope-landed-cost-comparison-sheet";
const socialImage = "/images/brand/quotation-comparison-share.png";
const baseline = process.argv.includes("--baseline");
const agents = ["Googlebot", "bingbot", "OAI-SearchBot"];
const query = "?utm_source=linkedin&utm_medium=organic_social&utm_campaign=quotation_comparison_sheet";

async function request(path, agent) {
  const start = performance.now();
  const response = await fetch(new URL(path, base), {
    headers: agent ? { "user-agent": agent } : {},
    signal: AbortSignal.timeout(20_000)
  });
  return { response, firstHeadersMs: Math.round(performance.now() - start) };
}

async function page(path, agent) {
  const { response, firstHeadersMs } = await request(path, agent);
  return { response, html: await response.text(), firstHeadersMs };
}

const checkPage = (result) => {
  assert.equal(result.response.status, 200);
  assert.match(result.html, /<link rel="canonical" href="https:\/\/www\.velomacflowmeter\.com\/resources"/);
  assert.match(result.html, /<meta name="robots" content="index, follow"/);
  assert.doesNotMatch(result.response.headers.get("x-robots-tag") || "", /noindex/i);
  assert.equal([...result.html.matchAll(/<h1(?:\s|>)/g)].length, 1);
  assert.match(result.html, /<h2[^>]*id="buyer-tools-heading"/);
  for (const ext of ["pdf", "xlsx"]) {
    const link = result.html.match(new RegExp(`<a[^>]*id="buyer-tools-quotation-sheet-${ext}"[^>]*>`))?.[0];
    assert.ok(link?.includes(`href="${download}.${ext}"`));
    assert.match(link, /\bdownload=""/);
  }
  if (!baseline) {
    assert.match(result.html, /<h3[^>]*>Instrument price vs\. total landed cost<\/h3>/);
    assert.match(result.html, /<table[\s>]/);
    assert.match(result.html, /<meta property="og:image:width" content="1200"/);
    assert.match(result.html, /<meta property="og:image:height" content="630"/);
    assert.match(result.html, /<meta name="twitter:card" content="summary_large_image"/);
    assert.match(result.html, /<meta name="twitter:image:alt" content="Velomac Flow Meter/);
    assert.match(result.html, /<meta property="og:title" content="Comparing Flowmeter Quotations\? Look Beyond the Unit Price\."/);
    const data = Array.from(result.html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs), m => JSON.parse(m[1]));
    assert.deepEqual(data.map(node => node["@type"]).sort(), ["BreadcrumbList", "Organization", "WebPage", "WebSite"]);
    const [webPage, bread, organization, website] = ["WebPage", "BreadcrumbList", "Organization", "WebSite"].map(type => data.find(node => node["@type"] === type));
    assert.equal(webPage.url, canonical);
    assert.equal(webPage.breadcrumb["@id"], bread["@id"]);
    assert.equal(webPage.publisher["@id"], organization["@id"]);
    assert.equal(webPage.isPartOf["@id"], website["@id"]);
    assert.equal(organization.name, "Velomac Flow Meter");
    assert.equal(organization.sameAs.length, 3);
    assert.ok(organization.logo && organization.description);
    assert.deepEqual(bread.itemListElement.map(({ position, name, item }) => [position, name, item]), [
      [1, "Home", "https://www.velomacflowmeter.com/"],
      [2, "Resources", canonical]
    ]);
  }
};

const normal = await page("/resources");
const [utm, robots, sitemap, ...botPages] = await Promise.all([
  page("/resources" + query),
  page("/robots.txt"),
  page("/sitemap.xml"),
  ...agents.map(agent => page("/resources", agent))
]);
[normal, utm, ...botPages].forEach(checkPage);
assert.equal(robots.response.status, 200);
assert.match(robots.html, /User-Agent: \*\s+Allow: \/\s+Disallow: \/admin\s+Disallow: \/api\//i);
assert.equal(sitemap.response.status, 200);
const entries = [...sitemap.html.matchAll(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)];
const resourceEntry = entries.filter(([, loc]) => loc === canonical);
assert.equal(resourceEntry.length, 1);
assert.ok(!entries.some(([, loc]) => loc.startsWith(canonical + "?") || loc.startsWith(canonical + "#") || loc.includes(download)));
if (!baseline) assert.match(resourceEntry[0][2], /<lastmod>2026-11-05<\/lastmod>/);

const downloads = await Promise.all(["pdf", "xlsx"].map(async (ext) => {
  const { response } = await request(download + "." + ext);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(response.status, 200);
  assert.equal(bytes.subarray(0, ext === "pdf" ? 4 : 2).toString(), ext === "pdf" ? "%PDF" : "PK");
  return { ext, bytes: bytes.length, contentType: response.headers.get("content-type") };
}));

let social;
const entryPages = ["/contact", "/resources/flowmeter-quote-site-details", "/resources/flowmeter-selection-messy-site-conditions", "/products/vortex-flowmeter"];
if (!baseline) {
  const { response } = await request(socialImage);
  assert.equal(response.status, 200);
  const bytes = Buffer.from(await response.arrayBuffer());
  const { width, height } = await sharp(bytes).metadata();
  assert.deepEqual([width, height], [1200, 630]);
  social = { width, height, bytes: bytes.length };
  for (const path of entryPages) {
    const result = await page(path);
    assert.equal(result.response.status, 200);
    assert.match(result.html, new RegExp(`<a[^>]*href="${target}"`));
    if (path === "/contact") assert.match(result.html, /<a[^>]*id="contact-quotation-sheet-pdf"/);
  }
}

console.log(JSON.stringify({
  base, canonical, http: normal.response.status,
  utm: utm.response.status, crawlers: agents.map((name, i) => [name, botPages[i].response.status]),
  sitemapResourcesEntries: resourceEntry.length, sitemapLastmod: resourceEntry[0][2].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null,
  indexNowKeyStatus: (await request("/indexnow-key.txt")).response.status,
  html: { bytes: Buffer.byteLength(normal.html), estimatedGzipBytes: gzipSync(normal.html).length, responseHeadersMs: normal.firstHeadersMs },
  downloads, social, internalEntryPages: baseline ? undefined : entryPages
}, null, 2));
