import Hero from "@/_components/Hero";
import SaleCollections from "@/_components/SaleCollections";
import SubcategoryRow from "@/_components/SubcategoryRow";
import KidsGateway from "@/_components/KidsGateway";
import { getAllProducts } from "@/_lib/shopify";
import { SUBCATEGORIES } from "@/_lib/subcategories";
import { heroImage } from "@/_lib/images";

export const revalidate = 3600;

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <>
      <Hero image={heroImage(products)} />
      <SaleCollections products={products} />
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
