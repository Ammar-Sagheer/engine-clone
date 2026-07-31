import Link from "next/link";
import ProductCard from "@/_components/ProductCard";
import { getAllProducts, filterProductsByCategory } from "@/_lib/shopify";
import { SUBCATEGORIES } from "@/_lib/subcategories";

export const revalidate = 3600;

function titleCase(str) {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CollectionPage({ params, searchParams }) {
  const { category } = await params;
  const { tag } = await searchParams;
  const products = await getAllProducts();

  let filtered =
    category === "new-in"
      ? [...products]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 40)
      : filterProductsByCategory(products, category);

  if (tag) {
    filtered = filtered.filter((p) =>
      (p.tags || []).some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  const subcategories = SUBCATEGORIES[category] || [];

  return (
    <div className="container-page py-10 md:py-14">
      <nav className="text-[11px] tracking-[0.14em] uppercase text-muted mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{titleCase(category)}</span>
        {tag && (
          <>
            <span className="mx-2">/</span>
            <span className="text-foreground">{tag}</span>
          </>
        )}
      </nav>

      <header className="border-b border-line pb-6 mb-8">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
          {tag || titleCase(category)}
        </h1>
        <p className="text-[13px] text-muted mt-2">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      </header>

      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href={`/collections/${category}`}
            className={`px-4 py-2 text-[12px] tracking-[0.1em] uppercase border transition-colors ${
              !tag
                ? "bg-foreground text-white border-foreground"
                : "border-line hover:border-foreground"
            }`}
          >
            All
          </Link>
          {subcategories.map((sub) => {
            const active = tag === sub.tag;
            return (
              <Link
                key={sub.name}
                href={`/collections/${category}?tag=${encodeURIComponent(sub.tag)}`}
                className={`px-4 py-2 text-[12px] tracking-[0.1em] uppercase border transition-colors ${
                  active
                    ? "bg-foreground text-white border-foreground"
                    : "border-line hover:border-foreground"
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted mb-6">No products found in this collection.</p>
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
