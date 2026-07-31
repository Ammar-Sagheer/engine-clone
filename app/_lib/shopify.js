import fallbackData from "@/_data/products-fallback.json";

const STORE_URL = "https://engine.com.pk";

const FETCH_TIMEOUT_MS = 4000;

/**
 * fetch() never times out on its own — if the network stalls (blocked,
 * filtered, or just slow) instead of returning an error or a 429, a plain
 * fetch() hangs forever and so does the page. Abort it ourselves.
 */
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

/**
 * Shopify's storefront JSON endpoints rate-limit aggressively (429) when
 * hit repeatedly in a short window, which happens easily in Next dev mode
 * since `next: { revalidate }` isn't honored the same way it is in prod.
 * Retry with backoff, honoring Retry-After when present.
 */
async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    let res;
    try {
      res = await fetchWithTimeout(url, options);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
      continue;
    }

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

/**
 * If the live store is unreachable or rate-limits us outright, fall back to
 * the bundled products-fallback.json snapshot so the site still renders.
 */
export async function getAllProducts() {
  if (allProductsCache && Date.now() - allProductsCacheAt < CACHE_TTL_MS) {
    return allProductsCache;
  }

  try {
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
  } catch {
    allProductsCache = fallbackData.products;
    allProductsCacheAt = Date.now();
    return fallbackData.products;
  }
}

export async function getProductByHandle(handle) {
  try {
    const res = await fetchWithRetry(`${STORE_URL}/products/${handle}.json`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return data.product;
    }
  } catch {
    // fall through to local fallback data below
  }

  return fallbackData.products.find((p) => p.handle === handle) || null;
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
