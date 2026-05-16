"use client";

import { CART_STORAGE_KEY, CART_EVENT } from "@/lib/constants";

export interface CartItem {
  key: string;
  productId: string;
  productName: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  image: string;
  qty: number;
}

export function cartKey(productId: string, color: string, size: string) {
  return `${productId}__${color}__${size}`;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function addToCart(item: Omit<CartItem, "key">) {
  const items = getCart();
  const key = cartKey(item.productId, item.color, item.size);
  const existing = items.find((i) => i.key === key);
  if (existing) {
    existing.qty += item.qty;
  } else {
    items.push({ ...item, key });
  }
  saveCart(items);
}

export function updateCartQty(key: string, qty: number) {
  const items = getCart();
  if (qty <= 0) {
    saveCart(items.filter((i) => i.key !== key));
  } else {
    const item = items.find((i) => i.key === key);
    if (item) item.qty = qty;
    saveCart(items);
  }
}

export function removeFromCart(key: string) {
  saveCart(getCart().filter((i) => i.key !== key));
}

export function clearCart() {
  saveCart([]);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
