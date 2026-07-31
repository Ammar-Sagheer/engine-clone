import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function CategorySection({ title, slug, products }) {
  if (!products.length) return null;

  return (
    <section className="container-page py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-semibold">{title}</h2>
        <Link
          href={`/collections/${slug}`}
          className="text-sm underline underline-offset-4"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
