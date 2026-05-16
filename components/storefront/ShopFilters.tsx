"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { ProductType } from "@/types/database.types";

interface Props {
  types: Pick<ProductType, "id" | "name">[];
  activeType?: string;
  activeTag?: string;
  activeSort?: string;
}

const TAGS = [
  { value: "", label: "All Tags" },
  { value: "New Arrival", label: "New Arrivals" },
  { value: "Featured", label: "Featured" },
];

const SORTS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function ShopFilters({ types, activeType, activeTag, activeSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  const typeOptions = [{ name: "", label: "All" }, ...types.map((t) => ({ name: t.name, label: t.name }))];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Type filter — built from DB */}
      <div className="flex gap-1 p-1 rounded" style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}>
        {typeOptions.map(({ name, label }) => {
          const active = (activeType ?? "") === name;
          return (
            <button
              key={name}
              onClick={() => updateFilter("type", name)}
              className="px-3 py-1.5 rounded text-xs tracking-wide transition-all"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: active ? "var(--color-gold-400)" : "transparent",
                color: active ? "var(--color-void)" : "var(--color-fg-muted)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tag filter */}
      <div className="flex gap-1 p-1 rounded" style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}>
        {TAGS.map(({ value, label }) => {
          const active = (activeTag ?? "") === value;
          return (
            <button
              key={value}
              onClick={() => updateFilter("tag", value)}
              className="px-3 py-1.5 rounded text-xs tracking-wide transition-all"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: active ? "var(--color-gold-400)" : "transparent",
                color: active ? "var(--color-void)" : "var(--color-fg-muted)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <div className="ml-auto">
        <select
          value={activeSort ?? ""}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="px-3 py-2 rounded text-xs outline-none"
          style={{
            backgroundColor: "var(--color-dark-forest)",
            border: "1px solid var(--color-card-border)",
            color: "var(--color-fg-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          {SORTS.map(({ value, label }) => (
            <option key={value} value={value} style={{ backgroundColor: "var(--color-dark-forest)" }}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
