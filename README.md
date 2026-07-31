## Engine Clone

A functional storefront clone inspired by the structure of engine.com.pk, built with **Next.js (App Router) + Tailwind CSS**, using plain **JavaScript**. Product data is fetched live from the public Shopify `products.json` endpoint — nothing is hardcoded or scraped into the repo.

This is a demo/practice project. It is not affiliated with, endorsed by, or a replacement for the real Engine store, and does not include their brand assets (logo, wordmark, marketing copy).

### Tech stack

- Next.js 16 (App Router, Server Components)
- React 19
- Tailwind CSS v4
- Plain JavaScript (no TypeScript)
- Client-side cart state via React Context + `localStorage`

### Folder structure

```
src/
  app/
    layout.js                 # root layout (header/footer/providers)
    page.js                   # homepage
    globals.css
    collections/[category]/   # category listing pages (men/women/boys/girls/new-in)
    products/[handle]/        # product detail page
    cart/                     # cart page
    search/                   # client-side search
  components/
    Header.js
    Footer.js
    Hero.js
    ProductCard.js
    CategorySection.js
    NewsletterForm.js
  context/
    CartContext.js
  lib/
    shopify.js                # products.json client + helpers
public/
```

### Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### What's implemented

- Home page with hero + Men/Women/Boys/Girls sections pulled from live product data
- Category pages (`/collections/men`, `/women`, `/boys`, `/girls`, `/new-in`)
- Product detail page with image gallery, variant (size/color) selection, add-to-cart
- Client-side search
- Cart page with quantity update/remove and subtotal (persisted in localStorage)
- Responsive header/footer matching the site's nav and footer sections

### What's not implemented (needs a decision from you)

- **Checkout** — there's a "Checkout" button on the cart page but no real payment/order flow. Options: (a) redirect to the real engine.com.pk cart/checkout via their Shopify checkout URL, (b) build your own checkout with a payment provider, (c) leave as a UI-only demo.
- **Images/branding** — no logo file or brand colors were provided, so the header currently just shows "ENGINE" as text and a neutral color palette. Send a logo/colors if you want it visually closer.
- **Static pages** (About, Store Locator, Return Policy, etc.) — footer links currently point to placeholder routes that don't have pages yet.
- **Search** is naive client-side title matching, not the real site's search backend.
- No env vars/secrets are required since everything reads from the public `products.json`/`.json` endpoints.
