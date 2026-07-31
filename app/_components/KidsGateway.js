import Link from "next/link";
import SubcategoryRow from "@/_components/SubcategoryRow";
import { SUBCATEGORIES } from "@/_lib/subcategories";

export default function KidsGateway({ gender, title, products }) {
  return (
    <>
      <section className="container-page pt-10">
        <Link
          href={`/collections/${gender}`}
          className="block bg-neutral-900 text-white text-center py-10 font-semibold tracking-wide"
        >
          Shop All {title}
        </Link>
      </section>
      <SubcategoryRow
        title={`${title} Collections`}
        gender={gender}
        subcategories={SUBCATEGORIES[gender]}
        products={products}
      />
    </>
  );
}
