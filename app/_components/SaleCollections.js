"use client";

import { useState } from "react";
import SaleProductCard from "@/_components/SaleProductCard";
import { CATEGORIES } from "@/_lib/shopify";

export default function SaleCollections({ products }) {
  const [active, setActive] = useState(CATEGORIES[0]);

  const items = products.filter(
    (p) =>
      (p.product_type || "").toLowerCase() === active.toLowerCase() &&
      (p.tags || []).some((t) => t.toLowerCase() === "sale")
  );

  return (
    <section className="container-page py-10">
      <h2 className="text-lg md:text-2xl font-semibold mb-4">
        Featured Collections
      </h2>

      <div className="flex gap-6 border-b border-black/10 mb-6 text-sm font-medium">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`pb-3 -mb-px border-b-2 ${
              active === category
                ? "border-black text-black"
                : "border-transparent text-neutral-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          No sale items in this category right now.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((product) => (
            <SaleProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
