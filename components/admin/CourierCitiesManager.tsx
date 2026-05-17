"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fmtLKR } from "@/lib/constants";
import type { CourierCity } from "@/lib/courier";

interface Props {
  initialCities: CourierCity[];
  total: number;
  page: number;
  pageSize: number;
  initialQuery: string;
}

type CityRow = CourierCity & { saving?: boolean };

interface EditState {
  name: string;
  chargeFirstKg: string;
  chargePerAdditionalKg: string;
}

export default function CourierCitiesManager({ initialCities, total, page, pageSize, initialQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [cities, setCities] = useState<CityRow[]>(initialCities);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setCities(initialCities);
    setEditingId(null);
  }, [initialCities]);
  const [edit, setEdit] = useState<EditState>({ name: "", chargeFirstKg: "", chargePerAdditionalKg: "" });
  const [editError, setEditError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [add, setAdd] = useState<EditState>({ name: "", chargeFirstKg: "", chargePerAdditionalKg: "100" });
  const [addError, setAddError] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createClient() as unknown as any;

  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function navigate(newPage: number, q?: string) {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", String(newPage));
    const query = q !== undefined ? q : initialQuery;
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.push(pathname + (qs ? `?${qs}` : ""));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(1, searchInput);
  }

  function handleClear() {
    setSearchInput("");
    navigate(1, "");
  }

  const inp: React.CSSProperties = {
    backgroundColor: "var(--color-forest)",
    border: "1px solid var(--color-card-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-body)",
    outline: "none",
    padding: "6px 10px",
    borderRadius: "2px",
    fontSize: "13px",
  };

  function startEdit(city: CityRow) {
    setEditingId(city.id);
    setEdit({
      name: city.name,
      chargeFirstKg: String(city.charge_first_kg),
      chargePerAdditionalKg: String(city.charge_per_additional_kg),
    });
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function saveEdit(id: number) {
    const chargeFirstKg = parseInt(edit.chargeFirstKg, 10);
    const chargePerAdditionalKg = parseInt(edit.chargePerAdditionalKg, 10);
    if (!edit.name.trim()) { setEditError("Name is required."); return; }
    if (isNaN(chargeFirstKg) || chargeFirstKg < 0) { setEditError("First kg charge must be a non-negative number."); return; }
    if (isNaN(chargePerAdditionalKg) || chargePerAdditionalKg < 0) { setEditError("Per additional kg charge must be a non-negative number."); return; }

    setCities((cs) => cs.map((c) => c.id === id ? { ...c, saving: true } : c));
    const { error } = await sb.from("courier_cities").update({
      name: edit.name.trim(),
      charge_first_kg: chargeFirstKg,
      charge_per_additional_kg: chargePerAdditionalKg,
    }).eq("id", id);

    if (error) {
      setEditError(error.message);
      setCities((cs) => cs.map((c) => c.id === id ? { ...c, saving: false } : c));
    } else {
      setCities((cs) =>
        cs.map((c) => c.id === id
          ? { ...c, name: edit.name.trim(), charge_first_kg: chargeFirstKg, charge_per_additional_kg: chargePerAdditionalKg, saving: false }
          : c
        )
      );
      setEditingId(null);
    }
  }

  async function toggleActive(city: CityRow) {
    setCities((cs) => cs.map((c) => c.id === city.id ? { ...c, saving: true } : c));
    const { error } = await sb.from("courier_cities").update({ is_active: !city.is_active }).eq("id", city.id);
    if (!error) {
      setCities((cs) =>
        cs.map((c) => c.id === city.id ? { ...c, is_active: !city.is_active, saving: false } : c)
      );
    } else {
      setCities((cs) => cs.map((c) => c.id === city.id ? { ...c, saving: false } : c));
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const chargeFirstKg = parseInt(add.chargeFirstKg, 10);
    const chargePerAdditionalKg = parseInt(add.chargePerAdditionalKg, 10);
    if (!add.name.trim()) { setAddError("City name is required."); return; }
    if (isNaN(chargeFirstKg) || chargeFirstKg < 0) { setAddError("First kg charge must be a non-negative number."); return; }
    if (isNaN(chargePerAdditionalKg) || chargePerAdditionalKg < 0) { setAddError("Per additional kg charge must be a non-negative number."); return; }

    setAddSaving(true);
    setAddError("");
    const { error } = await sb
      .from("courier_cities")
      .insert({ name: add.name.trim(), charge_first_kg: chargeFirstKg, charge_per_additional_kg: chargePerAdditionalKg });

    setAddSaving(false);
    if (error) {
      setAddError(error.message.includes("unique") ? `"${add.name.trim()}" already exists.` : error.message);
    } else {
      setAdd({ name: "", chargeFirstKg: "", chargePerAdditionalKg: "100" });
      setShowAdd(false);
      // Reload first page to see the new city
      navigate(1, "");
    }
  }

  const active = cities.filter((c) => c.is_active);
  const inactive = cities.filter((c) => !c.is_active);

  return (
    <div className="space-y-6">

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-fg-tertiary)" }}
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search cities…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                ...inp,
                padding: "8px 12px 8px 34px",
                width: "220px",
              }}
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-sm text-xs"
            style={{
              backgroundColor: "var(--color-forest)",
              border: "1px solid var(--color-card-border)",
              color: "var(--color-fg)",
              fontFamily: "var(--font-body)",
            }}
          >
            Search
          </button>
          {initialQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs"
              style={{
                border: "1px solid var(--color-card-border)",
                color: "var(--color-fg-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear
            </button>
          )}
        </form>

        <div className="flex-1" />

        {!showAdd && (
          <button
            onClick={() => { setShowAdd(true); setAddError(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm"
            style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)", fontFamily: "var(--font-body)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add City
          </button>
        )}
      </div>

      {/* ── Results summary ─────────────────────────────────────────────────── */}
      {total > 0 && (
        <p className="text-xs" style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)" }}>
          {initialQuery
            ? `${total.toLocaleString()} result${total !== 1 ? "s" : ""} for "${initialQuery}" — showing ${from}–${to}`
            : `${total.toLocaleString()} cities — showing ${from}–${to}`}
        </p>
      )}

      {/* ── Add form ────────────────────────────────────────────────────────── */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="p-5 rounded-sm space-y-4"
          style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
        >
          <p className="text-xs tracking-widest uppercase" style={{ color: "var(--color-gold-200)" }}>
            New City
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-fg-tertiary)" }}>City Name</label>
              <input
                style={{ ...inp, width: "100%" }}
                value={add.name}
                onChange={(e) => setAdd((s) => ({ ...s, name: e.target.value }))}
                placeholder="e.g. Kandy"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-fg-tertiary)" }}>First 1 kg (LKR)</label>
              <input
                style={{ ...inp, width: "100%", fontFamily: "var(--font-mono)" }}
                type="number"
                min="0"
                value={add.chargeFirstKg}
                onChange={(e) => setAdd((s) => ({ ...s, chargeFirstKg: e.target.value }))}
                placeholder="e.g. 450"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-fg-tertiary)" }}>Per Additional kg (LKR)</label>
              <input
                style={{ ...inp, width: "100%", fontFamily: "var(--font-mono)" }}
                type="number"
                min="0"
                value={add.chargePerAdditionalKg}
                onChange={(e) => setAdd((s) => ({ ...s, chargePerAdditionalKg: e.target.value }))}
                placeholder="e.g. 100"
              />
            </div>
          </div>
          {addError && <p className="text-xs" style={{ color: "#ff8a8a" }}>{addError}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={addSaving}
              className="px-4 py-2 rounded-sm text-sm"
              style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)", fontFamily: "var(--font-body)", opacity: addSaving ? 0.7 : 1 }}
            >
              {addSaving ? "Saving…" : "Save City"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAdd({ name: "", chargeFirstKg: "", chargePerAdditionalKg: "100" }); setAddError(""); }}
              className="px-4 py-2 rounded-sm text-sm"
              style={{ color: "var(--color-fg-muted)", border: "1px solid var(--color-card-border)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── No results ─────────────────────────────────────────────────────── */}
      {total === 0 && (
        <p className="text-sm text-center py-8" style={{ color: "var(--color-fg-muted)" }}>
          {initialQuery ? `No cities match "${initialQuery}"` : "No cities yet. Add one above."}
        </p>
      )}

      {/* ── City tables ─────────────────────────────────────────────────────── */}
      {active.length > 0 && (
        <CityTable
          label="Active"
          cities={active}
          editingId={editingId}
          edit={edit}
          editError={editError}
          inp={inp}
          onEdit={startEdit}
          onCancelEdit={cancelEdit}
          onSaveEdit={saveEdit}
          onToggle={toggleActive}
          setEdit={setEdit}
        />
      )}

      {inactive.length > 0 && (
        <CityTable
          label="Inactive"
          cities={inactive}
          editingId={editingId}
          edit={edit}
          editError={editError}
          inp={inp}
          onEdit={startEdit}
          onCancelEdit={cancelEdit}
          onSaveEdit={saveEdit}
          onToggle={toggleActive}
          setEdit={setEdit}
        />
      )}

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <Pagination current={page} total={totalPages} onNavigate={(p) => navigate(p)} />
      )}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ current, total, onNavigate }: { current: number; total: number; onNavigate: (p: number) => void }) {
  const btnBase: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    border: "1px solid var(--color-card-border)",
    padding: "5px 10px",
    borderRadius: "2px",
    cursor: "pointer",
    minWidth: "36px",
    textAlign: "center",
  };

  const pages = buildPageRange(current, total);

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap pt-2">
      <button
        disabled={current === 1}
        onClick={() => onNavigate(current - 1)}
        style={{
          ...btnBase,
          backgroundColor: current === 1 ? "var(--color-dark-forest)" : "var(--color-forest)",
          color: current === 1 ? "var(--color-fg-disabled)" : "var(--color-fg-muted)",
          cursor: current === 1 ? "default" : "pointer",
        }}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} style={{ ...btnBase, border: "none", color: "var(--color-fg-tertiary)", cursor: "default" }}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onNavigate(p as number)}
            style={{
              ...btnBase,
              backgroundColor: p === current ? "var(--color-gold-400)" : "var(--color-forest)",
              color: p === current ? "var(--color-void)" : "var(--color-fg-muted)",
              borderColor: p === current ? "var(--color-gold-400)" : "var(--color-card-border)",
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={current === total}
        onClick={() => onNavigate(current + 1)}
        style={{
          ...btnBase,
          backgroundColor: current === total ? "var(--color-dark-forest)" : "var(--color-forest)",
          color: current === total ? "var(--color-fg-disabled)" : "var(--color-fg-muted)",
          cursor: current === total ? "default" : "pointer",
        }}
      >
        ›
      </button>
    </div>
  );
}

