import { getAllProducts } from "@/_lib/shopify";

/**
 * Search endpoint for client components. Filtering runs on the server so the
 * browser never downloads the whole ~5.5 MB catalogue.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const limit = Math.min(Number(searchParams.get("limit")) || 48, 100);

  const products = await getAllProducts();

  const matched = q
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.product_type || "").toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    : products;

  return Response.json({
    total: matched.length,
    products: matched.slice(0, limit),
  });
}
