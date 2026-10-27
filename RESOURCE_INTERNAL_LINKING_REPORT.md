# Resource Internal Linking Review

Date: 2026-10-27. Project: `/Users/rubyli/Documents/web`. Baseline commit: `ca2908c`.

Local implementation only; no commit, push or deployment was performed for this change.

## Audit and linking map

The eight existing routes were verified against the published article data and `generateStaticParams()` in `src/app/resources/[slug]/page.tsx`. All eight had no contextual incoming links in the baseline rendered static pages when excluding the `/resources` listing and global navigation. Existing product/application links were mostly in the related-content sidebar; the original inline bodies had none, apart from the calibration article's existing absolute link to Flow Calibration Systems. That link was retained.

Product pages use curated resource lists that excluded these newer articles. Application pages selected only three older articles. The implementation extends those existing lists without removing their previous recommendations. Body links are placed beside the relevant discussion, using the existing article link styling.

| Resource | Verified URL | Contextual source pages before → after | Relationship |
|---|---|---|---|
| DLE Brine Flow Measurement: Turning Direct Lithium Extraction Into a Controlled Continuous Process | [/resources/dle-brine-flow-measurement](http://localhost:3001/resources/dle-brine-flow-measurement) | 0 → 3 | Conductive brine, chemical compatibility and separate process-stream boundaries; suitability remains conditional. |
| Hydrogen Flowmeter Selection for 10% to 100% Electrolyzer Load | [/resources/hydrogen-flowmeter-selection-electrolyzer-load](http://localhost:3001/resources/hydrogen-flowmeter-selection-electrolyzer-load) | 0 → 3 | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |
| 548,000 bpd of Gross Fluids Is Not One Flow: Produced Water Flow Measurement After Separation | [/resources/produced-water-flow-measurement-after-separation](http://localhost:3001/resources/produced-water-flow-measurement-after-separation) | 0 → 3 | Separated conductive-water duty, material compatibility and stream-specific sizing. |
| Mine Water Flow Measurement: Below 2 ppb Selenium, But How Much Actually Leaves the Plant? | [/resources/mine-water-flow-selenium-load](http://localhost:3001/resources/mine-water-flow-selenium-load) | 0 → 3 | Water discharge boundary, matching volume and concentration periods, and conditional full-pipe measurement. |
| Reclaimed Water Flowmeter Sizing: Does Every DN500 Section Carry 24,400 t/day? | [/resources/reclaimed-water-flowmeter-sizing-dn500](http://localhost:3001/resources/reclaimed-water-flowmeter-sizing-dn500) | 0 → 4 | Branch location and minimum/normal/peak flow complement the conductivity and material review. |
| Industrial Off-Gas Flow Measurement for Fermentation: What Does the Fermenter Actually Receive? | [/resources/industrial-off-gas-fermentation-flow-measurement](http://localhost:3001/resources/industrial-off-gas-fermentation-flow-measurement) | 0 → 3 | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |
| Flowmeter Calibration Record: How to Match It to the Meter Being Shipped | [/resources/flowmeter-calibration-record-verification](http://localhost:3001/resources/flowmeter-calibration-record-verification) | 0 → 3 | Instrument identification, calibration scope, quality evidence and dispatch verification. |
| Steam Flow Measurement: Can 75 t/h from 12 to 4 Bar Deliver 13.5 MW? | [/resources/steam-flow-measurement-turbine-power-check](http://localhost:3001/resources/steam-flow-measurement-turbine-power-check) | 0 → 3 | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |

Counts are unique contextual source pages, not repeated links or the listing hub. Sources include product/application lists and related article prose. The DN500 article has four sources; each other target has three.

## Complete link changes, grouped by source

There are 53 new link placements: 7 product recommendations, 7 application recommendations, 1 quality-evidence link and 38 inline article links. Recommendation rows retain their category and CTA decorations; the article title below is the descriptive anchor within that existing row.

### /products/vortex-flowmeter

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/steam-flow-measurement-turbine-power-check](http://localhost:3001/resources/steam-flow-measurement-turbine-power-check) | Steam Flow Measurement: Can 75 t/h from 12 to 4 Bar Deliver 13.5 MW? | Existing Related Resources list | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |

### /products/electromagnetic-flowmeter

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/dle-brine-flow-measurement](http://localhost:3001/resources/dle-brine-flow-measurement) | DLE Brine Flow Measurement: Turning Direct Lithium Extraction Into a Controlled Continuous Process | Existing Related Resources list | Conductive brine, chemical compatibility and separate process-stream boundaries; suitability remains conditional. |
| [/resources/produced-water-flow-measurement-after-separation](http://localhost:3001/resources/produced-water-flow-measurement-after-separation) | 548,000 bpd of Gross Fluids Is Not One Flow: Produced Water Flow Measurement After Separation | Existing Related Resources list | Separated conductive-water duty, material compatibility and stream-specific sizing. |
| [/resources/reclaimed-water-flowmeter-sizing-dn500](http://localhost:3001/resources/reclaimed-water-flowmeter-sizing-dn500) | Reclaimed Water Flowmeter Sizing: Does Every DN500 Section Carry 24,400 t/day? | Existing Related Resources list | Branch location and minimum/normal/peak flow complement the conductivity and material review. |

### /products/ultrasonic-flowmeter

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/mine-water-flow-selenium-load](http://localhost:3001/resources/mine-water-flow-selenium-load) | Mine Water Flow Measurement: Below 2 ppb Selenium, But How Much Actually Leaves the Plant? | Existing Related Resources list | Water discharge boundary, matching volume and concentration periods, and conditional full-pipe measurement. |

### /products/thermal-mass-flowmeter

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/hydrogen-flowmeter-selection-electrolyzer-load](http://localhost:3001/resources/hydrogen-flowmeter-selection-electrolyzer-load) | Hydrogen Flowmeter Selection for 10% to 100% Electrolyzer Load | Existing Related Resources list | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |
| [/resources/industrial-off-gas-fermentation-flow-measurement](http://localhost:3001/resources/industrial-off-gas-fermentation-flow-measurement) | Industrial Off-Gas Flow Measurement for Fermentation: What Does the Fermenter Actually Receive? | Existing Related Resources list | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |

### /applications/steam-measurement

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/steam-flow-measurement-turbine-power-check](http://localhost:3001/resources/steam-flow-measurement-turbine-power-check) | Steam Flow Measurement: Can 75 t/h from 12 to 4 Bar Deliver 13.5 MW? | Existing Related Resources list | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |

### /applications/gas-flow-measurement

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/hydrogen-flowmeter-selection-electrolyzer-load](http://localhost:3001/resources/hydrogen-flowmeter-selection-electrolyzer-load) | Hydrogen Flowmeter Selection for 10% to 100% Electrolyzer Load | Existing Related Resources list | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |
| [/resources/industrial-off-gas-fermentation-flow-measurement](http://localhost:3001/resources/industrial-off-gas-fermentation-flow-measurement) | Industrial Off-Gas Flow Measurement for Fermentation: What Does the Fermenter Actually Receive? | Existing Related Resources list | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |

### /applications/conductive-liquid-measurement

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/produced-water-flow-measurement-after-separation](http://localhost:3001/resources/produced-water-flow-measurement-after-separation) | 548,000 bpd of Gross Fluids Is Not One Flow: Produced Water Flow Measurement After Separation | Existing Related Resources list | Separated conductive-water duty, material compatibility and stream-specific sizing. |
| [/resources/mine-water-flow-selenium-load](http://localhost:3001/resources/mine-water-flow-selenium-load) | Mine Water Flow Measurement: Below 2 ppb Selenium, But How Much Actually Leaves the Plant? | Existing Related Resources list | Water discharge boundary, matching volume and concentration periods, and conditional full-pipe measurement. |
| [/resources/reclaimed-water-flowmeter-sizing-dn500](http://localhost:3001/resources/reclaimed-water-flowmeter-sizing-dn500) | Reclaimed Water Flowmeter Sizing: Does Every DN500 Section Carry 24,400 t/day? | Existing Related Resources list | Branch location and minimum/normal/peak flow complement the conductivity and material review. |

### /applications/chemical-process-lines

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/dle-brine-flow-measurement](http://localhost:3001/resources/dle-brine-flow-measurement) | DLE Brine Flow Measurement: Turning Direct Lithium Extraction Into a Controlled Continuous Process | Existing Related Resources list | Conductive brine, chemical compatibility and separate process-stream boundaries; suitability remains conditional. |

### /quality-innovation

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/flowmeter-calibration-record-verification](http://localhost:3001/resources/flowmeter-calibration-record-verification) | Flowmeter Calibration Record: How to Match It to the Meter Being Shipped | Existing Related Engineering Evidence links | Instrument identification, calibration scope, quality evidence and dispatch verification. |

### /resources/dle-brine-flow-measurement

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/products/electromagnetic-flowmeter](http://localhost:3001/products/electromagnetic-flowmeter) | electromagnetic measurement | Review Materials and Linings | Conductive brine, chemical compatibility and separate process-stream boundaries; suitability remains conditional. |
| [/applications/chemical-process-lines](http://localhost:3001/applications/chemical-process-lines) | Chemical dosing lines | Confirm Brine and Chemical Properties | Conductive brine, chemical compatibility and separate process-stream boundaries; suitability remains conditional. |
| [/resources/produced-water-flow-measurement-after-separation](http://localhost:3001/resources/produced-water-flow-measurement-after-separation) | Produced Water Flow Measurement After Separation | Map the Entire Liquid Balance | Separated conductive-water duty, material compatibility and stream-specific sizing. |

### /resources/hydrogen-flowmeter-selection-electrolyzer-load

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/products/thermal-mass-flowmeter](http://localhost:3001/products/thermal-mass-flowmeter) | Thermal Mass Flowmeter | Which Velomac Products May Be Relevant? / Thermal Mass Flowmeter | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |
| [/products/v-cone-flowmeter](http://localhost:3001/products/v-cone-flowmeter) | V-Cone Flowmeter | Which Velomac Products May Be Relevant? / V-Cone Flowmeter | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |
| [/applications/gas-flow-measurement](http://localhost:3001/applications/gas-flow-measurement) | Gas Flow Measurement | Actual Flow and Standard Flow Need a Clear Basis | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |
| [/resources/lng-feed-gas-composition-flow-measurement-review](http://localhost:3001/resources/lng-feed-gas-composition-flow-measurement-review) | Gas Flow Measurement After LNG Feed Composition Changes | Thermal Mass Flowmeter / gas composition | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |

### /resources/produced-water-flow-measurement-after-separation

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/products/electromagnetic-flowmeter](http://localhost:3001/products/electromagnetic-flowmeter) | Electromagnetic Flowmeter | Which Approved Velomac Products May Be Relevant? | Separated conductive-water duty, material compatibility and stream-specific sizing. |
| [/applications/conductive-liquid-measurement](http://localhost:3001/applications/conductive-liquid-measurement) | conductive liquid | Produced Water Needs Its Own Medium Review | Separated conductive-water duty, material compatibility and stream-specific sizing. |
| [/resources/mine-water-flow-selenium-load](http://localhost:3001/resources/mine-water-flow-selenium-load) | Mine Water Flow Measurement | Define the Measurement Purpose First | Water discharge boundary, matching volume and concentration periods, and conditional full-pipe measurement. |

### /resources/mine-water-flow-selenium-load

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/applications/conductive-liquid-measurement](http://localhost:3001/applications/conductive-liquid-measurement) | conductive mine water or treated water | How Mine Water Flow Measurement Affects Flowmeter Selection / Electromagnetic Flowmeter | Water discharge boundary, matching volume and concentration periods, and conditional full-pipe measurement. |
| [/products/electromagnetic-flowmeter](http://localhost:3001/products/electromagnetic-flowmeter) | Electromagnetic Flowmeter | How Mine Water Flow Measurement Affects Flowmeter Selection / Electromagnetic Flowmeter | Water discharge boundary, matching volume and concentration periods, and conditional full-pipe measurement. |
| [/products/ultrasonic-flowmeter](http://localhost:3001/products/ultrasonic-flowmeter) | Ultrasonic Flowmeter | How Mine Water Flow Measurement Affects Flowmeter Selection / Ultrasonic Flowmeter | Water discharge boundary, matching volume and concentration periods, and conditional full-pipe measurement. |
| [/resources/reclaimed-water-flowmeter-sizing-dn500](http://localhost:3001/resources/reclaimed-water-flowmeter-sizing-dn500) | DN500 Reclaimed Water Flowmeter Sizing | Start With the Measurement Purpose | Branch location and minimum/normal/peak flow complement the conductivity and material review. |

### /resources/reclaimed-water-flowmeter-sizing-dn500

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/applications/conductive-liquid-measurement](http://localhost:3001/applications/conductive-liquid-measurement) | conductive reclaimed water | Water Conditions Matter for Electromagnetic Flowmeter Selection | Branch location and minimum/normal/peak flow complement the conductivity and material review. |
| [/products/electromagnetic-flowmeter](http://localhost:3001/products/electromagnetic-flowmeter) | Electromagnetic Flowmeter | Water Conditions Matter for Electromagnetic Flowmeter Selection | Branch location and minimum/normal/peak flow complement the conductivity and material review. |
| [/resources/reclaimed-water-flowmeter-selection-conductivity](http://localhost:3001/resources/reclaimed-water-flowmeter-selection-conductivity) | Reclaimed Water Flowmeter Selection: Recheck Conductivity as Water Gets Cleaner | Water Conditions Matter for Electromagnetic Flowmeter Selection | Branch location and minimum/normal/peak flow complement the conductivity and material review. |

### /resources/industrial-off-gas-fermentation-flow-measurement

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/products/thermal-mass-flowmeter](http://localhost:3001/products/thermal-mass-flowmeter) | Thermal Mass Flowmeter | Which Approved Velomac Products May Be Relevant? / Thermal Mass Flowmeter | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |
| [/products/liquid-turbine-flowmeter](http://localhost:3001/products/liquid-turbine-flowmeter) | Liquid Turbine Flowmeter | Which Approved Velomac Products May Be Relevant? / Liquid Turbine Flowmeter | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |
| [/applications/gas-flow-measurement](http://localhost:3001/applications/gas-flow-measurement) | Gas Flow Measurement | What Does Nm³/h Mean in This Application? | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |
| [/resources/blast-furnace-gas-flow-measurement](http://localhost:3001/resources/blast-furnace-gas-flow-measurement) | Blast Furnace Gas Flow Measurement | Raw Off-Gas Measurement | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |

### /resources/flowmeter-calibration-record-verification

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/technology/master-meter-liquid-calibration](http://localhost:3001/technology/master-meter-liquid-calibration) | Master-Meter Liquid Calibration | How Velomac Approaches Calibration and Order Verification | Instrument identification, calibration scope, quality evidence and dispatch verification. |
| [/technology/gravimetric-liquid-calibration](http://localhost:3001/technology/gravimetric-liquid-calibration) | Gravimetric Liquid Calibration | How Velomac Approaches Calibration and Order Verification | Instrument identification, calibration scope, quality evidence and dispatch verification. |
| [/quality-innovation](http://localhost:3001/quality-innovation) | Quality & Innovation | How Velomac Approaches Calibration and Order Verification | Instrument identification, calibration scope, quality evidence and dispatch verification. |
| [/resources/flowmeter-number-proven](http://localhost:3001/resources/flowmeter-number-proven) | Before You Approve the Flowmeter, Ask How the Number Was Proven | Does the Calibration Record Cover the Required Flow Range? | Instrument identification, calibration scope, quality evidence and dispatch verification. |

### /resources/steam-flow-measurement-turbine-power-check

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/products/vortex-flowmeter](http://localhost:3001/products/vortex-flowmeter) | Vortex Flowmeter | Which Velomac Flowmeters May Be Relevant? | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |
| [/products/swirl-flowmeter](http://localhost:3001/products/swirl-flowmeter) | Swirl Flowmeter | Which Velomac Flowmeters May Be Relevant? | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |
| [/products/v-cone-flowmeter](http://localhost:3001/products/v-cone-flowmeter) | V-Cone Flowmeter | Which Velomac Flowmeters May Be Relevant? | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |
| [/products/balanced-differential-pressure-flowmeter](http://localhost:3001/products/balanced-differential-pressure-flowmeter) | Balanced Differential Pressure Flowmeter | Which Velomac Flowmeters May Be Relevant? | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |
| [/applications/steam-measurement](http://localhost:3001/applications/steam-measurement) | Steam Measurement | Check Steam State Before Flowmeter Selection | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |
| [/resources/waste-to-energy-steam-flow](http://localhost:3001/resources/waste-to-energy-steam-flow) | Waste-to-Energy Steam Flow Measurement | What Steam Flow Measurement Can Confirm | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |
| [/resources/flowmeter-calibration-record-verification](http://localhost:3001/resources/flowmeter-calibration-record-verification) | calibration records | From Measurement Specification to Site Delivery / Agree on calibration and documentation | Instrument identification, calibration scope, quality evidence and dispatch verification. |

### /resources/slurry-flowmeter-selection-precipitation

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/dle-brine-flow-measurement](http://localhost:3001/resources/dle-brine-flow-measurement) | DLE Brine Flow Measurement | Material compatibility | Conductive brine, chemical compatibility and separate process-stream boundaries; suitability remains conditional. |

### /resources/lng-feed-gas-composition-flow-measurement-review

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/hydrogen-flowmeter-selection-electrolyzer-load](http://localhost:3001/resources/hydrogen-flowmeter-selection-electrolyzer-load) | Hydrogen Flowmeter Selection for 10% to 100% Electrolyzer Load | Flow envelope and composition envelope | Hydrogen composition, flow basis and the full operating envelope; no universal hydrogen suitability claim. |

### /resources/reclaimed-water-flowmeter-selection-conductivity

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/reclaimed-water-flowmeter-sizing-dn500](http://localhost:3001/resources/reclaimed-water-flowmeter-sizing-dn500) | Reclaimed Water Flowmeter Sizing: Does Every DN500 Section Carry 24,400 t/day? | Why Minimum, Normal, and Peak Flow All Matter | Branch location and minimum/normal/peak flow complement the conductivity and material review. |

### /resources/blast-furnace-gas-flow-measurement

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/industrial-off-gas-fermentation-flow-measurement](http://localhost:3001/resources/industrial-off-gas-fermentation-flow-measurement) | Industrial Off-Gas Flow Measurement for Fermentation | Gas flow and downstream use | Conditioned gas quantity and composition; ethanol transfer remains a separate clean-liquid duty. |

### /resources/waste-to-energy-steam-flow

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/steam-flow-measurement-turbine-power-check](http://localhost:3001/resources/steam-flow-measurement-turbine-power-check) | Steam Flow Measurement: Can 75 t/h from 12 to 4 Bar Deliver 13.5 MW? | Where the Energy Measurement Boundary Appears / Turbine Steam | Dry-steam suitability, measurement boundaries, steam state, flow range and energy-output checks. |

### /resources/flowmeter-number-proven

| Destination | Anchor text | Placement | Why this link fits |
|---|---|---|---|
| [/resources/flowmeter-calibration-record-verification](http://localhost:3001/resources/flowmeter-calibration-record-verification) | Flowmeter Calibration Record: How to Match It to the Meter Being Shipped | How calibration context supports selection | Instrument identification, calibration scope, quality evidence and dispatch verification. |

## Routing and content gaps

- No target lacked suitable contextual inbound sources.
- There are no separate Oil & Gas, Mining, Water Treatment & Reuse, Hydrogen or Off-Gas application pages in the current six-page application set. Related paths use the verified Conductive Liquid Measurement, Chemical Process Lines, Gas Flow Measurement and Steam Measurement pages where their content fits; no new application route was invented.
- Existing legacy application tags are resolved through the current alias helper. The Balanced DP product reference resolves to `/products/balanced-differential-pressure-flowmeter`. Neither alias behavior nor destination URLs were changed.
- The calibration article prioritizes Flow Calibration Systems (existing link), Master-Meter Liquid Calibration, Gravimetric Liquid Calibration and Quality & Innovation. Existing product associations remain; no unrelated product recommendation was added.

## Validation

- `pnpm exec tsc --noEmit`: passed.
- `pnpm run build`: passed; 88 Next.js route entries generated.
- `node scripts/phase2-audit.mjs http://localhost:3001 /private/tmp/velomac-resource-phase2-audit.json`: passed across 82 public pages and 82 internal targets. Zero broken links, redirecting internal links, orphan pages, weakly linked pages or schema relationship problems. Sitemap includes all 82 public routes with no missing, unexpected or duplicate entries.
- All 38 new inline links appear in the rendered article bodies as ordinary crawlable `<a href>` elements; no `nofollow` added.
- All original article paragraphs, headings, lists and existing hyperlinks were compared with the baseline and retained in their original order. All non-body article fields, including metadata, dates, related associations and image fields, are unchanged across all 42 articles.
- Desktop (1440px): product recommendations render in the existing resource list.
- Mobile (390px): application and product recommendation disclosures expand; the new links are visible and clickable. Conductive Liquid application → Mine Water resource → Ultrasonic product was followed successfully. Article body links remain visible at this width, and the checked pages have no horizontal overflow.
- Existing homepage, `/resources` listing, navigation, global styling, images, forms/backend, GA/GTM, sitemap source, canonical generation and structured-data implementation were not modified.

## Preview and changed files

Preview command: `pnpm exec next start -p 3001` from `/Users/rubyli/Documents/web`.

- [Electromagnetic product recommendations](http://localhost:3001/products/electromagnetic-flowmeter#resources)
- [Conductive Liquid application recommendations](http://localhost:3001/applications/conductive-liquid-measurement)
- [Calibration record article](http://localhost:3001/resources/flowmeter-calibration-record-verification)

Changed implementation files:

- `src/app/products/[slug]/page.tsx`: relevant curated resource recommendations.
- `src/app/applications/[slug]/page.tsx`: relevant additions appended to existing recommendations.
- `src/content/data/articles.json`: links in the eight targets and six related source articles.
- `src/content/data/quality-innovation.json`: one link in the existing evidence list.
- `RESOURCE_INTERNAL_LINKING_REPORT.md`: this audit and complete link map.

