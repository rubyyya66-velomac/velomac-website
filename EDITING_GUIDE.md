# Velomac Editing Guide

This website is prepared so normal text, image paths and a few safe style values can be edited without touching the page layout.

## 1. Edit Homepage Text

Edit:

`src/content/homepage.ts`

This file controls the homepage hero, trust points, site condition section, product preview copy, application preview heading, Why Velomac stats, resources preview and bottom CTA.

## 2. Edit Product Text

Edit:

`src/content/products.ts`

Each product has a slug, name, category, short description, overview, image path, typical media, applications, available types, technical data, flow range and SEO text.

## 3. Edit Application Text

Edit:

`src/content/applications.ts`

Each application has a title, short description, image path, recommended meters and site details to prepare.

## 4. Edit Article Text

Edit:

`src/content/articles.json`

Each article includes title, slug, category, summary, intro, cover image, body sections, related products, related applications and key points.

`src/content/articles.ts` reads this JSON file for the website.

## 5. Edit About Page Text

Edit:

`src/content/about.ts`

This file controls the About hero, company profile, stats, process context, capabilities, calibration section and final CTA.

## 6. Edit Email and WhatsApp

Edit:

`src/content/site.ts`

Change `email` and `whatsapp`.

## 7. Edit Footer Location

Edit:

`src/content/site.ts`

Change `location`. The current footer location is `Weihai, China`.

## 8. Replace Images

Use website image folders only:

- `public/images/homepage/`
- `public/images/products/`
- `public/images/applications/`
- `public/images/blog/`
- `public/images/about/`
- `public/images/brand/`

Then update the matching image path in:

- Homepage images: `src/content/homepage.ts`
- Product images: `src/content/products.ts`
- Application images: `src/content/applications.ts`
- Blog/article images: `src/content/articles.json`
- About images: `src/content/about.ts`
- Logo paths: `src/content/site.ts`

Use paths like `/images/products/vortex-flowmeter.jpg`.

## 9. Adjust Hero Headline Size

Edit:

`src/styles/editable-tokens.css`

Change:

`--editable-hero-headline-size`

Keep it as a `clamp()` value so desktop and mobile remain balanced.

## 10. Adjust Hero Image Size

Edit:

`src/styles/editable-tokens.css`

Change:

- `--editable-hero-image-max-width`
- `--editable-hero-image-panel-aspect`

## 11. Adjust Brand Blue Color

Edit:

`src/styles/editable-tokens.css`

Change:

- `--editable-main-brand-blue`
- `--editable-main-brand-blue-rgb`
- `--editable-main-brand-blue-dark`
- `--editable-supporting-blue`

Keep the hex and RGB values matched when changing the main brand blue.

## 12. Files to Avoid Touching

Avoid editing these unless a developer is helping:

- `src/app/`
- `src/components/`
- `src/types/`
- `tailwind.config.ts`
- `next.config.mjs`
- `package.json`
- `.next/`

These files control layout, rendering, routing or build behavior.

## 13. Preview Locally

Run:

`pnpm dev`

Then open the local address shown in the terminal.

For the existing static preview files, open:

`velomac-preview.html`

## 14. Run the Build Check

Run:

`pnpm build`

If it passes, the Next.js site is ready for deployment review.

## 15. Future Admin CMS Readiness

The content is now organized so a future Git-based admin system can edit:

- Pages through `src/content/homepage.ts`, `src/content/about.ts` and `src/content/contact.ts`
- Products through `src/content/products.ts`
- Applications through `src/content/applications.ts`
- Articles through `src/content/articles.json`
- Images through `public/images/`
- Safe style tokens through `src/styles/editable-tokens.css`

Do not install or configure an admin CMS until the deployment platform and editing workflow are confirmed.
