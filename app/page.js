import Hero from "@/_components/Hero";
import CategorySection from "@/_components/CategorySection";
import { getAllProducts, filterProductsByCategory, CATEGORIES } from "@/_lib/shopify";

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
