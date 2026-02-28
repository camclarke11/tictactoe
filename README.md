# Infinite Tic-Tac-Toe

A React + Vite Tic-Tac-Toe app with PWA support.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Dashboard, go to `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
3. Select this GitHub repo.
4. Use these build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version env var: set `NODE_VERSION=22`
5. Click `Save and Deploy`.

## Connect camlc.dev

1. Open the new Pages project.
2. Go to `Custom domains` -> `Set up a custom domain`.
3. Add `camlc.dev` (and optionally `www.camlc.dev`).
4. Cloudflare will create/verify the DNS records and issue SSL automatically.

## Notes

- `public/_redirects` includes `/* /index.html 200` so direct URL loads work correctly for SPA routes.
- PWA assets and service worker are generated during `npm run build`.
