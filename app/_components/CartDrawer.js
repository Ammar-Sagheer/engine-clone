"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/_context/CartContext";
import { formatPrice } from "@/_lib/shopify";
import { CloseIcon, BagIcon } from "@/_components/Icons";

export default function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  // Close on Escape, and stop the page behind the drawer from scrolling.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCart();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`fixed top-0 right-0 z-50 h-[100dvh] w-full sm:max-w-[420px] bg-white flex flex-col shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-line shrink-0">
          <h2 className="text-[12px] font-semibold tracking-[0.16em] uppercase">
            Shopping Bag ({count})
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="-mr-2 p-2 hover:opacity-60 transition-opacity"
          >
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <BagIcon className="w-9 h-9 text-muted" />
            <p className="text-sm font-medium mt-5">Your bag is empty</p>
            <p className="text-[13px] text-muted mt-2 mb-7">
              Once you add something, it&apos;ll show up here.
            </p>
            <button onClick={closeCart} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 sm:px-6">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex gap-4 py-5 border-b border-line"
                >
                  <Link
                    href={`/products/${item.productHandle}`}
                    onClick={closeCart}
                    className="shrink-0 w-20 aspect-[4/5] bg-[#f4f4f4] overflow-hidden"
                  >
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <Link
                        href={`/products/${item.productHandle}`}
                        onClick={closeCart}
                        className="text-[13px] font-medium leading-snug line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[13px] font-medium whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="text-[12px] text-muted mt-1">
                      {item.variantTitle}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3">
                      <div className="inline-flex items-center border border-line">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.variantId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          aria-label="Decrease quantity"
                          className="w-8 h-8 hover:bg-[#f4f4f4] transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-[13px] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-8 h-8 hover:bg-[#f4f4f4] transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-[11px] tracking-[0.1em] uppercase text-muted hover:text-sale transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line px-5 sm:px-6 py-5 shrink-0">
              <div className="flex justify-between font-semibold mb-1">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[12px] text-muted mb-4">
                Shipping calculated at checkout.
              </p>
              <button className="btn btn-primary w-full">Checkout</button>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block text-center text-[12px] tracking-[0.1em] uppercase text-muted hover:text-foreground transition-colors mt-4"
              >
                View Full Cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
