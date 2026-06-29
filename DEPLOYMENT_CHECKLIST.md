# Velomac Deployment Checklist

Last checked: 2026-06-29

## Project

- Framework: Next.js 14.2.35
- UI runtime: React 18.3.1
- Styling: Tailwind CSS
- Package manager: pnpm
- Production build command: `pnpm build`
- Production start command after build: `pnpm start`

## Production Build

- Build command run: `pnpm build`
- Result: Passed
- Build output: `.next`
- Generated app routes: 31
- Product detail pages generated: 11
- Article pages generated: 9
- `robots.txt`: generated
- `sitemap.xml`: generated

## Route Coverage

- Home: checked
- Products overview: checked
- Product detail pages: checked
- Applications: checked
- Resources overview: checked
- Article detail pages: checked
- About: checked
- Contact / Request a Quote: checked

## Asset Checks

- Public image references checked against files in `public/images/`.
- Built article pages checked for missing image references.
- Built product pages checked for missing image references.
- No missing image references found in build output.
- No local user-directory paths found in public-facing source, static HTML preview files, or built app output.
- No local file URL paths found in public-facing source, static HTML preview files, or built app output.

## Public Copy Checks

- Public static preview pages checked for internal workflow wording.
- Built app output checked for internal workflow wording.
- No public-facing references found for PDF extraction notes, unfinished-page notes, local machine paths, or development-only wording.
- Footer location confirmed as: Weihai, China

## Deployment Notes

- Set `NEXT_PUBLIC_SITE_URL` to the final production domain before deployment if the domain is different from `https://www.velomacflowmeter.com`.
- Keep all product, application, About and blog images inside `public/images/` so they are available in production.
- The current contact form is a front-end form. Connect it to the chosen form handling service before relying on production inquiry submissions.

## Current Status

Ready to push to GitHub and deploy, pending final production domain and form handling setup.
