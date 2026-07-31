"use client";

import { useMemo, useState } from "react";
import { getProductPrice, formatPrice } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ product }) {
  const images = product.images || [];
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

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

  function optionValues(name) {
    const idx = optionNames.indexOf(name) + 1;
    return [...new Set(product.variants.map((v) => v[`option${idx}`]))];
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
  }

  return (
    <div className="container-page py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
          {images[activeImage] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[activeImage].src}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-20 bg-neutral-100 overflow-hidden border ${
                  i === activeImage ? "border-black" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span
            className={`text-lg ${
              displayCompare && displayCompare > displayPrice
                ? "text-red-600 font-semibold"
                : ""
            }`}
          >
            {formatPrice(displayPrice)}
          </span>
          {displayCompare && displayCompare > displayPrice && (
            <span className="text-neutral-400 line-through">
              {formatPrice(displayCompare)}
            </span>
          )}
        </div>

        {optionNames.map((name) => (
          <div key={name} className="mt-6">
            <p className="text-sm font-medium mb-2">{name}</p>
            <div className="flex flex-wrap gap-2">
              {optionValues(name).map((value) => (
                <button
                  key={value}
                  onClick={() => setSelected((s) => ({ ...s, [name]: value }))}
                  className={`px-3 py-2 text-sm border ${
                    selected[name] === value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleAddToCart}
          disabled={!matchedVariant?.available}
          className="mt-8 w-full bg-black text-white py-3 font-semibold tracking-wide disabled:opacity-40"
        >
          {matchedVariant?.available ? "Add to Cart" : "Sold Out"}
        </button>

        {product.body_html && (
          <div
            className="prose prose-sm max-w-none mt-8 text-neutral-600"
            dangerouslySetInnerHTML={{ __html: product.body_html }}
          />
        )}
      </div>
    </div>
  );
}
