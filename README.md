# Game MODs

A responsive game catalog with the original dark violet/pink visual style. Browse cards, search by name, and open a shareable detail page for each game.

## Development

Requires Node.js 22.12+ (Node 24 was validated).

```sh
npm install --package-lock=false
npm run dev
```

The development server defaults to port 3000. No API key is needed for the catalog.

```sh
npm run build
npx tsc --noEmit
npm run preview
```

Deploy the generated `dist` directory to a static host. App links use hash routes (`#app/forza-horizon-5`), so direct links work without host rewrite rules.

## Catalog content

Edit `data/games.json` to update names, artwork, descriptions, and categories. Keep each `id` unique and stable because it appears in shared links. Images fall back to a bundled placeholder when unavailable.

Downloads are intentionally unavailable: no downloadable files or verified URLs were supplied. Adding a URL to the data alone does not enable a download. Once real files are available, implement and validate the download link in `catalog.ts`, including confirmed platform, version, and file size. Do not display unverified download counts or unsupported feature claims.

The catalog does not load the previous third-party verification redirect, jQuery, Bootstrap, or external fonts. The existing React chat files are legacy code and are not mounted by this catalog.
