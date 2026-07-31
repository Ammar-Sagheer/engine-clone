import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { getAllProducts, filterProductsByCategory, CATEGORIES } from "@/lib/shopify";

export const revalidate = 3600;

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <>
      <Hero />
      {CATEGORIES.map((category) => (
        <CategorySection
          key={category}
          title={category}
          slug={category.toLowerCase()}
          products={filterProductsByCategory(products, category)}
        />
      ))}
    </>
  );
}
