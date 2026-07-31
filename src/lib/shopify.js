const STORE_URL = "https://engine.com.pk";

/**
 * Fetches products from the public Shopify storefront JSON endpoint.
 * https://shopify.dev/docs/api/ajax/reference/product#endpoints
 */
export async function getProducts({ limit = 250, page = 1 } = {}) {
  const res = await fetch(
    `${STORE_URL}/products.json?limit=${limit}&page=${page}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const data = await res.json();
  return data.products;
}

export async function getAllProducts() {
  const all = [];
  let page = 1;

  while (true) {
    const products = await getProducts({ limit: 250, page });
    all.push(...products);
    if (products.length < 250) break;
    page += 1;
    if (page > 10) break;
  }

  return all;
}

export async function getProductByHandle(handle) {
  const res = await fetch(`${STORE_URL}/products/${handle}.json`, {
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
