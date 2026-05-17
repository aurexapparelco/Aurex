"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HomeContent, HeroStat, FeatureItem, CollectionCard } from "@/lib/home-content";
import ImageUpload from "@/components/admin/ImageUpload";

interface Props {
  initial: HomeContent;
}

export default function HomeContentForm({ initial }: Props) {
  const [form, setForm] = useState<HomeContent>(structuredClone(initial));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // ── Hero helpers ────────────────────────────────────────────────────────────
  function setHero<K extends keyof HomeContent["hero"]>(
    key: K,
    value: HomeContent["hero"][K],
  ) {
    setForm((f) => ({ ...f, hero: { ...f.hero, [key]: value } }));
    setSaved(false);
  }

  function setHeroCta(which: "primaryCta" | "secondaryCta", field: "label" | "href", value: string) {
    setForm((f) => ({
      ...f,
      hero: { ...f.hero, [which]: { ...f.hero[which], [field]: value } },
    }));
    setSaved(false);
  }

  function setHeroStat(i: number, field: keyof HeroStat, value: string) {
    const stats = form.hero.stats.map((s, idx) =>
      idx === i ? { ...s, [field]: value } : s,
    );
    setForm((f) => ({ ...f, hero: { ...f.hero, stats } }));
    setSaved(false);
  }

  // ── Feature strip helpers ───────────────────────────────────────────────────
  function setFeature(i: number, field: keyof FeatureItem, value: string) {
    const features = form.featureStrip.features.map((feat, idx) =>
      idx === i ? { ...feat, [field]: value } : feat,
    );
    setForm((f) => ({ ...f, featureStrip: { ...f.featureStrip, features } }));
    setSaved(false);
  }

  // ── Collection card helpers ─────────────────────────────────────────────────
  function setCard(i: number, field: keyof CollectionCard, value: string) {
    const cards = form.collectionCards.cards.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c,
    );
    setForm((f) => ({ ...f, collectionCards: { ...f.collectionCards, cards } }));
    setSaved(false);
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setError("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createClient() as unknown as any;
    const { error: dbErr } = await sb
      .from("home_content")
      .update({
        hero: form.hero,
        feature_strip: form.featureStrip,
        collection_cards: form.collectionCards,
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

  const inp: React.CSSProperties = {
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

  const lbl: React.CSSProperties = {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--color-fg-tertiary)",
    display: "block",
    marginBottom: "4px",
  };

  return (
    <div className="space-y-6">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Section label="Hero">
        <VisibilityToggle
          checked={form.hero.visible}
          onChange={(v) => setHero("visible", v)}
        />

        <div className="space-y-4 mt-4">
          <Field label="Eyebrow Label" style={lbl}>
            <input
              style={inp}
              value={form.hero.eyebrow}
              onChange={(e) => setHero("eyebrow", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Headline" style={lbl}>
              <input
                style={inp}
                value={form.hero.headline}
                onChange={(e) => setHero("headline", e.target.value)}
              />
            </Field>
            <Field label="Headline Accent (gold)" style={lbl}>
              <input
                style={inp}
                value={form.hero.headlineAccent}
                onChange={(e) => setHero("headlineAccent", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Subtext" style={lbl}>
            <textarea
              rows={2}
              style={{ ...inp, resize: "none" }}
              value={form.hero.subtext}
              onChange={(e) => setHero("subtext", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p style={{ ...lbl, marginBottom: "8px" }}>Primary CTA</p>
              <div className="space-y-2">
                <input
                  style={inp}
                  placeholder="Label"
                  value={form.hero.primaryCta.label}
                  onChange={(e) => setHeroCta("primaryCta", "label", e.target.value)}
                />
                <input
                  style={inp}
                  placeholder="Link (e.g. /shop)"
                  value={form.hero.primaryCta.href}
                  onChange={(e) => setHeroCta("primaryCta", "href", e.target.value)}
                />
              </div>
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "8px" }}>Secondary CTA</p>
              <div className="space-y-2">
                <input
                  style={inp}
                  placeholder="Label"
                  value={form.hero.secondaryCta.label}
                  onChange={(e) => setHeroCta("secondaryCta", "label", e.target.value)}
                />
                <input
                  style={inp}
                  placeholder="Link"
                  value={form.hero.secondaryCta.href}
                  onChange={(e) => setHeroCta("secondaryCta", "href", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <p style={{ ...lbl, marginBottom: "8px" }}>Stats</p>
            <div className="space-y-2">
              {form.hero.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <input
                    style={inp}
                    placeholder="Value"
                    value={stat.value}
                    onChange={(e) => setHeroStat(i, "value", e.target.value)}
                  />
                  <input
                    style={inp}
                    placeholder="Unit"
                    value={stat.unit}
                    onChange={(e) => setHeroStat(i, "unit", e.target.value)}
                  />
                  <input
                    style={inp}
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => setHeroStat(i, "label", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <ImageUpload
              images={form.hero.imageUrl ? [form.hero.imageUrl] : []}
              onChange={(urls) => setHero("imageUrl", urls[urls.length - 1] ?? "")}
              uploadEndpoint="/api/upload/hero-image"
              urlKey="desktop"
              maxImages={1}
              label="Hero Image (desktop · 1920×1080, mobile · 800×1000 auto-generated)"
            />
          </div>
        </div>
      </Section>

      {/* ── Feature Strip ────────────────────────────────────────────────── */}
      <Section label="Feature Strip">
        <VisibilityToggle
          checked={form.featureStrip.visible}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              featureStrip: { ...f.featureStrip, visible: v },
            }))
          }
        />

        <div className="mt-4 space-y-3">
          {form.featureStrip.features.map((feat, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr] gap-3">
              <div>
                <label style={lbl}>Icon</label>
                <input
                  style={{ ...inp, textAlign: "center", fontFamily: "var(--font-mono)" }}
                  value={feat.icon}
                  onChange={(e) => setFeature(i, "icon", e.target.value)}
                />
              </div>
              <div>
                <label style={lbl}>Label</label>
                <input
                  style={inp}
                  value={feat.label}
                  onChange={(e) => setFeature(i, "label", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Collection Cards ─────────────────────────────────────────────── */}
      <Section label="Collection Cards">
        <VisibilityToggle
          checked={form.collectionCards.visible}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              collectionCards: { ...f.collectionCards, visible: v },
            }))
          }
        />

        <div className="mt-4 space-y-6">
          {form.collectionCards.cards.map((card, i) => (
            <div
              key={i}
              className="p-4 rounded-sm space-y-3"
              style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
            >
              <p className="text-xs tracking-widest uppercase" style={{ color: "var(--color-gold-200)" }}>
                Card {i + 1}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Overline" style={lbl}>
                  <input style={inp} value={card.overline} onChange={(e) => setCard(i, "overline", e.target.value)} />
                </Field>
                <Field label="Heading" style={lbl}>
                  <input style={inp} value={card.heading} onChange={(e) => setCard(i, "heading", e.target.value)} />
                </Field>
              </div>
              <Field label="Description" style={lbl}>
                <textarea
                  rows={2}
                  style={{ ...inp, resize: "none" }}
                  value={card.description}
                  onChange={(e) => setCard(i, "description", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="CTA Text" style={lbl}>
                  <input style={inp} value={card.cta} onChange={(e) => setCard(i, "cta", e.target.value)} />
                </Field>
                <Field label="Link" style={lbl}>
                  <input style={inp} value={card.href} onChange={(e) => setCard(i, "href", e.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Feedback + Save ──────────────────────────────────────────────── */}
      {error && (
        <p className="text-sm px-4 py-3 rounded-sm" style={{ backgroundColor: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.3)", color: "#ff8a8a" }}>
          {error}
        </p>
      )}
      {saved && (
        <p className="text-sm px-4 py-3 rounded-sm" style={{ backgroundColor: "rgba(160,230,201,0.08)", border: "1px solid rgba(160,230,201,0.3)", color: "#a0e6c9" }}>
          Saved. Changes will appear on the storefront on next page load.
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-sm text-sm font-medium"
        style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)", fontFamily: "var(--font-body)", opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm p-6" style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}>
      <p className="text-xs tracking-widest uppercase mb-5" style={{ color: "var(--color-gold-200)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function VisibilityToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-gold-400 w-4 h-4"
      />
      <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
        Show this section on the storefront
      </span>
    </label>
  );
}

function Field({
  label,
  style,
  children,
}: {
  label: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={style}>{label}</label>
      {children}
    </div>
  );
}
