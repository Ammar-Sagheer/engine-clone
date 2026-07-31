"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getProductPrice, formatPrice } from "@/_lib/shopify";
import { styleLabel } from "@/_lib/subcategories";
import { useCart } from "@/_context/CartContext";

export default function ProductDetail({ product }) {
  const images = product.images || [];
  const [activeImage, setActiveImage] = useState(0);
  const { addItem, openCart } = useCart();

  const optionNames = useMemo(
    () => product.options?.map((o) => o.name) || [],
    [product.options]
  );
  const [selected, setSelected] = useState(() => {
    const initial = {};
    optionNames.forEach((name, i) => {
      initial[name] = product.variants[0]?.[`option${i + 1}`];
    });
    return initial;
  });

  const matchedVariant = useMemo(() => {
    return product.variants.find((v) =>
      optionNames.every((name, i) => v[`option${i + 1}`] === selected[name])
    );
  }, [product.variants, optionNames, selected]);

  const { price, compareAtPrice } = getProductPrice(product);
  const displayPrice = matchedVariant ? parseFloat(matchedVariant.price) : price;
  const displayCompare = matchedVariant?.compare_at_price
    ? parseFloat(matchedVariant.compare_at_price)
    : compareAtPrice;
  const onSale = displayCompare && displayCompare > displayPrice;
  const discount = onSale
    ? Math.round((1 - displayPrice / displayCompare) * 100)
    : 0;

  function optionValues(name) {
    const idx = optionNames.indexOf(name) + 1;
    return [...new Set(product.variants.map((v) => v[`option${idx}`]))];
  }

  /** A value is unavailable if no variant matching the other picks has stock. */
  function isValueAvailable(name, value) {
    const idx = optionNames.indexOf(name) + 1;
    return product.variants.some(
      (v) => v[`option${idx}`] === value && v.available
    );
  }

  function handleAddToCart() {
    if (!matchedVariant) return;
    addItem({
      variantId: matchedVariant.id,
      productHandle: product.handle,
      title: product.title,
      variantTitle: matchedVariant.title,
      price: parseFloat(matchedVariant.price),
      image: images[0]?.src,
      quantity: 1,
    });
    openCart();
  }

  const category = (product.product_type || "").toLowerCase();

  return (
    <div className="container-page py-8 md:py-12">
      <nav className="text-[11px] tracking-[0.14em] uppercase text-muted mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/collections/${category}`}
          className="hover:text-foreground transition-colors"
        >
          {product.product_type}
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`w-16 h-20 shrink-0 bg-[#f4f4f4] overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-foreground" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="relative flex-1 aspect-[4/5] bg-[#f4f4f4] overflow-hidden">
            {images[activeImage] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeImage].src}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-sale text-white text-[11px] font-semibold tracking-wider px-2.5 py-1.5">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        <div className="md:pt-2">
          <p className="eyebrow">{styleLabel(product)}</p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-2">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-3 mt-4 pb-6 border-b border-line">
            <span
              className={`text-xl ${onSale ? "text-sale font-semibold" : "font-medium"}`}
            >
              {formatPrice(displayPrice)}
            </span>
            {onSale && (
              <span className="text-muted line-through text-sm">
                {formatPrice(displayCompare)}
              </span>
            )}
          </div>

          {optionNames.map((name) => (
            <div key={name} className="mt-7">
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase">
                  {name}
                </p>
                <p className="text-[13px] text-muted">{selected[name]}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {optionValues(name).map((value) => {
                  const isActive = selected[name] === value;
                  const available = isValueAvailable(name, value);
                  return (
                    <button
                      key={value}
                      onClick={() => setSelected((s) => ({ ...s, [name]: value }))}
                      className={`min-w-[3rem] px-3.5 py-2.5 text-[13px] border transition-colors ${
                        isActive
                          ? "border-foreground bg-foreground text-white"
                          : "border-line hover:border-foreground"
                      } ${!available ? "opacity-40 line-through" : ""}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={handleAddToCart}
            disabled={!matchedVariant?.available}
            className="btn btn-primary w-full mt-9"
          >
            {matchedVariant?.available ? "Add to Cart" : "Sold Out"}
          </button>

          {product.body_html && (
            <div className="mt-10 pt-8 border-t border-line">
              <h2 className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-4">
                Details
              </h2>
              <div
                className="text-[13px] text-muted leading-relaxed [&_p]:mb-3 [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: product.body_html }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
