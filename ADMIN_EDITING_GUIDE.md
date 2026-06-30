# Velomac Admin Editing Guide

The website has a simple editing area at `/admin` for small content updates.

## How To Log In

1. Open `/admin` on the website.
2. Enter the admin username and password.
3. After login, choose the section you want to edit from the left menu.

If the page says admin login is not configured, set these environment variables in Vercel:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=
```

Use a strong password. Do not put passwords in source code.

## Local Testing

For a quick local test, run:

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD=admin-test pnpm dev
```

Then open:

```text
http://localhost:3000/admin
```

Use:

```text
Username: admin
Password: admin-test
```

These local test values are only for previewing the admin workflow on your computer.

## What You Can Edit

- Site Settings: company email, WhatsApp, footer text, logo paths and navigation labels.
- Homepage: hero text, button text, trust points, product preview text, image paths and bottom CTA.
- About: company profile text, stats, capability text, image paths and SEO.
- Products: product names, descriptions, image paths, SEO text, tables and related applications.
- Applications: application titles, descriptions, recommended meters, details to send and image paths.
- Articles / Resources: article titles, summaries, cover images, body sections and related links.
- Contact: contact page intro, form labels, helper text and messages.
- Media Library: upload reusable website images and copy public image paths.

## How To Edit Text

1. Open `/admin`.
2. Log in.
3. Choose a section, such as `Homepage`.
4. Edit short fields in the single-line inputs.
5. Edit longer paragraphs in the larger text areas.
6. Click `Save Changes`.

## How To Edit Products Or Applications

1. Choose `Products` or `Applications`.
2. Find the product or application card by its title.
3. Edit the title, description, SEO text, related items or image path.
4. Use `Duplicate` only when adding a similar new item.
5. Use `Remove` carefully.
6. Click `Save Changes`.

## How To Edit Articles

1. Choose `Articles / Resources`.
2. Open the article item you want to edit.
3. Update the article title, excerpt, summary, cover image and sections.
4. For the article body, edit section headings and paragraph lines.
5. Use `Generate Slug From Title` if you want the slug to follow the article title.
6. Check the article preview panel.
7. Click `Save Changes`.

## How To Add An Article

1. Choose `Articles / Resources`.
2. Click `Add Article`.
3. Update:
   - Article Title
   - Slug
   - Category
   - Publishing Status
   - Article Excerpt
   - Summary
   - SEO Description
   - Cover Image
   - Article Body
   - Related Product Slugs
   - Related Application Slugs
4. Keep the article as `Draft` until it is ready.
5. Change status to `Published` when it should appear on the public Resources page.
6. Click `Save Changes`.

You can also use `Duplicate` to copy a similar article, then rewrite the title, slug and body.

## How To Update Image Paths

Images used by the website should live under `public/images/`.

Common folders:

- `public/images/homepage/`
- `public/images/products/`
- `public/images/applications/`
- `public/images/blog/`
- `public/images/about/`
- `public/images/brand/`

Admin image fields should use public paths like:

```text
/images/products/vortex-flowmeter.jpg
```

Do not use local computer paths or private folders.

## How To Upload A New Image

1. Open `/admin`.
2. Log in.
3. Choose `Media Library`.
4. Upload a JPG, PNG, WEBP or SVG image under 5 MB.
5. Copy the returned path, such as:

```text
/images/uploads/example-image.webp
```

6. Go to the content section that uses the image.
7. Paste or select the new image path in the image field.
8. Confirm the preview looks correct.
9. Click `Save Changes`.

Image fields also allow direct upload from the field itself. After upload, the image path is inserted automatically.

## How To Update Links

Link fields show a link type and URL field.

Use:

```text
/products
/contact
mailto:info@velomacflowmeter.com
tel:+8613326311877
https://example.com
```

Internal links should normally start with `/`. External links should start with `https://`.

## How Saving Works

Local development:

- Saving writes changes to the local JSON content files.
- Uploaded images are saved into `public/images/uploads/`.

Production on Vercel:

- Saving commits the changed JSON file back to GitHub.
- Uploaded images are committed to `public/images/uploads/` through the GitHub API.
- Vercel redeploys after the GitHub commit.

Production saving requires:

```env
GITHUB_TOKEN=
GITHUB_REPO=rubyyya66-velomac/velomac-website
GITHUB_BRANCH=main
```

The GitHub token must be stored only in Vercel environment variables. It should be a fine-grained token with repository contents read/write access.

## Quote Form Email

Do not change these unless the mailbox changes:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
QUOTE_TO_EMAIL=info@velomacflowmeter.com
```

The admin system does not expose SMTP settings.

## Advanced JSON Editor

The advanced JSON editor is available for careful structural edits, such as adding a full new article object. Use it only when the normal fields are not enough.

## What Not To Touch

Do not edit or expose:

- Environment variables
- Passwords
- SMTP credentials
- GitHub tokens
- Quote form email code
- DNS or domain settings
- Deployment settings unless you are configuring Vercel variables

For normal content work, stay inside `/admin`.
