"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    // Verify staff membership
    const { data: staff, error: staffError } = await supabase
      .from("staff")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (staffError || !staff) {
      await supabase.auth.signOut();
      setError(staffError ? `Staff check failed: ${staffError.message}` : "Access denied — not in staff table");
      setLoading(false);
      return;
    }

    router.push("/admin/overview");
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs tracking-[0.12em] uppercase mb-2" style={{ color: "var(--color-fg-muted)" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-sm text-sm"
          style={inputStyle}
          suppressHydrationWarning
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs tracking-[0.12em] uppercase" style={{ color: "var(--color-fg-muted)" }}>
            Password
          </label>
          <Link
            href="/admin/forgot-password"
            className="text-xs transition-colors"
            style={{ color: "var(--color-gold-400)" }}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pr-11 rounded-sm text-sm"
            style={inputStyle}
            suppressHydrationWarning
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-fg-tertiary)" }}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm p-3 rounded" style={{ backgroundColor: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.3)", color: "#ff8a8a" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded text-sm font-medium"
        style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
