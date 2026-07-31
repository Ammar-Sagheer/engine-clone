import Link from "next/link";
import { getProductPrice, formatPrice } from "@/_lib/format";
import { styleLabel } from "@/_lib/subcategories";

/**
 * Shared product tile. `compact` is used inside horizontal rails, where the
 * card needs a fixed width instead of filling a grid cell.
 */
export default function ProductCard({ product, compact = false }) {
  const { price, compareAtPrice } = getProductPrice(product);
  const [primary, secondary] = product.images || [];
  const variant = product.variants?.[0];
  const onSale = compareAtPrice && compareAtPrice > price;
  const discount = onSale ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const soldOut = product.variants?.every((v) => !v.available);

  return (
    <Link
      href={`/products/${product.handle}`}
      className={`group block ${compact ? "w-[46vw] sm:w-56 shrink-0" : ""}`}
    >
      <div className="relative aspect-[4/5] bg-[#f4f4f4] overflow-hidden">
        {primary && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primary.src}
              alt={product.title}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                secondary ? "group-hover:opacity-0" : ""
              }`}
            />
            {secondary && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={secondary.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        )}

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-sale text-white text-[10px] font-semibold tracking-wider px-2 py-1">
            -{discount}%
          </span>
        )}

        {soldOut && (
          <span className="absolute top-3 right-3 bg-white/90 text-[10px] font-semibold tracking-wider px-2 py-1">
            SOLD OUT
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-foreground text-white text-[11px] font-semibold tracking-[0.14em] uppercase text-center py-3">
          Choose Options
        </span>
      </div>

      <div className="pt-3">
        <p className="eyebrow">{styleLabel(product)}</p>
        <h3 className="text-[13px] md:text-sm font-medium mt-1 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span
            className={`text-[13px] md:text-sm ${
              onSale ? "text-sale font-semibold" : "font-medium"
            }`}
          >
            {formatPrice(price)}
          </span>
          {onSale && (
            <span className="text-muted line-through text-xs">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
        {variant?.option1 && (
          <p className="text-[11px] text-muted mt-1">{variant.option1}</p>
        )}
      </div>
    </Link>
  );
}
