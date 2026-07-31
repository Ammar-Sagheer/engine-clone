import Link from "next/link";
import ProductCard from "@/_components/ProductCard";
import { getAllProducts, filterProductsByCategory } from "@/_lib/shopify";
import { SUBCATEGORIES } from "@/_lib/subcategories";
import { pickImage } from "@/_lib/images";

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

  const banner = filtered[0]?.images?.[0]?.src ?? pickImage(category, products);

  return (
    <>
      <section className="relative bg-[#111] text-white overflow-hidden">
        {banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="container-page relative py-14 md:py-20">
          <nav className="text-[11px] tracking-[0.14em] uppercase text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{titleCase(category)}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {tag || titleCase(category)}
          </h1>
          <p className="text-[13px] text-white/70 mt-3">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
      </section>

      <div className="container-page py-8 md:py-12">
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
    </>
  );
}
