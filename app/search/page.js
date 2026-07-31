"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/_components/ProductCard";
import { SearchIcon } from "@/_components/Icons";
import { getAllProducts } from "@/_lib/shopify";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.product_type || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [products, query]);

  return (
    <div className="container-page py-10 md:py-14">
      <header className="max-w-xl mx-auto text-center mb-10">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-6">
          Search
        </h1>
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="What are you looking for?"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-line pl-12 pr-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
            autoFocus
          />
        </div>
      </header>

      {loading ? (
        <p className="text-center text-muted text-sm py-16">Loading…</p>
      ) : (
        <>
          <p className="text-[13px] text-muted mb-8">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {query.trim() && ` for “${query.trim()}”`}
          </p>

          {filtered.length === 0 ? (
            <p className="text-center text-muted text-sm py-16">
              Nothing matched that search. Try another term.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
