const STORE_URL = "https://engine.com.pk";

/**
 * Shopify's storefront JSON endpoints rate-limit aggressively (429) when
 * hit repeatedly in a short window, which happens easily in Next dev mode
 * since `next: { revalidate }` isn't honored the same way it is in prod.
 * Retry with backoff, honoring Retry-After when present.
 */
async function fetchWithRetry(url, options = {}, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options);

    if (res.status !== 429) return res;

    if (attempt === retries) return res;

    const retryAfter = Number(res.headers.get("retry-after"));
    const waitMs = retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

/**
 * Fetches products from the public Shopify storefront JSON endpoint.
 * https://shopify.dev/docs/api/ajax/reference/product#endpoints
 */
export async function getProducts({ limit = 250, page = 1 } = {}) {
  const res = await fetchWithRetry(
    `${STORE_URL}/products.json?limit=${limit}&page=${page}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const data = await res.json();
  return data.products;
}

// Module-level cache so repeated calls within the same server process
// (e.g. every route hit during `next dev`) don't re-fetch all pages.
let allProductsCache = null;
let allProductsCacheAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getAllProducts() {
  if (allProductsCache && Date.now() - allProductsCacheAt < CACHE_TTL_MS) {
    return allProductsCache;
  }

  const all = [];
  let page = 1;

  while (true) {
    const products = await getProducts({ limit: 250, page });
    all.push(...products);
    if (products.length < 250) break;
    page += 1;
    if (page > 10) break;
    // small gap between page requests to stay under the rate limit
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  allProductsCache = all;
  allProductsCacheAt = Date.now();
  return all;
}

export async function getProductByHandle(handle) {
  const res = await fetchWithRetry(`${STORE_URL}/products/${handle}.json`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.product;
}

export function getProductPrice(product) {
  const variant = product.variants?.[0];
  if (!variant) return { price: 0, compareAtPrice: null };

  return {
    price: parseFloat(variant.price),
    compareAtPrice: variant.compare_at_price
      ? parseFloat(variant.compare_at_price)
      : null,
  };
}

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Maps our site categories to product_type / tags used on the store. */
export const CATEGORIES = ["Men", "Women", "Boys", "Girls"];

export function filterProductsByCategory(products, category) {
  const normalized = category.toLowerCase();
  return products.filter((p) => {
    const type = (p.product_type || "").toLowerCase();
    const tags = (p.tags || []).map((t) => t.toLowerCase());
    return type === normalized || tags.includes(normalized);
  });
}
