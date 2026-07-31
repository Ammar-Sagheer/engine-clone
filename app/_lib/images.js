/**
 * Image helpers. Deliberately imports no data — callers pass the products
 * they already have, so this stays safe for client components.
 */

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

/** A stable image for `seed`, drawn from the given products. */
export function pickImage(seed, products) {
  if (!products?.length) return null;

  const withImages = products.filter((p) => p.images?.length);
  if (withImages.length === 0) return null;

  const product = withImages[hash(seed) % withImages.length];
  return product.images[0].src;
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

/** Banner image for a gender section. */
export function bannerImage(products, gender) {
  const pool = products.filter(
    (p) => (p.product_type || "").toLowerCase() === gender && p.images?.length
  );

  return pickImage(`banner-${gender}`, pool.length ? pool : products);
}

export function heroImage(products) {
  return pickImage("hero-summer-26", products);
}
