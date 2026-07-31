"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/shopify";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <div className="container-page py-10">
      <input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-neutral-300 px-4 py-3 mb-8"
        autoFocus
      />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
