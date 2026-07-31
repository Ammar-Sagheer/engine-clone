import Link from "next/link";
import { ArrowRightIcon } from "@/_components/Icons";
import { subcategoryImage } from "@/_lib/images";

export default function SubcategoryRow({
  title,
  gender,
  subcategories,
  products,
  bordered = true,
}) {
  return (
    <section
      className={`container-page py-14 md:py-20 ${
        bordered ? "border-t border-line" : ""
      }`}
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="eyebrow">Shop By Category</p>
          <h2 className="section-title mt-2">{title}</h2>
        </div>
        <Link
          href={`/collections/${gender}`}
          className="hidden sm:inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase link-underline shrink-0"
        >
          View All
          <ArrowRightIcon />
        </Link>
      </div>

      <div className="rail no-scrollbar -mx-5 px-5 md:-mx-10 md:px-10">
        {subcategories.map((sub) => {
          const image = subcategoryImage(products, gender, sub.tag);
          return (
            <Link
              key={sub.name}
              href={`/collections/${gender}?tag=${encodeURIComponent(sub.tag)}`}
              className="group relative block w-[46vw] sm:w-60 shrink-0"
            >
              <div className="relative aspect-[3/4] bg-[#f4f4f4] overflow-hidden">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white text-[13px] font-semibold tracking-[0.12em] uppercase">
                  {sub.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
