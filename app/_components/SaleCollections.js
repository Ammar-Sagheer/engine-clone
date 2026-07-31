"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/_components/ProductCard";
import { ArrowRightIcon } from "@/_components/Icons";
import { CATEGORIES } from "@/_lib/format";

/**
 * `collections` is a small precomputed { category: products[] } map. The page
 * deliberately doesn't pass the whole catalogue here — everything a client
 * component receives is serialised into the RSC payload sent to the browser.
 */
export default function SaleCollections({ collections }) {
  const [active, setActive] = useState(CATEGORIES[0]);
  const items = collections[active] || [];

  return (
    <section className="container-page py-14 md:py-20">
      <div className="text-center mb-8">
        <p className="eyebrow">On Sale Now</p>
        <h2 className="section-title mt-2">Featured Collections</h2>
      </div>

      <div className="flex justify-center gap-6 sm:gap-8 border-b border-line mb-8">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`relative pb-4 text-[13px] font-medium tracking-[0.12em] uppercase transition-colors ${
              active === category
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {category}
            {active === category && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-muted text-sm text-center py-8">
          No sale items in this category right now.
        </p>
      ) : (
        <div className="rail no-scrollbar -mx-5 px-5 md:-mx-10 md:px-10">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <Link
          href={`/collections/${active.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase link-underline"
        >
          Shop All {active}
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
