import assert from "node:assert/strict";

const base = process.argv[2] || "http://127.0.0.1:3014";
const canonical = "https://www.velomacflowmeter.com";
const cases = [
  ["/resources/fertilizer-plant-flow-measurement", 5, "Approximately 2,930 t/day"],
  ["/resources/mbr-water-reclamation-flow-measurement", 1, "Membrane-scouring air"]
];

async function get(path, userAgent) {
  return fetch(new URL(path, base), {
    headers: userAgent ? { "User-Agent": userAgent } : {},
    signal: AbortSignal.timeout(25000)
  });
}

for (const [path, expectedTables, sample] of cases) {
  const res = await get(path, "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
  assert.equal(res.status, 200, path);
  const html = await res.text();
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}${path}"`));
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<table[\s>]/g) || []).length, expectedTables);
  assert.equal((html.match(/<caption>/g) || []).length, expectedTables);
  assert.equal((html.match(/class="article-table-scroll"/g) || []).length, expectedTables);
  assert.ok(html.includes(sample), sample);
  assert.ok(html.includes('"dateModified":"2026-11-11"'));
  assert.match(html, /<th scope="col">/);
  assert.match(html, /<th scope="row">/);
  if (expectedTables === 5) assert.match(html, /<meta name="description" content="Explore fertilizer plant flow measurement/);
  const images = [...html.matchAll(/<a href="(\/images\/uploads\/[^"]+)"[^>]*>View original table image:/g)];
  assert.equal(images.length, expectedTables);
  for (const [, image] of images) {
    const response = await fetch(new URL(image, base), { method: "HEAD", signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200, image);
  }
  console.log(`${path}: ${expectedTables} server-rendered tables and original assets verified`);
}

const [home, admin, sitemap, robots] = await Promise.all(["/", "/admin", "/sitemap.xml", "/robots.txt"].map(async path => {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  return { html: await response.text(), headers: response.headers };
}));
assert.match(home.html, /text-slate-700[^>]*>More flowmeter families/);
assert.ok(home.html.includes("109px, (min-width: 640px) 73px, 67px"));
for (const social of ["linkedin.com/company/velomac-flowmeter", "facebook.com/VelomacFlowmeter", "tiktok.com/@velomac_flowmeter"]) {
  assert.ok(home.html.includes(social));
}
assert.match(admin.headers.get("x-robots-tag") || "", /noindex/);
assert.match(admin.html, /name="robots" content="noindex, nofollow"/);
assert.match(robots.html, /Disallow: \/admin/);
assert.match(sitemap.html, /<loc>https:\/\/www\.velomacflowmeter\.com\/resources<\/loc>\s*<lastmod>2026-11-11<\/lastmod>/);
assert.equal((sitemap.html.match(/<loc>/g) || []).length, new Set([...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])).size);
console.log("Homepage, social profiles, admin robots and resource sitemap verified");
