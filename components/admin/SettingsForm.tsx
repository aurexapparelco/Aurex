"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppSettings } from "@/lib/settings";

interface Props {
  initialSettings: AppSettings;
}

interface FormState {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  zoneColomboFee: string;
  zoneColomboDays: string;
  zoneSuburbsFee: string;
  zoneSuburbsDays: string;
  zoneOtherFee: string;
  zoneOtherDays: string;
  freeShippingThreshold: string;
}

function toForm(s: AppSettings): FormState {
  return {
    bankName: s.bank.bank,
    bankAccountName: s.bank.accountName,
    bankAccountNumber: s.bank.accountNumber,
    bankBranch: s.bank.branch,
    zoneColomboFee: String(s.shipping.zones.Colombo.fee),
    zoneColomboDays: s.shipping.zones.Colombo.days,
    zoneSuburbsFee: String(s.shipping.zones.Suburbs.fee),
    zoneSuburbsDays: s.shipping.zones.Suburbs.days,
    zoneOtherFee: String(s.shipping.zones["Other Districts"].fee),
    zoneOtherDays: s.shipping.zones["Other Districts"].days,
    freeShippingThreshold: String(s.shipping.freeThreshold),
  };
}

export default function SettingsForm({ initialSettings }: Props) {
  const [form, setForm] = useState<FormState>(() => toForm(initialSettings));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  function validate(): string | null {
    const fees = [
      form.zoneColomboFee,
      form.zoneSuburbsFee,
      form.zoneOtherFee,
      form.freeShippingThreshold,
    ];
    for (const f of fees) {
      const n = Number(f);
      if (!Number.isInteger(n) || n < 0) return "Fees must be non-negative whole numbers (LKR, no decimals).";
    }
    if (!form.bankName.trim()) return "Bank name is required.";
    if (!form.bankAccountName.trim()) return "Account name is required.";
    return null;
  }

  async function handleSave() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSaving(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createClient() as unknown as any;
    const { error: dbErr } = await sb
      .from("settings")
      .update({
        bank_name: form.bankName.trim(),
        bank_account_name: form.bankAccountName.trim(),
        bank_account_number: form.bankAccountNumber.trim(),
        bank_branch: form.bankBranch.trim(),
        zone_colombo_fee: Number(form.zoneColomboFee),
        zone_colombo_days: form.zoneColomboDays.trim(),
        zone_suburbs_fee: Number(form.zoneSuburbsFee),
        zone_suburbs_days: form.zoneSuburbsDays.trim(),
        zone_other_fee: Number(form.zoneOtherFee),
        zone_other_days: form.zoneOtherDays.trim(),
        free_shipping_threshold: Number(form.freeShippingThreshold),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);
    if (dbErr) {
      setError("Failed to save: " + dbErr.message);
    } else {
      setSaved(true);
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--color-forest)",
    border: "1px solid var(--color-card-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-body)",
    outline: "none",
    padding: "8px 12px",
    borderRadius: "2px",
    fontSize: "13px",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--color-fg-tertiary)",
    display: "block",
    marginBottom: "4px",
  };

  return (
    <div className="space-y-6">

      {/* ── Shipping Zones ─────────────────────────────────────────────────── */}
      <Section label="Shipping Zones">
        <div className="space-y-4">
          {(
            [
              { zone: "Colombo", feeKey: "zoneColomboFee", daysKey: "zoneColomboDays" },
              { zone: "Suburbs", feeKey: "zoneSuburbsFee", daysKey: "zoneSuburbsDays" },
              { zone: "Other Districts", feeKey: "zoneOtherFee", daysKey: "zoneOtherDays" },
            ] as const
          ).map(({ zone, feeKey, daysKey }) => (
            <div key={zone}>
              <p className="text-sm mb-2" style={{ color: "var(--color-fg)" }}>
                {zone}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Fee (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form[feeKey]}
                    onChange={(e) => set(feeKey, e.target.value)}
                    style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Delivery Days</label>
                  <input
                    type="text"
                    placeholder="e.g. 1–2"
                    value={form[daysKey]}
                    onChange={(e) => set(daysKey, e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t" style={{ borderColor: "var(--color-card-border)" }}>
            <div style={{ maxWidth: "50%", paddingRight: "6px" }}>
              <label style={labelStyle}>Free Shipping Above (LKR)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.freeShippingThreshold}
                onChange={(e) => set("freeShippingThreshold", e.target.value)}
                style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Bank Payment Details ───────────────────────────────────────────── */}
      <Section label="Bank Payment Details">
        <div className="space-y-3">
          <div>
            <label style={labelStyle}>Bank Name</label>
            <input
              type="text"
              required
              value={form.bankName}
              onChange={(e) => set("bankName", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Account Name</label>
            <input
              type="text"
              required
              value={form.bankAccountName}
              onChange={(e) => set("bankAccountName", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Account Number</label>
              <input
                type="text"
                placeholder="Optional"
                value={form.bankAccountNumber}
                onChange={(e) => set("bankAccountNumber", e.target.value)}
                style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Branch</label>
              <input
                type="text"
                placeholder="Optional"
                value={form.bankBranch}
                onChange={(e) => set("bankBranch", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Feedback + Save ───────────────────────────────────────────────── */}
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
      {saved && (
        <p
          className="text-sm px-4 py-3 rounded-sm"
          style={{
            backgroundColor: "rgba(160,230,201,0.08)",
            border: "1px solid rgba(160,230,201,0.3)",
            color: "#a0e6c9",
          }}
        >
          Settings saved. Changes will appear on the storefront after the next page visit.
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-sm text-sm font-medium"
        style={{
          backgroundColor: "var(--color-gold-400)",
          color: "var(--color-void)",
          fontFamily: "var(--font-body)",
          opacity: saving ? 0.7 : 1,
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-sm p-6"
      style={{
        backgroundColor: "var(--color-dark-forest)",
        border: "1px solid var(--color-card-border)",
      }}
    >
      <p
        className="text-xs tracking-widest uppercase mb-5"
        style={{ color: "var(--color-gold-200)" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
