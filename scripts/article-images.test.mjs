import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";

// Node 24 can strip our pure TS modules; resolve the same source alias as Next.js.
registerHooks({resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
  return nextResolve(specifier, context);
}});
const {sanitizeArticleBodyHtml, sanitizeArticleCollection} = await import("../src/lib/richTextSanitizer.ts");
const {safeArticleImageSrc, normalizeArticleImage, articleImageSrcSet} = await import("../src/lib/articleImage.ts");
const {validateAdminRasterImage} = await import("../src/lib/adminImageUpload.ts");
const {ArticleImageNode} = await import("../src/components/ArticleImageNode.ts");
const {getSchema} = await import("@tiptap/core");
const {default: StarterKit} = await import("@tiptap/starter-kit");
const {DOMSerializer} = await import("@tiptap/pm/model");
const fixture = JSON.parse(readFileSync(new URL("../src/content/fixtures/article-image-demo.json", import.meta.url)));

test("multiple image placements, ALT, caption, dimensions and presentation survive sanitization and JSON save/reopen", () => {
  const saved = JSON.parse(JSON.stringify(sanitizeArticleCollection([fixture])))[0];
  assert.equal((saved.bodyHtml.match(/<figure /g)||[]).length, 2);
  assert.equal((saved.bodyHtml.match(/<figcaption>/g)||[]).length, 2);
  for (const alt of ["Liquid flow calibration bench", "Comparison graphic showing oscilloscope"]) assert.ok(saved.bodyHtml.includes(`alt="${alt}`));
  assert.ok(saved.bodyHtml.includes('data-width="75" data-align="right"'));
  assert.match(saved.bodyHtml, /width="\d+" height="\d+"/);
  assert.match(saved.bodyHtml, /loading="lazy" decoding="async"/);
  assert.match(saved.bodyHtml, /srcset="\/_next\/image/);
  assert.equal(sanitizeArticleBodyHtml(saved.bodyHtml), saved.bodyHtml);
  for (const key of Object.keys(fixture).filter(key=>key!=="bodyHtml")) assert.deepEqual(saved[key],fixture[key]);
});
test("existing heading, text, formatting, lists and links remain supported", () => {
  const html = sanitizeArticleBodyHtml(fixture.bodyHtml);
  for(const tag of ["h2","h3","p","strong","em","u","mark","ul","ol","li","a","blockquote"]) assert.ok(html.includes(`<${tag}`),tag);
  assert.ok(html.includes("<hr"));
  assert.ok(html.indexOf("<figure") > html.indexOf("technical image between"));
  assert.ok(html.indexOf("The paragraph following") > html.indexOf("</figure>"));
});
test("ALT and caption are independent, editable, escaped text", () => {
  const html = sanitizeArticleBodyHtml('<figure data-article-image="true"><img src="/images/example.jpg" alt="Edited ALT &amp; detail" onerror="alert(1)"><figcaption>Edited caption &lt;script&gt;</figcaption></figure>');
  assert.match(html, /alt="Edited ALT &amp; detail"/);
  assert.match(html, /<figcaption>Edited caption &lt;script&gt;<\/figcaption>/);
  assert.ok(!html.includes("onerror"));
});
test("missing ALT is not generated from a filename; explicit decoration renders empty ALT", () => {
  const html = sanitizeArticleBodyHtml('<img src="/images/technical-file.jpg"><img src="/images/decorative.png" data-decorative="true" alt="should be empty">');
  assert.equal((html.match(/alt=""/g)||[]).length,2);
  assert.equal(normalizeArticleImage({src:"/images/a.jpg",decorative:true,alt:"x"}).alt, "");
});
test("only stable library paths are allowed; no Base64, blob, remote URL, traversal, or forged srcset", () => {
  for(const src of ["data:image/png;base64,xxx","blob:test","https://example.com/a.png","//evil.test/a.png","/images/../evil.png","/images/%2e%2e/evil.png","/images/%5cevil.png","/images/a.png?x=1","/images/%00a.png"]) assert.equal(safeArticleImageSrc(src),"",src);
  const html=sanitizeArticleBodyHtml('<img src="data:image/png;base64,xxx"><img src="/images/a.jpg" srcset="https://evil.test/a.jpg 400w"><script>alert(1)</script>');
  assert.ok(!html.includes("evil.test") && !html.includes("base64") && !html.includes("<script"));
  assert.match(articleImageSrcSet("/images/a.jpg"), /384w/);
  assert.equal(articleImageSrcSet("/images/logo.svg"),"");
});
test("presentation and intrinsic-size values are restricted", () => {
  const attrs=normalizeArticleImage({displayWidth:"999",alignment:"fixed",width:-1,height:Infinity});
  assert.equal(attrs.displayWidth,"100"); assert.equal(attrs.alignment,"center"); assert.equal(attrs.width,null); assert.equal(attrs.height,null);
  const html=sanitizeArticleBodyHtml('<figure data-article-image="true" data-width="evil" style="position:fixed"><img src="/images/a.png" width="-1" height="999999"></figure>');
  assert.ok(!html.includes("position:") && !html.includes('width="-1"') && !html.includes('height="999999"'));
});
test("image node is a selectable block with lossless attributes, rather than a cover-field or paragraph hack", () => {
  const schema=getSchema([StarterKit,ArticleImageNode]);
  const attrs=normalizeArticleImage({src:"/images/a.jpg",alt:"One image",caption:"Its caption",width:640,height:480,displayWidth:"50",alignment:"left"});
  const node=schema.nodes.articleImage.create(attrs);
  assert.equal(node.isBlock,true); assert.equal(node.isAtom,true); assert.equal(node.type.spec.selectable,true);
  assert.deepEqual(schema.nodeFromJSON(JSON.parse(JSON.stringify(node.toJSON()))).attrs,node.attrs);
  const output=DOMSerializer.fromSchema(schema).nodes.articleImage(node);
  assert.equal(output[0],"figure"); assert.equal(output[1]["data-width"],"50"); assert.equal(output[2][0],"img"); assert.equal(output[2][1].alt,"One image"); assert.equal(output[3][0],"figcaption");
});
test("raster upload validation accepts actual JPEG/PNG/WebP without modifying source bytes", async () => {
  for(const format of ["jpeg","png","webp"]) {
    const buffer=await sharp({create:{width:120,height:80,channels:3,background:"blue"}}).toFormat(format).toBuffer();
    const before=Buffer.from(buffer);
    assert.deepEqual(await validateAdminRasterImage(`test.${format}`,`image/${format}`,buffer),{width:120,height:80});
    assert.deepEqual(buffer,before);
  }
});
test("raster validation rejects forged type, corrupt, zero-byte, and oversized uploads", async () => {
  const png=await sharp({create:{width:5,height:5,channels:3,background:"white"}}).png().toBuffer();
  for(const args of [["fake.jpg","image/jpeg",png],["fake.png","image/jpeg",png],["fake.png","image/png",Buffer.from("not an image")],["empty.png","image/png",Buffer.alloc(0)],["large.png","image/png",Buffer.alloc(5*1024*1024+1)]]) await assert.rejects(validateAdminRasterImage(...args));
});
test("current article data is not mutated by rendering or the image feature", () => {
  const path=fileURLToPath(new URL("../src/content/data/articles.json",import.meta.url));
  const before=readFileSync(path,"utf8");
  const articles=JSON.parse(before);
  for(const article of articles) {
    const copy=JSON.stringify(article);
    sanitizeArticleBodyHtml(article.bodyHtml||"");
    assert.equal(JSON.stringify(article),copy);
  }
  assert.equal(readFileSync(path,"utf8"),before);
  const saved = sanitizeArticleCollection([...articles,fixture],articles);
  assert.deepEqual(saved.slice(0,articles.length),articles);
  const reordered=articles.map(article=>Object.fromEntries(Object.entries(article).reverse()));
  assert.deepEqual(sanitizeArticleCollection(reordered,articles),articles);
});
