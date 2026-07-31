"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/_components/ProductCard";
import { SearchIcon } from "@/_components/Icons";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/products?q=${encodeURIComponent(query)}&limit=48`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setResults(data.products);
          setTotal(data.total);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") setLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

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
      ) : results.length === 0 ? (
        <p className="text-center text-muted text-sm py-16">
          Nothing matched that search. Try another term.
        </p>
      ) : (
        <>
          <p className="text-[13px] text-muted mb-8">
            Showing {results.length} of {total}{" "}
            {total === 1 ? "product" : "products"}
            {query.trim() && ` for “${query.trim()}”`}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
