"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/admin/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
  }

  const inputStyle = {
    backgroundColor: "var(--color-forest)",
    border: "1px solid var(--color-card-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-body)",
    outline: "none",
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: "rgba(160,230,201,0.08)", border: "1px solid rgba(160,230,201,0.3)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0e6c9" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92" />
          </svg>
        </div>
        <p className="text-sm" style={{ color: "var(--color-fg)" }}>
          Check your email
        </p>
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
          We sent a password reset link to <span style={{ color: "var(--color-fg)" }}>{email}</span>. It expires in 1 hour.
        </p>
        <Link
          href="/admin/login"
          className="block text-sm mt-4 transition-colors"
          style={{ color: "var(--color-gold-400)" }}
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs tracking-[0.12em] uppercase mb-2" style={{ color: "var(--color-fg-muted)" }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-sm text-sm"
          style={inputStyle}
          suppressHydrationWarning
        />
      </div>

      {error && (
        <p className="text-sm p-3 rounded-sm" style={{ backgroundColor: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.3)", color: "#ff8a8a" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded text-sm font-medium"
        style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)", opacity: loading ? 0.7 : 1, fontFamily: "var(--font-body)" }}
      >
        {loading ? "Sending…" : "Send Reset Link"}
      </button>

      <Link
        href="/admin/login"
        className="block text-center text-sm transition-colors"
        style={{ color: "var(--color-fg-muted)" }}
      >
        ← Back to sign in
      </Link>
    </form>
  );
}
