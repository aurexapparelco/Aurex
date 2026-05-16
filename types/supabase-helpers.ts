import type { Order, OrderLine, Product, ProductType, ProductVariant, Inventory } from "./database.types";

export type OrderWithLines = Order & { order_lines: OrderLine[] };

export type ProductWithType = Product & {
  product_types: Pick<ProductType, "id" | "name"> | null;
};

export type ProductWithVariantsAndInventory = Product & {
  product_types: Pick<ProductType, "id" | "name"> | null;
  product_variants: (ProductVariant & { inventory: Inventory[] })[];
};

export type ProductWithVariantColors = Product & {
  product_types: Pick<ProductType, "id" | "name"> | null;
  product_variants: Pick<ProductVariant, "id" | "color" | "hex">[];
};

export type OrderRow = Pick<Order, "id" | "order_number" | "status" | "total" | "created_at" | "first_name" | "last_name" | "email" | "city" | "zone">;
