# GlowWithVani

Luxury minimal static Next.js website for a Toronto/GTA makeup artist brand.

## Stack

- Next.js (App Router) + TypeScript
- Static export (`output: "export"`)
- GitHub Pages deploy via GitHub Actions
- Custom domain via `public/CNAME` (`glowwithvani.com`)
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

## GitHub Pages + Namecheap

1. Push to `main` to trigger `.github/workflows/deploy.yml`.
2. In GitHub repo settings: enable Pages with `GitHub Actions` source.
3. In Namecheap DNS:
   - Add `A` records for root (`@`) to GitHub Pages IPs.
   - Add `CNAME` record for `www` -> `<your-github-username>.github.io`.
4. Keep `public/CNAME` as `glowwithvani.com` so the custom domain persists.
