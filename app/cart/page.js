"use client";

import Link from "next/link";
import { useCart } from "@/_context/CartContext";
import { formatPrice } from "@/_lib/shopify";
import { BagIcon } from "@/_components/Icons";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-24 md:py-32 text-center">
        <BagIcon className="w-10 h-10 mx-auto text-muted" />
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight mt-6">
          Your cart is empty
        </h1>
        <p className="text-[13px] text-muted mt-3 mb-8">
          Once you add something, it&apos;ll show up here.
        </p>
        <Link href="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <header className="border-b border-line pb-6 mb-8">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
          Shopping Bag
        </h1>
        <p className="text-[13px] text-muted mt-2">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
        <ul>
          {items.map((item) => (
            <li
              key={item.variantId}
              className="flex gap-5 py-6 border-b border-line first:pt-0"
            >
              <Link
                href={`/products/${item.productHandle}`}
                className="shrink-0 w-24 md:w-28 aspect-[4/5] bg-[#f4f4f4] overflow-hidden"
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
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.productHandle}`}
                      className="text-sm font-medium link-underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-[13px] text-muted mt-1">
                      {item.variantTitle}
                    </p>
                  </div>
                  <p className="text-sm font-medium whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto pt-4">
                  <div className="inline-flex items-center border border-line">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.variantId,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      aria-label="Decrease quantity"
                      className="w-9 h-9 hover:bg-[#f4f4f4] transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-[13px] tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                      className="w-9 h-9 hover:bg-[#f4f4f4] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-[12px] tracking-[0.1em] uppercase text-muted hover:text-sale transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-32 border border-line p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-5">
            Order Summary
          </h2>
          <div className="flex justify-between text-[13px] text-muted mb-3">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[13px] text-muted pb-4 border-b border-line">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-semibold pt-4 mb-6">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button className="btn btn-primary w-full">Checkout</button>
          <Link
            href="/"
            className="block text-center text-[12px] tracking-[0.1em] uppercase text-muted hover:text-foreground transition-colors mt-4"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
