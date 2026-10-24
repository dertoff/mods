# Game MODs

A responsive game catalog with a charcoal and lime visual style. Browse cards, search by name, and open a compact download page for each game.

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

## Content locker

The Download button loads the original `https://appverification.live/cl/js/m5e2mw` script on demand and calls the provider's `og_load()` entry point. Browsing never loads the locker or redirects automatically. Loading failures show a retryable message.

Configure the post-completion destination in the locker provider dashboard. The site does not treat closing a popup, clicking an offer, or waiting as proof of completion. It does not redirect directly to a file or simulate successful verification.

**Still required:** verified game files, device compatibility, and the provider's actual completion redirect configuration. The original locker is shared by all games; it cannot select different game files automatically. For different destinations per game, provide separate locker IDs/scripts or the provider's documented per-game/sub-ID integration. No final download URL is currently configured in this repository. A real offer-completion flow has not been validated.

The catalog does not use the previous automatic verification redirect, jQuery, Bootstrap, or external fonts. The existing React chat files are legacy code and are not mounted by this catalog.
