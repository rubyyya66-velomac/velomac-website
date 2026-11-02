# Resource Article image editor — local delivery

Date: 2026-11-02. Source project: `/Users/rubyli/Documents/web`.

The implementation was first verified locally without committing, pushing or deploying. The user approved production release on 2026-11-02. Deployment outcome is reported separately in the release handoff. This release includes only the article-image feature; previously pending flow-range edits remain outside its scope. No external image-hosting service, new dependency, GA/GTM change, SEO metadata change or structured-data change was introduced.

## Implementation

- Extended the existing Tiptap editor with a selectable block image node and an image toolbar button. An image can be inserted at the saved cursor position, selected to edit, replaced, removed or restored with the editor's existing history.
- Each placement stores its own source URL, ALT, decorative flag, caption, 50/75/100% width, left/center/right alignment and intrinsic dimensions. Reusing the same media file does not share ALT/caption settings between placements.
- The native modal panel keeps editor selection stable while choosing/uploading media. On mobile, ALT/caption/display controls appear before the Media Library controls.
- Missing informative ALT produces a warning. Filenames are never substituted as ALT. Explicitly decorative images have `alt=""`. Captions are separate text in `figcaption`.
- Stored article content contains semantic `figure`, `img` and optional `figcaption`, not Base64, blobs, arbitrary styles or an external image URL.
- The existing public Resource page already uses the HTML sanitizer. Its allowlist now supports the image markup with safe local `/images/` paths, escaped text, validated presentation/dimensions, lazy loading and async decoding. Responsive `srcset` uses the existing Next.js image optimizer. SVG files already in the library remain available without sending them through that optimizer.
- Original raster upload bytes/quality are retained. Mobile requests use optimized responsive derivatives rather than requiring a second storage system. Captions and images use scoped article-body CSS; images maintain their natural ratio and become full available width on small screens.
- Added an authenticated, read-only body preview endpoint and a full-width preview dialog within the existing Article Preview area. It uses the same sanitizer and article-body CSS as public Resource pages. Previewing never saves or publishes.

## Existing storage reuse and limited changes

- Continued using `/api/admin/media`, `public/images/uploads/` and the production GitHub contents API. No storage migration or reference renaming.
- Added raster MIME/extension/decoded-content checks, still-image validation, a 40-megapixel decoding limit, the existing 5 MB limit and clearer errors. Returned intrinsic dimensions where available. Existing SVG Media Library support was retained.
- Corrected storage ordering so local development / `ADMIN_LOCAL_PREVIEW=true` always uses local storage, even if GitHub environment variables happen to exist. Production still uses the existing GitHub workflow.
- New production uploads become publicly available after the GitHub deployment completes; this existing delay is explained in the panel. An article must also be saved for its body change to persist.
- Saving the article collection compares unchanged records semantically, including when JSON object keys have a different order, and preserves them rather than recalculating their word counts.
- Added `minmax(0,1fr)` / input minimum-width constraints to the existing admin grid to prevent long Media Library paths or images from widening the page. Column widths and the admin design were retained.

## Exact files for this task

Changed:

1. `src/app/admin/page.tsx` — local sample button flag.
2. `src/app/api/admin/content/route.ts` — preserve unchanged articles on collection saves.
3. `src/app/api/admin/media/route.ts` — upload validation / dimensions / clear errors.
4. `src/app/globals.css` — scoped article image, caption, selection, modal and responsive styles; admin overflow constraints.
5. `src/components/AdminEditor.tsx` — pass media/upload callbacks into the body editor; integrate body preview and local sample control.
6. `src/components/ResourceArticleRichTextEditor.tsx` — toolbar, insertion/edit/removal, warnings and image-safe paste support.
7. `src/lib/adminContent.ts` — local-first media reads/uploads; unchanged production storage mechanism.
8. `src/lib/richTextSanitizer.ts` — safe semantic image markup and unchanged-record preservation.

Created:

