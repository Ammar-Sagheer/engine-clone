/**
 * Pure helpers with no data imports, so client components can use them
 * without pulling the ~5.5 MB catalogue into the browser bundle.
 * Anything that touches products.json belongs in _lib/shopify.js instead.
 */

export const CATEGORIES = ["Men", "Women", "Boys", "Girls"];

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

export function filterProductsByCategory(products, category) {
  const normalized = category.toLowerCase();
  return products.filter((p) => {
    const type = (p.product_type || "").toLowerCase();
    const tags = (p.tags || []).map((t) => t.toLowerCase());
    return type === normalized || tags.includes(normalized);
  });
}
