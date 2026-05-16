"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProductType } from "@/types/database.types";

interface Props {
  initialTypes: ProductType[];
}

export default function ProductTypesManager({ initialTypes }: Props) {
  const router = useRouter();
  const [types, setTypes] = useState(initialTypes);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError("");

    const maxOrder = types.reduce((m, t) => Math.max(m, t.sort_order), 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as unknown as any;
    const { data, error: err } = await sb
      .from("product_types")
      .insert({ name: newName.trim(), sort_order: maxOrder + 1 })
      .select()
      .single();

    if (err) {
      setError(err.message.includes("unique") ? "A type with that name already exists." : err.message);
    } else {
      setTypes((prev) => [...prev, data]);
      setNewName("");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as unknown as any;
    const { error: err } = await sb.from("product_types").delete().eq("id", id);
    if (err) {
      setError("Cannot delete — this type may still be assigned to products.");
    } else {
      setTypes((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    }
    setDeletingId(null);
  }

  async function handleRename(id: string) {
    if (!editName.trim()) return;
    setError("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as unknown as any;
    const { error: err } = await sb
      .from("product_types")
      .update({ name: editName.trim() })
      .eq("id", id);
    if (err) {
      setError(err.message.includes("unique") ? "A type with that name already exists." : err.message);
    } else {
      setTypes((prev) => prev.map((t) => t.id === id ? { ...t, name: editName.trim() } : t));
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const idx = types.findIndex((t) => t.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= types.length) return;

    const a = types[idx];
    const b = types[swapIdx];
    const newOrder = [...types];
    newOrder[idx] = { ...a, sort_order: b.sort_order };
    newOrder[swapIdx] = { ...b, sort_order: a.sort_order };
    newOrder.sort((x, y) => x.sort_order - y.sort_order);
    setTypes(newOrder);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as unknown as any;
    await Promise.all([
      sb.from("product_types").update({ sort_order: b.sort_order }).eq("id", a.id),
      sb.from("product_types").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    router.refresh();
  }

  const inputStyle = {
    backgroundColor: "var(--color-forest)",
    border: "1px solid var(--color-card-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-body)",
    outline: "none",
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="flex gap-3"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New type name, e.g. Polo, Inner Wear…"
          className="flex-1 px-4 py-2.5 rounded-sm text-sm"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="px-5 py-2.5 rounded-sm text-sm font-medium"
          style={{
            backgroundColor: "var(--color-gold-400)",
            color: "var(--color-void)",
            opacity: (adding || !newName.trim()) ? 0.6 : 1,
            cursor: (adding || !newName.trim()) ? "not-allowed" : "pointer",
          }}
        >
          {adding ? "Adding…" : "Add Type"}
        </button>
      </form>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-sm"
          style={{
            backgroundColor: "rgba(255,138,138,0.08)",
            border: "1px solid rgba(255,138,138,0.3)",
            color: "#ff8a8a",
          }}
        >
          {error}
        </p>
      )}

      {/* Types table */}
      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid var(--color-card-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--color-dark-forest)", borderBottom: "1px solid var(--color-card-border)" }}>
              {["Order", "Name", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs tracking-[0.12em] uppercase font-normal"
                  style={{ color: "var(--color-fg-tertiary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((type, i) => (
              <tr
                key={type.id}
                style={{
                  backgroundColor: i % 2 === 0 ? "var(--color-forest)" : "var(--color-dark-forest)",
                  borderBottom: "1px solid var(--color-card-border)",
                }}
              >
                {/* Order controls */}
                <td className="px-5 py-3 w-20">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleReorder(type.id, "up")}
                      disabled={i === 0}
                      className="p-1 rounded"
                      style={{ color: i === 0 ? "var(--color-fg-disabled)" : "var(--color-fg-muted)" }}
                      title="Move up"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18,15 12,9 6,15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleReorder(type.id, "down")}
                      disabled={i === types.length - 1}
                      className="p-1 rounded"
                      style={{ color: i === types.length - 1 ? "var(--color-fg-disabled)" : "var(--color-fg-muted)" }}
                      title="Move down"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>
                  </div>
                </td>

                {/* Name / inline edit */}
                <td className="px-5 py-3">
                  {editingId === type.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(type.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="px-3 py-1 rounded-sm text-sm"
                        style={{ ...inputStyle, width: "180px" }}
                      />
                      <button
                        onClick={() => handleRename(type.id)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs"
                        style={{ color: "var(--color-fg-muted)" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: "var(--color-fg)", fontFamily: "var(--font-body)" }}>
                      {type.name}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditingId(type.id); setEditName(type.name); setError(""); }}
                      className="text-xs underline underline-offset-2"
                      style={{ color: "var(--color-gold-200)" }}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      disabled={deletingId === type.id}
                      className="text-xs underline underline-offset-2"
                      style={{ color: "#ff8a8a", opacity: deletingId === type.id ? 0.5 : 1 }}
                    >
                      {deletingId === type.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {types.length === 0 && (
          <div className="py-12 text-center" style={{ backgroundColor: "var(--color-dark-forest)" }}>
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
              No product types yet — add one above.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "var(--color-fg-tertiary)" }}>
        Deleting a type will unlink it from products (sets their type to none). Rename updates everywhere instantly.
      </p>
    </div>
  );
}
