import ProductCard from "@/_components/ProductCard";
import { getAllProducts, filterProductsByCategory } from "@/_lib/shopify";

export const revalidate = 3600;

function titleCase(str) {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CollectionPage({ params }) {
  const { category } = await params;
  const products = await getAllProducts();

  const filtered =
    category === "new-in"
      ? [...products]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 40)
      : filterProductsByCategory(products, category);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-8">{titleCase(category)}</h1>

      {filtered.length === 0 ? (
        <p className="text-neutral-500">No products found in this collection.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
