export const SUBCATEGORIES = {
  men: [
    { name: "Tops", tag: "Tops" },
    { name: "Casual Shirts", tag: "Button Down" },
    { name: "Trousers", tag: "Trouser" },
    { name: "Suits", tag: "Suit" },
    { name: "T-Shirts", tag: "T Shirt" },
  ],
  women: [
    { name: "Tops", tag: "Tops" },
    { name: "Co-ord Sets", tag: "Co-ord" },
    { name: "Dresses", tag: "Dress" },
    { name: "Denim", tag: "Denim" },
  ],
  boys: [
    { name: "Suits", tag: "Suit" },
    { name: "T-Shirts/Polos", tag: "Polo" },
    { name: "Shorts", tag: "Short" },
    { name: "Pants", tag: "Denim" },
  ],
  girls: [
    { name: "Suits", tag: "Suit" },
    { name: "Tops", tag: "Top" },
    { name: "Dresses", tag: "Dress" },
    { name: "Trousers", tag: "Bottoms" },
  ],
};

const SKIP_TAGS = new Set([
  "sale",
  "men",
  "women",
  "boys",
  "girls",
  "kids",
  "tops",
  "bottoms",
  "newarrivals",
  "full price",
]);

/** Picks the most distinctive tag on a product to use as a rough style label. */
export function styleLabel(product) {
  const tag = (product.tags || []).find(
    (t) => !SKIP_TAGS.has(t.toLowerCase())
  );
  return tag || product.product_type;
}
