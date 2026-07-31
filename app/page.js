import Hero from "@/_components/Hero";
import SaleCollections from "@/_components/SaleCollections";
import SubcategoryRow from "@/_components/SubcategoryRow";
import KidsGateway from "@/_components/KidsGateway";
import { getAllProducts } from "@/_lib/shopify";
import { CATEGORIES } from "@/_lib/format";
import { SUBCATEGORIES } from "@/_lib/subcategories";
import { heroImage } from "@/_lib/images";

export const revalidate = 3600;

const RAIL_SIZE = 12;

export default async function HomePage() {
  const products = await getAllProducts();

  // SaleCollections is a client component, so only hand it the handful of
  // products the rails actually render — not the whole catalogue.
  const saleByCategory = Object.fromEntries(
    CATEGORIES.map((category) => [
      category,
      products
        .filter(
          (p) =>
            p.product_type === category &&
            (p.tags || []).some((t) => t.toLowerCase() === "sale")
        )
        .slice(0, RAIL_SIZE),
    ])
  );

  return (
    <>
      <Hero image={heroImage(products)} />
      <SaleCollections collections={saleByCategory} />
      <SubcategoryRow
        title="Men's Collections"
        gender="men"
        subcategories={SUBCATEGORIES.men}
        products={products}
      />
      <SubcategoryRow
        title="Women's Collections"
        gender="women"
        subcategories={SUBCATEGORIES.women}
        products={products}
      />
      <KidsGateway gender="boys" title="Boys" products={products} />
      <KidsGateway gender="girls" title="Girls" products={products} />
    </>
  );
}