function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);

  const result: (number | "…")[] = [];
  const delta = 2;
  const left = current - delta;
  const right = current + delta;

  result.push(1);
  if (left > 2) result.push("…");
  for (let p = Math.max(2, left); p <= Math.min(total - 1, right); p++) result.push(p);
  if (right < total - 1) result.push("…");
  result.push(total);

  return result;
}

// ── CityTable ─────────────────────────────────────────────────────────────────

interface TableProps {
  label: string;
  cities: CityRow[];
  editingId: number | null;
  edit: EditState;
  editError: string;
  inp: React.CSSProperties;
  onEdit: (c: CityRow) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
  onToggle: (c: CityRow) => void;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
}

function CityTable({ label, cities, editingId, edit, editError, inp, onEdit, onCancelEdit, onSaveEdit, onToggle, setEdit }: TableProps) {
  return (
    <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-card-border)" }}>
      <div className="px-5 py-3 border-b" style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--color-gold-200)" }}>{label}</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "var(--color-dark-forest)", borderBottom: "1px solid var(--color-card-border)" }}>
            {["City", "First 1 kg", "Per Additional kg", ""].map((h) => (
              <th key={h} className="text-left px-5 py-2.5 text-xs tracking-widest uppercase font-normal" style={{ color: "var(--color-fg-tertiary)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cities.map((city, i) => (
            <tr
              key={city.id}
              style={{
                backgroundColor: i % 2 === 0 ? "var(--color-forest)" : "var(--color-dark-forest)",
                borderBottom: "1px solid var(--color-card-border)",
                opacity: city.saving ? 0.6 : 1,
              }}
            >
              {editingId === city.id ? (
                <>
                  <td className="px-5 py-2">
                    <input
                      style={{ ...inp, width: "100%" }}
                      value={edit.name}
                      onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                    />
                    {editError && <p className="text-xs mt-1" style={{ color: "#ff8a8a" }}>{editError}</p>}
                  </td>
                  <td className="px-5 py-2">
                    <input
                      style={{ ...inp, width: "100px", fontFamily: "var(--font-mono)" }}
                      type="number" min="0"
                      value={edit.chargeFirstKg}
                      onChange={(e) => setEdit((s) => ({ ...s, chargeFirstKg: e.target.value }))}
                    />
                  </td>
                  <td className="px-5 py-2">
                    <input
                      style={{ ...inp, width: "100px", fontFamily: "var(--font-mono)" }}
                      type="number" min="0"
                      value={edit.chargePerAdditionalKg}
                      onChange={(e) => setEdit((s) => ({ ...s, chargePerAdditionalKg: e.target.value }))}
                    />
                  </td>
                  <td className="px-5 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onSaveEdit(city.id)} className="px-3 py-1 rounded-sm text-xs" style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)" }}>
                        Save
                      </button>
                      <button onClick={onCancelEdit} className="px-3 py-1 rounded-sm text-xs" style={{ color: "var(--color-fg-muted)", border: "1px solid var(--color-card-border)" }}>
                        Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-5 py-3" style={{ color: "var(--color-fg)" }}>{city.name}</td>
                  <td className="px-5 py-3" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>
                    {fmtLKR(city.charge_first_kg)}
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
                    {fmtLKR(city.charge_per_additional_kg)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => onEdit(city)} className="text-xs" style={{ color: "var(--color-gold-400)" }}>Edit</button>
                      <button onClick={() => onToggle(city)} className="text-xs" style={{ color: city.is_active ? "var(--color-fg-muted)" : "#a0e6c9" }}>
                        {city.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
