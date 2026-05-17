"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProductType } from "@/types/database.types";
import ImageUpload from "@/components/admin/ImageUpload";

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
const AVAILABLE_TAGS = ["Featured", "New Arrival"] as const;

interface VariantState {
  _key: string;
  id?: string;
  color: string;
  hex: string;
  images: string[];
  inventory: Record<string, string>;
}

interface InitialVariant {
  id: string;
  color: string;
  hex: string;
  images: string[];
  inventory: { size: string; qty: number }[];
}

interface Props {
  mode: "new" | "edit";
  productTypes: ProductType[];
  initialData?: {
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
    product_variants: InitialVariant[];
  };
}

function makeKey() {
  return Math.random().toString(36).slice(2);
}

function slugify(name: string) {
  return "ax-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductForm({ mode, productTypes, initialData }: Props) {
  const router = useRouter();
  const isEdit = mode === "edit";

  // ── Basic fields ──────────────────────────────────────────────────────────
  const [slug, setSlug] = useState(initialData?.id ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [name, setName] = useState(initialData?.name ?? "");
  const [typeId, setTypeId] = useState(initialData?.type_id ?? "");
  const [price, setPrice] = useState(String(initialData?.price ?? ""));
  const [compareAt, setCompareAt] = useState(String(initialData?.compare_at ?? ""));
  const [fabric, setFabric] = useState(initialData?.fabric ?? "");
  const [gsm, setGsm] = useState(String(initialData?.gsm ?? "200"));
  const [weightGrams, setWeightGrams] = useState(String(initialData?.weight_grams ?? "275"));
  const [fit, setFit] = useState(initialData?.fit ?? "");
  const [care, setCare] = useState(initialData?.care ?? "");
  const [modelInfo, setModelInfo] = useState(initialData?.model_info ?? "");
  const [fitNote, setFitNote] = useState(initialData?.fit_note ?? "");
  const [origin, setOrigin] = useState(initialData?.origin ?? "Made in Sri Lanka");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);

  // ── Variants ──────────────────────────────────────────────────────────────
  const [variants, setVariants] = useState<VariantState[]>(() => {
    if (initialData?.product_variants?.length) {
      return initialData.product_variants.map((v) => ({
        _key: makeKey(),
        id: v.id,
        color: v.color,
        hex: v.hex,
        images: v.images,
        inventory: Object.fromEntries(
          SIZES.map((s) => [s, String(v.inventory.find((i) => i.size === s)?.qty ?? 0)])
        ),
      }));
    }
    return [{ _key: makeKey(), color: "", hex: "#000000", images: [], inventory: Object.fromEntries(SIZES.map((s) => [s, "0"])) }];
  });

  // ── Removed variant IDs (for edit cleanup) ────────────────────────────────
  const [removedVariantIds, setRemovedVariantIds] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleNameChange(val: string) {
    setName(val);
    if (!slugManual) setSlug(slugify(val));
  }

  function toggleTag(tag: string) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { _key: makeKey(), color: "", hex: "#000000", images: [], inventory: Object.fromEntries(SIZES.map((s) => [s, "0"])) },
    ]);
  }

  function removeVariant(key: string) {
    const v = variants.find((v) => v._key === key);
    if (v?.id) setRemovedVariantIds((prev) => [...prev, v.id!]);
    setVariants((prev) => prev.filter((v) => v._key !== key));
  }

  function updateVariant(key: string, patch: Partial<Omit<VariantState, "_key">>) {
    setVariants((prev) => prev.map((v) => v._key === key ? { ...v, ...patch } : v));
  }

  function updateInventory(key: string, size: string, qty: string) {
    setVariants((prev) =>
      prev.map((v) => v._key === key ? { ...v, inventory: { ...v.inventory, [size]: qty } } : v)
    );
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!slug.trim()) { setError("Product ID (slug) is required."); return; }
    if (!name.trim()) { setError("Product name is required."); return; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { setError("A valid price is required."); return; }
    if (variants.length === 0) { setError("Add at least one variant."); return; }
    for (const v of variants) {
      if (!v.color.trim()) { setError("Each variant needs a color name."); return; }
    }

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createClient() as unknown as any;

    const productPayload = {
      id: slug.trim(),
      name: name.trim(),
      type_id: typeId || null,
      price: Number(price),
      compare_at: compareAt ? Number(compareAt) : null,
      fabric: fabric.trim(),
      gsm: Number(gsm) || 200,
      weight_grams: Number(weightGrams) || 275,
      fit: fit.trim(),
      care: care.trim(),
      model_info: modelInfo.trim(),
      fit_note: fitNote.trim(),
      origin: origin.trim() || "Made in Sri Lanka",
      description: description.trim(),
      tags,
    };

    if (isEdit) {
      const { error: err } = await sb.from("products").update(productPayload).eq("id", slug.trim());
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await sb.from("products").insert(productPayload);
      if (err) {
        setError(err.message.includes("duplicate") ? `A product with ID "${slug}" already exists.` : err.message);
        setSaving(false);
        return;
      }
    }

    // Delete removed variants (cascade deletes inventory)
    if (removedVariantIds.length > 0) {
      await sb.from("product_variants").delete().in("id", removedVariantIds);
    }

    // Upsert variants + inventory
    for (const v of variants) {
      let variantId = v.id;
      const variantPayload = {
        product_id: slug.trim(),
        color: v.color.trim(),
        hex: v.hex,
        images: v.images,
      };

      if (variantId) {
        await sb.from("product_variants").update(variantPayload).eq("id", variantId);
      } else {
        const { data: newVariant, error: varErr } = await sb
          .from("product_variants")
          .insert(variantPayload)
          .select("id")
          .single();
        if (varErr) { setError(varErr.message); setSaving(false); return; }
        variantId = newVariant.id;
      }

      // Upsert inventory rows
      const invRows = SIZES.map((size) => ({
        variant_id: variantId,
        size,
        qty: Math.max(0, parseInt(v.inventory[size] ?? "0", 10) || 0),
      }));
      await sb.from("inventory").upsert(invRows, { onConflict: "variant_id,size" });
    }

    router.push("/admin/products");
    router.refresh();
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputCls = "w-full px-4 py-2.5 rounded-sm text-sm outline-none";
  const inputStyle = {
    backgroundColor: "var(--color-forest)",
    border: "1px solid var(--color-card-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-body)",
  };
  const labelCls = "block text-xs tracking-[0.12em] uppercase mb-1.5";
  const labelStyle = { color: "var(--color-fg-muted)" };
  const sectionHd = "text-xs tracking-[0.18em] uppercase font-normal pb-3 mb-5 border-b";
  const sectionHdStyle = { color: "var(--color-gold-200)", borderColor: "var(--color-card-border)" };

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-10">

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <section>
        <h2 className={sectionHd} style={sectionHdStyle}>Basic Info</h2>
        <div className="grid grid-cols-2 gap-5">

          {/* Slug */}
          <div className="col-span-2">
            <label className={labelCls} style={labelStyle}>Product ID (slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="ax-polo-black"
              readOnly={isEdit}
              className={inputCls}
              style={{ ...inputStyle, opacity: isEdit ? 0.6 : 1, fontFamily: "var(--font-mono)" }}
            />
            {!isEdit && (
              <p className="text-xs mt-1" style={{ color: "var(--color-fg-tertiary)" }}>
                Lowercase, hyphens only. Auto-generated from name — edit to customise.
              </p>
            )}
          </div>

          {/* Name */}
          <div className="col-span-2">
            <label className={labelCls} style={labelStyle}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Auréx Classic Polo"
              required
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Type */}
          <div>
            <label className={labelCls} style={labelStyle}>Product Type</label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className={inputCls}
              style={inputStyle}
            >
              <option value="">— Select type —</option>
              {productTypes.map((t) => (
                <option key={t.id} value={t.id} style={{ backgroundColor: "var(--color-forest)" }}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className={labelCls} style={labelStyle}>Price (LKR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4900"
              min="0"
              required
              className={inputCls}
              style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Compare At */}
          <div>
            <label className={labelCls} style={labelStyle}>Compare-at Price (LKR) — optional</label>
            <input
              type="number"
              value={compareAt}
              onChange={(e) => setCompareAt(e.target.value)}
              placeholder="Leave blank if not on sale"
              min="0"
              className={inputCls}
              style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls} style={labelStyle}>Tags</label>
            <div className="flex gap-4 pt-1">
              {AVAILABLE_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="accent-[var(--color-gold-400)]"
                  />
                  <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Description & Details ─────────────────────────────────────────── */}
      <section>
        <h2 className={sectionHd} style={sectionHdStyle}>Description & Details</h2>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className={labelCls} style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the product…"
              className={inputCls}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Fabric</label>
            <input type="text" value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="100% Supima Cotton" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>GSM</label>
            <input type="number" value={gsm} onChange={(e) => setGsm(e.target.value)} placeholder="200" min="1" className={inputCls} style={{ ...inputStyle, fontFamily: "var(--font-mono)" }} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Item Weight (grams)</label>
            <input type="number" value={weightGrams} onChange={(e) => setWeightGrams(e.target.value)} placeholder="275" min="1" className={inputCls} style={{ ...inputStyle, fontFamily: "var(--font-mono)" }} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Fit</label>
            <input type="text" value={fit} onChange={(e) => setFit(e.target.value)} placeholder="Regular Fit" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Care</label>
            <input type="text" value={care} onChange={(e) => setCare(e.target.value)} placeholder="Machine wash cold…" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Model Info</label>
            <input type="text" value={modelInfo} onChange={(e) => setModelInfo(e.target.value)} placeholder="Model is 6'1&quot; wearing size M" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Fit Note</label>
            <input type="text" value={fitNote} onChange={(e) => setFitNote(e.target.value)} placeholder="True to size." className={inputCls} style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={labelStyle}>Origin</label>
            <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Made in Sri Lanka" className={inputCls} style={inputStyle} />
          </div>
        </div>
      </section>

      {/* ── Variants ─────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between pb-3 mb-5 border-b" style={{ borderColor: "var(--color-card-border)" }}>
          <h2 className="text-xs tracking-[0.18em] uppercase" style={{ color: "var(--color-gold-200)" }}>
            Variants & Inventory
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs px-3 py-1.5 rounded-sm"
            style={{
              backgroundColor: "rgba(212,162,76,0.12)",
              border: "1px solid rgba(212,162,76,0.3)",
              color: "var(--color-gold-200)",
            }}
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-6">
          {variants.map((v, vi) => (
            <div
              key={v._key}
              className="rounded-sm p-5"
              style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-[0.12em] uppercase" style={{ color: "var(--color-fg-tertiary)" }}>
                  Variant {vi + 1}
                </span>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(v._key)}
                    className="text-xs"
                    style={{ color: "#ff8a8a" }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <label className={labelCls} style={labelStyle}>Colour Name</label>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => updateVariant(v._key, { color: e.target.value })}
                    placeholder="Black, White, Navy…"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Hex Code</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={v.hex}
                      onChange={(e) => updateVariant(v._key, { hex: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={v.hex}
                      onChange={(e) => updateVariant(v._key, { hex: e.target.value })}
                      placeholder="#0E0E0E"
                      maxLength={7}
                      className={inputCls}
                      style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="mb-4">
                <ImageUpload
                  images={v.images}
                  onChange={(urls) => updateVariant(v._key, { images: urls })}
                  uploadEndpoint="/api/upload/product-image"
                  label="Images"
                />
              </div>

              {/* Inventory grid */}
              <div>
                <label className={labelCls} style={labelStyle}>Stock by Size</label>
                <div className="flex gap-3">
                  {SIZES.map((size) => (
                    <div key={size} className="flex flex-col items-center gap-1.5">
                      <span className="text-xs" style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)" }}>
                        {size}
                      </span>
                      <input
                        type="number"
                        value={v.inventory[size] ?? "0"}
                        onChange={(e) => updateInventory(v._key, size, e.target.value)}
                        min="0"
                        className="w-14 px-2 py-1.5 rounded-sm text-sm text-center outline-none"
                        style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Error & Submit ────────────────────────────────────────────────── */}
      {error && (
        <p
          className="text-sm px-4 py-3 rounded-sm"
          style={{ backgroundColor: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.3)", color: "#ff8a8a" }}
        >
          {error}
        </p>
      )}

      <div className="flex gap-4 pb-10">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-sm text-sm font-medium"
          style={{
            backgroundColor: "var(--color-gold-400)",
            color: "var(--color-void)",
            opacity: saving ? 0.7 : 1,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-3 rounded-sm text-sm"
          style={{ color: "var(--color-fg-muted)", border: "1px solid var(--color-card-border)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
