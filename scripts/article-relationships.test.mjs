import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getArticleRelationshipIssues } from "../src/lib/articleRelationships.ts";

const read = (file) => JSON.parse(readFileSync(new URL(`../src/content/data/${file}.json`, import.meta.url), "utf8"));
const products = read("products");
const applications = read("applications");
const sample = { slug: "example", relatedProductSlugs: [products[0].slug], relatedApplicationSlugs: [applications[0].slug] };

test("all existing published and draft article relationships resolve", () => {
  assert.deepEqual(getArticleRelationshipIssues(read("articles"), products, applications), []);
});
test("empty associations are valid; do not force a product or application", () => {
  assert.deepEqual(getArticleRelationshipIssues([{ ...sample, relatedProductSlugs: [], relatedApplicationSlugs: [] }], products, applications), []);
});
test("incorrect case produces a canonical suggestion, without changing submitted data", () => {
  const article = { ...sample, relatedProductSlugs: ["Liquid-turbine-flowmeter"] };
  const issues = getArticleRelationshipIssues([article], products, applications);
  assert.match(issues[0].message, /Use "liquid-turbine-flowmeter"/);
  assert.deepEqual(article.relatedProductSlugs, ["Liquid-turbine-flowmeter"]);
});
test("unknown products and invented application pages are rejected", () => {
  const issues = getArticleRelationshipIssues([{ ...sample, relatedProductSlugs: ["coriolis-flowmeter"], relatedApplicationSlugs: ["process-automation-flow-measurement"] }], products, applications);
  assert.equal(issues.length, 2);
});
test("malformed article fields are rejected", () => {
  assert.equal(getArticleRelationshipIssues([{ ...sample, relatedApplicationSlugs: "steam-measurement" }], products, applications).length, 1);
  assert.equal(getArticleRelationshipIssues([{ ...sample, relatedProductSlugs: [null] }], products, applications).length, 1);
  assert.throws(() => getArticleRelationshipIssues({}, products, applications));
  assert.throws(() => getArticleRelationshipIssues([null], products, applications));
});
test("validation uses the supplied current catalogues, not a bundled slug allowlist", () => {
  const product = { slug: "new-admin-product" };
  assert.deepEqual(getArticleRelationshipIssues([{ ...sample, relatedProductSlugs: [product.slug] }], [...products, product], applications), []);
  assert.throws(() => getArticleRelationshipIssues([sample], [], applications));
});
