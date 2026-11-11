import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";
import { getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { DOMSerializer } from "@tiptap/pm/model";

registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(specifier.startsWith("@/") ? new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href : specifier, context);
} });
const { sanitizeArticleBodyHtml, sanitizeArticleCollection } = await import("../src/lib/richTextSanitizer.ts");
const { wrapArticleTables } = await import("../src/lib/articleBody.ts");
const { articleTableNodes } = await import("../src/components/ArticleTableNodes.ts");
const articles = JSON.parse(readFileSync(new URL("../src/content/data/articles.json", import.meta.url)));
const tableCounts = { "fertilizer-plant-flow-measurement": [3, 3, 8, 11, 11], "mbr-water-reclamation-flow-measurement": [10] };

test("transcribed tables preserve captions, every row, header scope, and the original asset links", () => {
  for (const [slug, rowCounts] of Object.entries(tableCounts)) {
    const article = articles.find(item => item.slug === slug);
    const tables = article.bodyHtml.match(/<table>[\s\S]*?<\/table>/g);
    assert.deepEqual(tables.map(table => (table.match(/<tr>/g) ?? []).length - 1), rowCounts);
    for (const table of tables) {
      assert.match(table, /<caption>[^<]+<\/caption>/);
      assert.match(table, /<th scope="col">/);
      assert.match(table, /<th scope="row">/);
    }
    const saved = sanitizeArticleCollection([article])[0];
    assert.equal(saved.bodyHtml, article.bodyHtml);
    const srcs = [...saved.bodyHtml.matchAll(/href="(\/images\/uploads\/[^"]+)"[^>]*>View original table image:/g)];
    assert.equal(srcs.length, rowCounts.length);
    for (const [, path] of srcs) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)));
    assert.equal((wrapArticleTables(saved.bodyHtml).match(/class="article-table-scroll"/g) ?? []).length, rowCounts.length);
  }
});

test("table tags are narrowly sanitized without accepting styles or event handlers", () => {
  const safe = sanitizeArticleBodyHtml('<table style="position:fixed"><caption onmouseover="alert(1)">Data</caption><tr><th scope="invalid" onclick="alert(1)">Header</th><td><script>alert(1)</script>Cell</td></tr></table>');
  assert.equal(safe, "<table><caption>Data</caption><tr><th>Header</th><td>Cell</td></tr></table>");
});

test("the editor schema preserves captions, cell content, and row header semantics", () => {
  const schema = getSchema([StarterKit, ...articleTableNodes]);
  const { articleTable, articleTableCaption, articleTableRow, articleTableHeader, articleTableCell, paragraph } = schema.nodes;
  const header = articleTableHeader.createChecked({ scope: "row" }, paragraph.create(null, schema.text("Flow")));
  const node = articleTable.createChecked(null, [
    articleTableCaption.create(null, schema.text("Engineering data")),
    articleTableRow.createChecked(null, [header, articleTableCell.createChecked(null, paragraph.create(null, schema.text("10 m³/h")))])
  ]);
  const reopened = schema.nodeFromJSON(JSON.parse(JSON.stringify(node.toJSON())));
  assert.ok(reopened.eq(node));
  assert.equal(reopened.textContent, "Engineering dataFlow10 m³/h");
  const output = DOMSerializer.fromSchema(schema).nodes;
  assert.deepEqual(output.articleTable(node), ["table", 0]);
  assert.deepEqual(output.articleTableHeader(header), ["th", { scope: "row" }, 0]);
});
