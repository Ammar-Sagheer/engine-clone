"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/_context/CartContext";
import { SearchIcon, BagIcon, MenuIcon, CloseIcon } from "@/_components/Icons";

const NAV_LINKS = [
  { label: "New In", href: "/collections/new-in" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Boys", href: "/collections/boys" },
  { label: "Girls", href: "/collections/girls" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="bg-foreground text-white text-center text-[11px] tracking-[0.18em] uppercase py-2">
        Season Sale — Up To 50% Off
      </div>

      <div className="container-page grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-20">
        <div className="flex items-center">
          <button
            className="md:hidden -ml-1 p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-[0.08em] uppercase">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`link-underline transition-opacity ${
                    active ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/"
          className="text-xl md:text-2xl font-bold tracking-[0.32em] pl-[0.32em]"
        >
          ENGINE
        </Link>

        <div className="flex items-center justify-end gap-5">
          <Link
            href="/search"
            aria-label="Search"
            className="hover:opacity-60 transition-opacity"
          >
            <SearchIcon />
          </Link>
          <button
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative hover:opacity-60 transition-opacity"
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-foreground text-white text-[10px] leading-none font-semibold rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-line">
          <nav className="container-page py-2 flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm font-medium tracking-[0.08em] uppercase border-b border-line last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
