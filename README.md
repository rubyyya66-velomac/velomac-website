# Velomac Flow Meter MVP Website

First MVP website for Velomac Flow Meter, built with Next.js, TypeScript, Tailwind CSS, and structured content files.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

If your environment uses npm instead of pnpm, `npm install` and `npm run dev` also work from the same `package.json`.

## Build

```bash
pnpm build
```

## Deploy

This app can deploy to any standard Next.js host. For Vercel, import the repository and keep the default build command `npm run build`. For Netlify, use build command `npm run build` and publish directory `.next` with the Netlify Next.js runtime.

Set `NEXT_PUBLIC_SITE_URL` to the production domain before launch so `sitemap.xml` contains the final URLs.

## Content Editing

- Product pages: `src/content/products.ts`
- Product image mapping: `src/data/productImages.ts`
- Application sections: `src/content/applications.ts`
- Application image mapping: `src/data/applications.ts`
- Resource cards: `src/content/resources.ts`
- Shared company facts and contact details: `src/content/site.ts`

## Image Replacement

The official Velomac logo was extracted from the supplied brochure and saved under `public/images/brand`.

Product image paths are centralized in `src/data/productImages.ts`. Approved local JPEG product images are copied from `source-assets/velomac-products` into `public/images/products`; original formats are preserved.

To replace a product image later, update the matching file and mapping entry while preserving the real file extension.

Application image slots are in `public/images/applications`. Approved local PNG condition images are copied from `source-assets/conditions`; original formats are preserved.

Hero and factory placeholders are in `public/images/hero` and `public/images/factory`.

See `public/images/README.md` for exact image notes.
See `APPLICATION_IMAGE_BRIEF.md` for application image direction.
See `PRODUCT_IMAGE_SOURCE_REPORT.md` and `IMAGE_ASSET_MANIFEST.md` for image source status.

## TODO

- Verify the exact founding and manufacturing-experience timeline before launch.
- Verify the final English company name before launch.
- Replace the brochure-extracted raster logo with the original transparent logo source file if available.
- Replace closest-match product images with clean watermark-free photography when available.
- Replace the Energy Loss Visibility scene with a dedicated utility metering or energy monitoring image later.
- Replace temporary hero and factory images with final approved photography.
- Replace placeholder article cards with full MDX or structured article pages.
- Confirm all technical data and flow range tables against original datasheets.
