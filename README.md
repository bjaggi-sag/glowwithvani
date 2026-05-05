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
