import Link from "next/link";
import { getProductPrice, formatPrice } from "@/_lib/shopify";
import { styleLabel } from "@/_lib/subcategories";

export default function SaleProductCard({ product }) {
  const { price, compareAtPrice } = getProductPrice(product);
  const image = product.images?.[0];
  const variant = product.variants?.[0];
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round((1 - price / compareAtPrice) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block w-40 md:w-48 shrink-0"
    >
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1">
            -{discount}%
          </span>
        )}
      </div>
      <div className="pt-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-400">
          {styleLabel(product)}
        </p>
        <p className="text-sm font-medium line-clamp-1">{product.title}</p>
        <div className="flex items-center gap-2 mt-1 text-sm">
          {discount > 0 ? (
            <>
              <span className="text-red-600 font-semibold">
                {formatPrice(price)}
              </span>
              <span className="text-neutral-400 line-through text-xs">
                {formatPrice(compareAtPrice)}
              </span>
            </>
          ) : (
            <span>{formatPrice(price)}</span>
          )}
        </div>
        {variant && (
          <p className="text-xs text-neutral-500 mt-1">
            {variant.option1} · {variant.option2}
          </p>
        )}
      </div>
    </Link>
  );
}