9. `src/app/api/admin/article-preview/route.ts` — authenticated, read-only preview.
10. `src/components/AdminArticleBodyPreview.tsx` — public-style body preview dialog.
11. `src/components/ArticleImageNode.ts` — Tiptap block image parse/serialize support.
12. `src/components/ArticleImageSettings.tsx` — upload/library/ALT/caption/display panel.
13. `src/content/fixtures/article-image-demo.json` — local-only example, not part of published article data.
14. `src/lib/adminImageUpload.ts` — decoded raster validation.
15. `src/lib/articleImage.ts` — shared safe paths, dimensions, placement values and responsive sources.
16. `scripts/article-images.test.mjs` — ten image/editor/upload/sanitizer tests.
17. `ARTICLE_IMAGE_EDITOR_REPORT.md` — this report.

No existing article, cover, title, slug, category, publication status, relationship, URL or metadata was changed by this task. `src/content/data/articles.json` already had a pending change from the prior task; its bytes were compared with the snapshot from the start of this task and restored exactly after temporary sample tests. `tsconfig.json` and `next-env.d.ts` were restored after temporary build-directory setup.

## Acceptance verification

| Check | Result |
|---|---|
| Upload and insert at cursor between paragraphs | Passed through the actual local Media Library endpoint and editor UI. |
| Select an existing Media Library file | Passed; preview and dimensions loaded. |
| Save ALT and reopen the article | Passed using the real local article-save API, then a browser reload. |
| Edit ALT / caption independently | Passed; other placements retained their own values. |
| Missing ALT / decorative image | Warning shown for informative empty ALT; explicit decoration serialized an empty ALT. |
| Width / alignment | 50/75/100% options, left/center/right controls; edited 50/left and 75/center; sample right placement preserved. |
| Multiple images | Three placements tested, including a new upload; two retained after removal test. |
| Replace / remove | Passed; removal did not remove neighboring text or other images. |
| Actual public Resource page | Temporarily published the sample only on localhost and verified real `/resources/[slug]` rendering. |
| Desktop / mobile | Real Resource images loaded at natural ratios; 390 px view had no horizontal overflow. Admin settings and body-preview dialogs also checked. |
| Existing articles | All 43 original records remained identical during the corrected save test. Final article file is byte-for-byte identical to the task-start snapshot. |
| Production-build persistence | Temporary sample's static production HTML retained both images, ALT, captions and responsive attributes. New upload file remained in public storage after the build. No actual online redeployment was performed. |
| Regression tests | Ten new image tests plus 18 existing tests passed (28 total). |
| Final site architecture check | 83 public pages / 83 internal targets; zero broken links, orphans, weak pages, missing/empty image ALT, invalid JSON-LD or checked schema-relationship problems. Report: `/private/tmp/velomac-article-images-final-audit.json`. |

The temporary public sample was removed after testing. The duplicate upload used only for the upload test was moved to `/private/tmp/velomac-article-image-upload-test.jpg` for recovery, rather than left as an untracked website image. Final `pnpm run build` passed again without a test article (89 generated entries); the final prerender manifest has no test-article route.

## Local preview

- [Admin](http://localhost:3001/admin)
- In **Articles**, choose **Load local image sample**. This adds an unsaved local draft to the editor only; it does not save or publish it automatically.
- Click an image to edit its settings. **Article Preview → Preview article body** opens the front-end-style preview.
- The sample contains multiple images, separate ALT/captions, H2/H3, paragraphs, bold/italic/underline/highlight, bullet/numbered lists, a blockquote, divider and contextual links.
- Preview binds to `127.0.0.1:3001` and uses temporary localhost-only test credentials, not the production admin credential. No credential file was created.
- Development command: `NEXT_DIST_DIR=.next-preview pnpm exec next dev --hostname 127.0.0.1 -p 3001`, with `ADMIN_LOCAL_PREVIEW=true` and temporary admin credentials set only on the server process.

Screenshots:

- `/private/tmp/velomac-admin-image-desktop.png`
- `/private/tmp/velomac-admin-image-mobile.png`
- `/private/tmp/velomac-article-body-desktop.png`
- `/private/tmp/velomac-article-body-mobile.png`
- `/private/tmp/velomac-resource-images-desktop.png`
- `/private/tmp/velomac-resource-images-mobile.png`

Production release was subsequently authorized by the user on 2026-11-02. Release preparation preserves newer article and image updates already on `origin/main` rather than replacing them with the older local content snapshot.
