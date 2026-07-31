"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/shopify";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg mb-4">Your cart is empty.</p>
        <Link href="/" className="underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 border-b border-black/10 pb-6">
            {item.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-32 object-cover bg-neutral-100"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-neutral-500">{item.variantTitle}</p>
              <p className="mt-2">{formatPrice(item.price)}</p>

              <div className="flex items-center gap-3 mt-3">
                <label className="text-sm">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.variantId, Math.max(1, Number(e.target.value)))
                  }
                  className="w-16 border border-neutral-300 px-2 py-1 text-sm"
                />
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-sm underline text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button className="w-full bg-black text-white py-3 font-semibold tracking-wide">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
