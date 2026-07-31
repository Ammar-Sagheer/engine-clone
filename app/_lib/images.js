import fallbackData from "@/_data/products-fallback.json";

/** Every product image we know about, used to fill tiles that have no match. */
const POOL = fallbackData.products.flatMap((p) =>
  (p.images || []).map((img) => img.src)
);

/**
 * djb2 — a tiny string hash. Picking images has to be deterministic rather
 * than random: the server and the client must render the same `src`, or
 * React reports a hydration mismatch and the image visibly swaps on load.
 */
function hash(seed) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 33) ^ seed.charCodeAt(i);
  }
  return Math.abs(h);
}

/**
 * Returns a stable image for `seed`, drawn from the given products when
 * possible and otherwise from the full pool. Never returns undefined as
 * long as any product has an image.
 */
export function pickImage(seed, products) {
  const pool =
    products?.flatMap((p) => (p.images || []).map((img) => img.src)) || [];
  const source = pool.length > 0 ? pool : POOL;
  if (source.length === 0) return null;
  return source[hash(seed) % source.length];
}

/**
 * Best image for a subcategory tile: a product actually carrying that tag,
 * falling back to a stable pick so the tile is never empty.
 */
export function subcategoryImage(products, gender, tag) {
  const match = products.find(
    (p) =>
      (p.product_type || "").toLowerCase() === gender &&
      (p.tags || []).some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );

  return match?.images?.[0]?.src ?? pickImage(`${gender}-${tag}`, products);
}

/** Wide-ish banner image for a gender section. */
export function bannerImage(products, gender) {
  const match = products.find(
    (p) => (p.product_type || "").toLowerCase() === gender && p.images?.length
  );

  return match?.images?.[0]?.src ?? pickImage(`banner-${gender}`, products);
}

export function heroImage(products) {
  return pickImage("hero-summer-26", products);
}
