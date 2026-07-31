import Link from "next/link";

function findTileImage(products, gender, tag) {
  const match = products.find(
    (p) =>
      (p.product_type || "").toLowerCase() === gender &&
      (p.tags || []).some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
  return match?.images?.[0]?.src;
}

export default function SubcategoryRow({ title, gender, subcategories, products }) {
  return (
    <section className="container-page py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-2xl font-semibold">{title}</h2>
        <Link href={`/collections/${gender}`} className="text-sm underline underline-offset-4">
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {subcategories.map((sub) => {
          const image = findTileImage(products, gender, sub.tag);
          return (
            <Link
              key={sub.name}
              href={`/collections/${gender}?tag=${encodeURIComponent(sub.tag)}`}
              className="group block w-36 md:w-44 shrink-0"
            >
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    {sub.name}
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-center mt-2">{sub.name}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
