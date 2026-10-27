# SEO / GEO targeted repairs — 2026-10-27

Project: `/Users/rubyli/Documents/web`. Baseline: `1a8214f`.
These repairs were first verified locally without deployment. The user subsequently authorized production release on 2026-10-27. Release status is confirmed separately in the deployment handoff.

## 1. Resource relationship integrity

- Reviewed all 43 articles against the 11 current products and six applications.
- Removed unresolved references in 31 articles. Removed industry labels only from page-relationship fields, not from article text or resource categories.
- Canonicalized supported legacy aliases and deduplicated the resulting lists in 34 articles in total (three had valid aliases only).
- Preserved the set of existing resolvable associations. Corrected `Liquid-turbine-flowmeter` to `liquid-turbine-flowmeter` in the DN50 article, restoring that product recommendation.
- Did not invent pages for Coriolis, metal-tube rotameter, mining, process automation, pharmaceutical utilities, food and beverage, data-center cooling or industrial decarbonization.
- The generic DN50 compatibility article has no forced application association: none of the six current application-specific pages is established by that article's generic configuration example.

## 2. DN50 contextual links

Destination: `/resources/dn50-flowmeter-flange-compatibility`.

| Source | Placement | Anchor |
|---|---|---|
| `/resources/flowmeter-quote-site-details` | After the flow-range / connection / installation checklist paragraph | DN50 Flowmeter Flange Compatibility: What to Confirm Before Manufacturing |
| `/resources/retrofit-flowmeter-pipe-photos` | After the close-photo / flange / insulation paragraph | DN50 Flowmeter Flange Compatibility |
| `/resources/flowmeter-calibration-record-verification` | Beside the order-documentation and physical-configuration discussion | DN50 Flowmeter Flange Compatibility |

The DN50 article also links its existing “Calibration or test records” wording back to `/resources/flowmeter-calibration-record-verification`.

## 3. Verified primary-source evidence

- Produced-water article: [SLB's Bisat-B expansion announcement](https://investorcenter.slb.com/news-releases/news-release-details/slb-awarded-major-contract-oqep-integrated-facility-expansion), dated 23 September 2026, confirms 548,000 barrels/day as gross-fluids handling capacity, not a produced-water meter sizing value. Added the source beside the figure and separated external project background from Velomac engineering analysis.
- Mine-water article: [BQE Water's Kemess restart announcement](https://bqewater.com/press-release/bqe-water-restarts-operates-selen-ix-wtp-kemess/), dated 24 September 2026, reports results received as of 14 September below the detection limit of less than 2 ppb. Added the source beside the result and the same external-project distinction.
- Both external citations use normal HTTPS links, with `target="_blank"` and `rel="noopener noreferrer"`.
- These are the two source gaps verified and repaired in this round. This is not a claim that all external project facts across all 43 articles have now been independently verified.

## 4. Prevention

- New pure validator: `src/lib/articleRelationships.ts`.
- Authenticated article saves validate against the current editable product/application catalogues, using the existing content-loading path.
- Unknown and case-mismatched references return HTTP 400 with article, field and correction guidance before any save is attempted. Malformed relationship fields are rejected; empty lists are allowed.
- Admin editor includes guidance on exact slugs and not inventing associations.
- Six automated tests cover the current collection, empty lists, case errors, nonexistent routes, malformed inputs and newly supplied catalogue entries.
- Authentication, HTML sanitization and the existing successful-save workflow remain in place.

## 5. Scope preserved

- Original text, headings, lists and old body links retained in order across all 43 articles.
- Six bodies changed by adding source/context paragraphs or wrapping existing words with a link.
- Titles, descriptions, dates, canonical generation, structured data, product/application/resource URLs, images, navigation, homepage, footer, GA/GTM and lead handling were not changed.
- SEO-title editing, reviewer/date workflows, IndexNow activation and new case-study production are not included in this first-priority repair round.

## Local review

Validation completed:

- `pnpm exec tsc --noEmit`: passed.
- `pnpm run build`: passed, 89 generated Next.js route entries.
- `node --test scripts/article-relationships.test.mjs`: all six tests passed (local Node 24).
- Architecture crawl: 83 public pages / 83 internal targets; zero broken, redirecting, orphan or weakly linked pages; sitemap complete with no duplicates; no checked schema relationship problems.
- Metadata crawl: 83 pages; zero reported problems or duplicate titles/descriptions.
- Original-text comparison: all 43 articles retained original paragraph/heading text and existing body links in order; all fields outside the two relationship lists and six edited bodies are unchanged.
- Browser: quote-checklist → DN50 navigation works; Liquid Turbine recommendation is present; both official-source notes and URLs render; checked narrow mobile pages have no horizontal overflow.

Command: `pnpm exec next start -p 3001` from the current project.

- [DN50 article](http://localhost:3001/resources/dn50-flowmeter-flange-compatibility)
- [Produced-water source note](http://localhost:3001/resources/produced-water-flow-measurement-after-separation)
- [Mine-water source note](http://localhost:3001/resources/mine-water-flow-selenium-load)
