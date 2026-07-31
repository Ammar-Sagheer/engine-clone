"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "New In", href: "/collections/new-in" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Boys", href: "/collections/boys" },
  { label: "Girls", href: "/collections/girls" },
];

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black/10">
      <div className="container-page flex items-center justify-between h-16 gap-4">
        <button
          className="md:hidden text-sm"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <Link href="/" className="text-xl font-bold tracking-widest">
          ENGINE
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/search" aria-label="Search">
            🔍
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            🛍️
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-black/10 px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
