export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      product_types: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_types"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["product_types"]["Row"]>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          type_id: string | null;
          price: number;
          compare_at: number | null;
          fabric: string;
          gsm: number;
          weight_grams: number;
          fit: string;
          care: string;
          model_info: string;
          fit_note: string;
          origin: string;
          description: string;
          tags: string[];
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          color: string;
          hex: string;
          images: string[];
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Row"]>;
      };
      inventory: {
        Row: {
          variant_id: string;
          size: "S" | "M" | "L" | "XL" | "XXL";
          qty: number;
        };
        Insert: Database["public"]["Tables"]["inventory"]["Row"];
        Update: Partial<Database["public"]["Tables"]["inventory"]["Row"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          phone2: string;
          address: string;
          city: string;
          postal: string;
          delivery_note: string | null;
          shipping_method: "standard" | "express";
          shipping_fee: number;
          subtotal: number;
          total: number;
          payment_method: string;
          status: string;
          created_at: string;
          billing_first_name: string | null;
          billing_last_name: string | null;
          billing_address: string | null;
          billing_city: string | null;
          billing_postal: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      order_lines: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          color: string;
          size: string;
          qty: number;
          unit_price: number;
        };
        Insert: Omit<Database["public"]["Tables"]["order_lines"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["order_lines"]["Row"]>;
      };
      customers: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          city: string | null;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["customers"]["Row"];
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
      };
      staff: {
        Row: {
          id: string;
          role: "Owner" | "Operations" | "Fulfilment";
        };
        Insert: Database["public"]["Tables"]["staff"]["Row"];
        Update: Partial<Database["public"]["Tables"]["staff"]["Row"]>;
      };
      courier_cities: {
        Row: {
          id: number;
          name: string;
          charge_first_kg: number;
          charge_per_additional_kg: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["courier_cities"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["courier_cities"]["Row"]>;
      };
      home_content: {
        Row: {
          id: number;
          hero: Json;
          feature_strip: Json;
          collection_cards: Json;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["home_content"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["home_content"]["Row"]>;
      };
      settings: {
        Row: {
          id: number;
          bank_name: string;
          bank_account_name: string;
          bank_account_number: string;
          bank_branch: string;
          zone_colombo_fee: number;
          zone_colombo_days: string;
          zone_suburbs_fee: number;
          zone_suburbs_days: string;
          zone_other_fee: number;
          zone_other_days: string;
          express_fee: number;
          free_shipping_threshold: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type ProductType = Database["public"]["Tables"]["product_types"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderLine = Database["public"]["Tables"]["order_lines"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Staff = Database["public"]["Tables"]["staff"]["Row"];
export type Settings = Database["public"]["Tables"]["settings"]["Row"];

export type ProductWithVariants = Product & {
  product_types: Pick<ProductType, "id" | "name"> | null;
  product_variants: (ProductVariant & {
    inventory: Inventory[];
  })[];
};
