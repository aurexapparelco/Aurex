"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  cartCount,
  cartSubtotal,
  type CartItem,
} from "@/lib/cart";
import { CART_EVENT } from "@/lib/constants";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(() => setItems(getCart()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    return () => window.removeEventListener(CART_EVENT, refresh);
  }, [refresh]);

  return {
    items,
    count: cartCount(items),
    subtotal: cartSubtotal(items),
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
  };
}
