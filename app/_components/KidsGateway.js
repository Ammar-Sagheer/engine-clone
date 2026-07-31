import Link from "next/link";
import SubcategoryRow from "@/_components/SubcategoryRow";
import { SUBCATEGORIES } from "@/_lib/subcategories";
import { ArrowRightIcon } from "@/_components/Icons";

export default function KidsGateway({ gender, title, products }) {
  const banner = products.find(
    (p) => (p.product_type || "").toLowerCase() === gender && p.images?.length
  )?.images?.[0]?.src;

  return (
    <>
      <section className="container-page pt-14 md:pt-20">
        <Link
          href={`/collections/${gender}`}
          className="group relative block overflow-hidden bg-[#111]"
        >
          {banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={banner}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="relative px-8 md:px-14 py-16 md:py-24 text-white">
            <p className="text-[11px] tracking-[0.28em] uppercase text-white/70">
              Kids
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              {title}
            </h2>
            <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase link-underline">
              Shop All {title}
              <ArrowRightIcon />
            </span>
          </div>
        </Link>
      </section>

      <SubcategoryRow
        title={`${title} Collections`}
        gender={gender}
        subcategories={SUBCATEGORIES[gender]}
        products={products}
        bordered={false}
      />
    </>
  );
}
