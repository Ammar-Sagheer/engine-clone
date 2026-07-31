import Link from "next/link";
import { getProductPrice, formatPrice } from "@/lib/shopify";

export default function ProductCard({ product }) {
  const { price, compareAtPrice } = getProductPrice(product);
  const image = product.images?.[0];
  const onSale = compareAtPrice && compareAtPrice > price;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
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
        {onSale && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 tracking-wide">
            SALE
          </span>
        )}
      </div>
      <div className="pt-3">
        <p className="text-sm font-medium line-clamp-1">{product.title}</p>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <span className={onSale ? "text-red-600 font-semibold" : ""}>
            {formatPrice(price)}
          </span>
          {onSale && (
            <span className="text-neutral-400 line-through text-xs">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
