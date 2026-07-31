import fallbackData from "@/_data/products-fallback.json";

/**
 * Using the bundled products-fallback.json snapshot only for now — the
 * live engine.com.pk products.json endpoint was hanging/rate-limiting
 * in dev. Swap these two functions back to a live fetch later if needed.
 */
export async function getAllProducts() {
  return fallbackData.products;
}

export async function getProductByHandle(handle) {
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
