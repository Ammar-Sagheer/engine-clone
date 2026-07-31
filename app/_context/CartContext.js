"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "engine-clone-cart";

/**
 * The cart lives in localStorage, which the server can't see. Reading it
 * during the first client render is what caused the hydration mismatch
 * (server said 0 items, client said 4). useSyncExternalStore is built for
 * this: React renders `getServerSnapshot` during hydration, then swaps to
 * the real snapshot immediately afterwards — no mismatch, no flash of
 * stale markup that we'd have to paper over with a `mounted` flag.
 */
const EMPTY = [];

let cache = EMPTY;
let loaded = false;
const listeners = new Set();

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  if (!loaded) {
    cache = readStorage();
    loaded = true;
  }
  // Must be referentially stable between renders or React loops forever.
  return cache;
}

function getServerSnapshot() {
  return EMPTY;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);

  // Keep other tabs in sync.
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next) {
  cache = next;
  loaded = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full or unavailable — keep the in-memory cart working
  }
  emit();
}

export function CartProvider({ children }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item) => {
    const current = getSnapshot();
    const existing = current.find((i) => i.variantId === item.variantId);

    commit(
      existing
        ? current.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...current, item]
    );
  }, []);

  const removeItem = useCallback((variantId) => {
    commit(getSnapshot().filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    commit(
      getSnapshot().map((i) =>
        i.variantId === variantId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => commit(EMPTY), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
