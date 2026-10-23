# Velomac Search Traffic Growth Log

## Baseline

- Reporting window: 2026-09-15 to 2026-10-12
- Site total: 10 clicks, 813 impressions, 1.2% CTR, 28.7 average position
- The site-wide average position is not treated as an individual page ranking.
- A query-by-page GSC export was not available for this implementation. Query-level decisions must be reviewed when that export is available.

## Priority URLs

| URL | Impressions | Clicks | Previous title | Updated title |
|---|---:|---:|---|---|
| `/products/gas-turbine-flowmeter` | 303 | 1 | Gas Turbine Flowmeter for Industrial Gas Measurement \| Velomac | Gas Turbine Flowmeter for Natural Gas \| Velomac |
| `/products/liquid-turbine-flowmeter` | 129 | 0 | Liquid Turbine Flowmeter for Clean Liquid Applications \| Velomac | Liquid Turbine Flowmeter for Clean Liquids \| Velomac |
| `/products/v-cone-flowmeter` | 84 | 0 | V-Cone Flowmeter for Differential Pressure Measurement \| Velomac | V-Cone Differential Pressure Flowmeter \| Velomac |
| `/products/thermal-mass-flowmeter` | 49 | 0 | Thermal Mass Flowmeter for Industrial Gas Measurement \| Velomac | Thermal Mass Flowmeter for Compressed Air \| Velomac |

## Changes Prepared Locally

- Shorter, product-specific titles and descriptions aligned to the reviewed search-intent clusters.
- More specific overview, capability and selection copy without changing approved numeric specifications.
- Curated Resource links for Liquid Turbine, V-Cone and Thermal Mass pages.
- Product-specific Application Review fields for Gas Turbine and V-Cone.
- Product context carried from product-page quote CTAs to the Contact form.
- Gas Flow Calibration now links back to Gas Turbine and Thermal Mass product pages.
- Application-context ALT text no longer implies that generic context images show an exact product model.

## Phase 2 Changes Prepared Locally

- Added product-specific H2 headings to the four priority product pages.
- Added crawlable homepage links to the Gas Turbine and V-Cone product pages; the other priority families remain available through existing cards and the featured vortex module.
- Added reciprocal links from liquid-calibration technology pages to Liquid Turbine and Electromagnetic product pages.
- Restored the previously approved GA4 property (`G-4FBZ89F9LJ`) with one production-only initialization and client-side page-view tracking.
- Connected existing inquiry, application-review and contact interaction events to GA4 while keeping their data-layer records.
- Preserved product context in quote links and application context in application-page quote links.
- Repaired optional quote-form attachments with validated PDF/JPG/PNG/WebP delivery and a 5 MB limit.
- Removed eager loading from a below-the-fold homepage image without changing the image or its presentation.

## Engineering Verification Still Required

- Gas and Liquid Turbine technical rows that currently share identical values.
- Gas Turbine standard versus extended flow-range rows.
- Thermal Mass `Nm/s` velocity unit and DN10 versus DN15 range boundary.
- V-Cone accuracy, straight-run, turndown, beta ratio, Reynolds number, temperature and pressure-loss claims.
- Replacement source images for the watermarked Liquid Turbine and V-Cone hero images.

No unverified numeric specification was changed in this optimization.

## Measurement Checkpoints

Review at 14, 30 and 60 days after production publication:

- Google Search impressions, clicks, CTR and average position by URL.
- Main ranking queries and query-to-page relevance.
- GA4 organic landing-page users.
- Application Review starts and successful submissions.
- Quote-form starts and successful submissions.
- Separate observed changes from normal search fluctuations and seasonality.
