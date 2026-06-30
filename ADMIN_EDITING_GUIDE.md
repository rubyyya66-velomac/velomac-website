# Velomac Admin Editing Guide

The website now has a simple admin editing workflow at `/admin`.

## Required Environment Variables

Set these in Vercel before using the admin page:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=
GITHUB_TOKEN=
GITHUB_REPO=rubyyya66-velomac/velomac-website
GITHUB_BRANCH=main
```

Keep the existing quote form email variables unchanged:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
QUOTE_TO_EMAIL=info@velomacflowmeter.com
```

Do not add these values to source code.

## How Admin Saving Works

The admin edits JSON files under:

`src/content/data/`

When `GITHUB_TOKEN`, `GITHUB_REPO` and `GITHUB_BRANCH` are configured, saving from `/admin` commits the JSON change back to GitHub. Vercel can then redeploy from the GitHub commit.

If GitHub saving is not configured, the admin API only supports local development saves. In production, it will reject the save instead of writing unsafe temporary files.

## Editable Areas

- Site settings: `src/content/data/site.json`
- Homepage: `src/content/data/homepage.json`
- About page: `src/content/data/about.json`
- Products: `src/content/data/products.json`
- Applications: `src/content/data/applications.json`
- Articles / Resources: `src/content/data/articles.json`
- Contact page text: `src/content/data/contact.json`

The public website still reads through the existing TypeScript files in `src/content/`, so page layouts and visual design stay unchanged.

## How To Edit Text

1. Open `/admin`.
2. Sign in with the admin username and password.
3. Choose a content file from the left menu.
4. Edit short text in text fields.
5. Edit longer content in textarea fields.
6. Click `Save Changes`.

## How To Replace An Image

1. Upload the replacement image into the matching public folder, such as:
   - `public/images/homepage/`
   - `public/images/products/`
   - `public/images/applications/`
   - `public/images/blog/`
   - `public/images/about/`
   - `public/images/brand/`
2. In `/admin`, update the image path field.
3. Use public paths such as:

```text
/images/products/vortex-flowmeter.jpg
```

Do not use local computer paths such as `/Users/...`.

## How To Add Or Edit An Article

1. Open `Articles / Resources`.
2. Duplicate an existing article item.
3. Update:
   - `slug`
   - `title`
   - `category`
   - `summary`
   - `description`
   - `excerpt`
   - `coverImage`
   - `coverAlt`
   - `relatedProductSlugs`
   - `relatedApplicationSlugs`
   - `takeaways`
   - `sections`
4. For article body content, edit `sections`, where each section has:
   - `heading`
   - `body`, one paragraph per line

Use the raw JSON editor only for careful structural edits.

## What Not To Touch

Avoid changing:

- `src/app/`
- `src/components/`
- `src/lib/`
- `middleware.ts`
- `package.json`
- `.env` files
- SMTP or GitHub tokens

Do not expose secrets in content JSON.

## Deployment Flow

1. Save content in `/admin`.
2. The admin API commits the JSON file to GitHub.
3. Vercel detects the GitHub commit.
4. Vercel rebuilds and deploys the updated website.

## GitHub Token Setup

Create a fine-grained GitHub token with access only to the Velomac website repository. It needs permission to read and write repository contents.

Set the token only in Vercel environment variables as `GITHUB_TOKEN`.
