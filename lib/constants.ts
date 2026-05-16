export const SHIPPING_ZONES = {
  Colombo: { fee: 350, days: "1–2" },
  Suburbs: { fee: 550, days: "2–3" },
  "Other Districts": { fee: 750, days: "3–5" },
} as const;

export const EXPRESS_FEE = 1_200;
export const FREE_SHIPPING_THRESHOLD = 15_000;

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const COLORS = ["Black", "White", "Navy"] as const;
export type Color = (typeof COLORS)[number];

export const DESIGN_TYPES = ["Plain", "Premium"] as const;
export type DesignType = (typeof DESIGN_TYPES)[number];

export const ORDER_STATUSES = [
  "Awaiting Payment",
  "Paid",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STAFF_ROLES = ["Owner", "Operations", "Fulfilment"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const CART_STORAGE_KEY = "aurex_cart";
export const CART_EVENT = "aurex_cart_changed";

export const BANK_DETAILS = {
  bank: "Commercial Bank of Ceylon",
  accountName: "Auréx Atelier (Pvt) Ltd",
  accountNumber: "",   // fill in: e.g. "8001234567"
  branch: "",          // fill in: e.g. "Colombo 03"
} as const;

export const fmtLKR = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;

export function calcShipping(
  subtotal: number,
  zone: keyof typeof SHIPPING_ZONES,
  method: "standard" | "express",
): number {
  if (method === "express") return EXPRESS_FEE;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_ZONES[zone].fee;
}

export function generateOrderNumber(): string {
  return "AX-" + Math.floor(100000 + Math.random() * 900000);
}
