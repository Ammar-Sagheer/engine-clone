/**
 * Regenerates app/_data/products.json from the public Shopify storefront feed.
 *
 *   node scripts/fetch-catalogue.js [--per-category 750] [--pages 60]
 *
 * The full feed is ~15,000 products / ~28 MB, which is impractical to commit
 * and slow to parse on every dev-server start, so by default we keep a
 * balanced slice across the four categories. Raise --per-category (or pass
 * Infinity) if you want the whole catalogue.
 */

const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "app", "_data", "products.json");
const STORE = "https://engine.com.pk";
const CATEGORIES = ["Men", "Women", "Boys", "Girls"];

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const raw = args[i + 1];
  return raw === "Infinity" ? Infinity : Number(raw);
};

const PER_CATEGORY = argValue("per-category", 750);
const MAX_PAGES = argValue("pages", 60);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Keep only the fields the storefront actually renders. */
function slim(p) {
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    body_html: (p.body_html || "").slice(0, 400),
    created_at: p.created_at,
    product_type: p.product_type,
    tags: p.tags || [],
    variants: (p.variants || []).map((v) => ({
      id: v.id,
      title: v.title,
      option1: v.option1,
      option2: v.option2,
      option3: v.option3,
      available: v.available,
      price: v.price,
      compare_at_price: v.compare_at_price,
    })),
    images: (p.images || []).slice(0, 4).map((i) => ({ id: i.id, src: i.src })),
    options: (p.options || []).map((o) => ({
      name: o.name,
      position: o.position,
      values: o.values,
    })),
  };
}

async function main() {
  const seen = new Set();
  const buckets = Object.fromEntries(CATEGORIES.map((c) => [c, []]));

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`${STORE}/products.json?limit=250&page=${page}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      console.error(`page ${page}: HTTP ${res.status} — stopping`);
      break;
    }

    const { products = [] } = await res.json();
    if (products.length === 0) break;

    for (const p of products) {
      if (seen.has(p.id)) continue;
      if (!p.images?.length || !p.variants?.length) continue;

      const bucket = buckets[p.product_type];
      if (!bucket || bucket.length >= PER_CATEGORY) continue;

      seen.add(p.id);
      bucket.push(slim(p));
    }

    const total = CATEGORIES.reduce((n, c) => n + buckets[c].length, 0);
    process.stdout.write(`\rpage ${page} — collected ${total}`);

    const full = CATEGORIES.every((c) => buckets[c].length >= PER_CATEGORY);
    if (full || products.length < 250) break;

    await sleep(300);
  }

  // Interleave categories so unfiltered listings aren't all Men first.
  const merged = [];
  for (let i = 0; i < PER_CATEGORY; i++) {
    for (const c of CATEGORIES) {
      if (buckets[c][i]) merged.push(buckets[c][i]);
    }
    if (merged.length >= CATEGORIES.length * PER_CATEGORY) break;
  }

  fs.writeFileSync(OUT, JSON.stringify({ products: merged }));

  const mb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
  console.log(`\n\nwrote ${merged.length} products → ${OUT} (${mb} MB)`);
  for (const c of CATEGORIES) console.log(`  ${c}: ${buckets[c].length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
