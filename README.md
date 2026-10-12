# GlowWithVani

Luxury minimal static Next.js website for a Toronto/GTA makeup artist brand.

## Stack

- Next.js (App Router) + TypeScript
- Static export (`output: "export"`)
- Netlify deploy via `netlify.toml`
- Decap CMS admin at `/admin`
- Build-time portfolio image optimization + pricing asset generation
- No backend, no database

## Local development

```bash
npm install
npm run dev
```

## Production static build

```bash
npm run build
```

Build output is generated in `out/`.

## Netlify deployment

1. Push to `main` to trigger a Netlify deploy from the connected GitHub repo.
2. In Netlify, confirm:
   - Build command: `npm run build`
   - Publish directory: `out`
3. Point the domain to Netlify using the nameservers or DNS targets shown in Netlify.
4. Use `https://glowwithvani.com/admin/` for CMS access after GitHub OAuth is configured in Netlify.

## Screen, print, and production portfolio

The portfolio has shareable discipline, format, search, and project links:

- `/portfolio/?discipline=screen` (film and video)
- `/portfolio/?discipline=character` (theatre, prosthetics, SFX)
- `/portfolio/?format=publication` (published magazine editorials)
- `/portfolio/?project=photo-hustinder` (project player and credits)
- `/contact/?type=production` (production inquiry preset)

Photography remains in `content/portfolio/`. Multi-tag matching and balanced homepage curation are preserved. Use the `Film & Video` display tag for approved film stills. Photo cards remain image-only.

Project entries live in `content/projects/`, editable in Decap's **Screen & Print Projects** collection or as JSON. Fields include title, format, disciplines, Gurvani's role, description, release status, optional client/publication/issue/year, cover and alt text, related portfolio IDs, additional credits, order, and homepage visibility. Years are strings, for example `"2026"`.

- Released videos require an HTTPS YouTube URL. Embeds load only after a visitor presses play; an external YouTube link is also provided.
- Published editorials require the magazine name and at least a cover, related photo, or external link. An online magazine URL is **not** required.
- Upcoming films can omit the video URL. They display an upcoming notice rather than an empty player.
- `published: false` hides an entry from the website. The Punjabi feature is an unpublished draft awaiting its approved title and materials. Do not publish the draft description unchanged.
- Drafts are not secure storage: files committed to a public repository or placed in `public/` can be accessible even if the project is hidden. Only upload approved, non-confidential materials.
- Add only verified credits. No magazine credits or collaborator names are invented as placeholders.

Cover originals use `public/portfolio/originals/`. `npm run optimize:portfolio` creates WebP covers in `public/projects/optimized/` and photo copies in `public/portfolio/optimized/`. These generated directories are ignored by Git and rebuilt on Netlify. Existing photos can be attached using their slug in `portfolioIds`, without duplicating the originals.

**Deployment cost:** CMS saves commit to GitHub and can trigger a Netlify build. This revamp does not make CMS saves deployment-free. Prefer collecting all metadata and images locally, previewing them together, then making one approved push. Local builds and previews do not trigger Netlify deployments.

## Verification

Use Node 22.6+ (the configured Netlify Node 22 supports the strip-types test flag):

```bash
node --experimental-strip-types --test tests/work.test.mjs
npm run optimize:portfolio
npx next build
python3 -m http.server 3005 --bind 127.0.0.1 --directory out
```

`npx next build` is useful when testing the site without regenerating existing pricing documents; the normal `npm run build` still prepares all assets.

With Playwright available and Chrome installed, run `node tests/work-browser.cjs` against the preview. Set `PLAYWRIGHT_MODULE` to an existing Playwright module path if it is outside this project, and `TEST_BASE_URL` to use another local port. Tests cover filtering, deep links, history, video opt-in, lightbox focus, mobile/tablet/desktop layouts, theme persistence, and inquiry form success/error flows. Form and video requests are intercepted; the tests never send a real inquiry.

### Published page collections

Projects can include a `pages` list of `{ "image": "/portfolio/originals/...jpg", "alt": "Description" }` objects in reading order. Do not repeat the cover in this list. Originals are copied without edits; generated pages use `/projects/optimized/<slug>-page-<number>.webp`. The reader preserves the complete page, offers previous/next controls, and links to the full-size optimized page. Publication pages do not become standalone photo-feed entries.

The current local publication selection contains:

- **OUT-AND-OUT / The New Era:** 10 supplied pages, including the cover and credit page. No. 149, October 2026, as printed on the cover.
- **GOJI / Before the Red Carpet:** No. 210, 2026, confirmed by the supplied issue cover. Includes 8 editorial pages, including the title and credits on printed page 34. The issue cover is a reference only, not attributed to Gurvani or included in her work gallery. The existing `goji-beauty-editorial` slug is retained so preview links continue to work.
- **GEZNO Magazine / Coffee and Contracts:** 9 supplied portrait pages. Six overlapping two-page exports were omitted to avoid repeating images. The magazine's spelling follows its printed masthead, despite the source folder being named `GenZo`.

Credits are transcribed only where readable in the supplied pages. No issue/year or collaborator names have been invented for GOJI or GEZNO.
