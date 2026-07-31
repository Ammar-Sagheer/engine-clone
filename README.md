## Engine Clone

A functional storefront clone inspired by the structure of engine.com.pk, built with **Next.js (App Router) + Tailwind CSS**, using plain **JavaScript**.

This is a demo/practice project. It is not affiliated with, endorsed by, or a replacement for the real Engine store, and does not include their brand assets (logo, wordmark, marketing copy).

### Tech stack

- Next.js 16 (App Router, Server Components)
- React 19
- Tailwind CSS v4
- Plain JavaScript (no TypeScript)
- Cart state via React Context + `localStorage` (`useSyncExternalStore`)

### Folder structure

```
app/
  layout.js                 # root layout (header/footer/cart drawer/providers)
  page.js                   # homepage
  globals.css               # tokens + shared utility classes
  api/products/route.js     # search endpoint for client components
  collections/[category]/   # category listings (men/women/boys/girls/new-in)
  products/[handle]/        # product detail page
  cart/                     # full cart page
  search/                   # search page
  _components/              # Header, Footer, Hero, ProductCard, CartDrawer, …
  _context/CartContext.js
  _data/products.json       # catalogue snapshot (see below)
  _lib/
    shopify.js              # SERVER ONLY — reads the catalogue
    format.js               # pure helpers, safe for client components
    images.js               # deterministic image pickers
    subcategories.js
scripts/
  fetch-catalogue.js        # regenerates _data/products.json
public/
```

### Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Product data

Product data comes from a committed snapshot at `app/_data/products.json`, generated from the store's public Shopify feed. Fetching it at request time proved unreliable (the endpoint rate-limits and sometimes stalls), so the snapshot keeps page loads fast and offline-friendly. Product images are still loaded from Shopify's CDN.

Regenerate or resize it with:

```bash
node scripts/fetch-catalogue.js --per-category 750
```

The full feed is ~15,000 products (~28 MB), which is impractical to commit and slow to parse on every dev-server start, so the default is a balanced 750 per category (3,000 total, ~5.5 MB). Pass `--per-category Infinity` for everything.

**Important:** `_lib/shopify.js` imports that snapshot and must only be used from Server Components. A client component importing it would ship the entire catalogue to the browser. Client code should use `_lib/format.js` for helpers and `/api/products` for data.

### What's implemented

- Homepage: hero, tabbed sale rails per category, subcategory tile rows, kids banners
- Category pages with subcategory filters and pagination (48 per page)
- Product detail page with gallery, variant selection, and sold-out states
- Slide-over cart drawer plus a full cart page, persisted to localStorage
- Server-side search via `/api/products`
- Responsive down to mobile

### Not implemented

- **Checkout** — the button is UI-only; there's no payment/order flow.
- **Branding** — no logo file or brand colors were provided, so the header uses an "ENGINE" wordmark in text and a neutral palette.
- **Static pages** (About, Store Locator, Return Policy, …) — footer links point to routes that don't exist yet.
- No env vars or secrets are required.
