"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email address above first.");
      return;
    }
    setResetLoading(true);
    setError("");
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetSent(true);
    setResetLoading(false);
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
        <label
          className="block text-xs tracking-[0.12em] uppercase mb-2"
          style={{ color: "var(--color-fg-muted)" }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-sm text-sm"
          style={inputStyle}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="block text-xs tracking-[0.12em] uppercase"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Password
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="text-xs underline underline-offset-2"
            style={{ color: "var(--color-gold-400)", background: "none", border: "none", cursor: "pointer" }}
          >
            {resetLoading ? "Sending…" : "Forgot password?"}
          </button>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-sm text-sm"
          style={inputStyle}
        />
      </div>

      {resetSent && (
        <p
          className="text-sm p-3 rounded"
          style={{
            backgroundColor: "rgba(160,230,201,0.08)",
            border: "1px solid rgba(160,230,201,0.3)",
            color: "#a0e6c9",
          }}
        >
          Password reset email sent — check your inbox.
        </p>
      )}

      {error && (
        <p
          className="text-sm p-3 rounded"
          style={{
            backgroundColor: "rgba(255,138,138,0.08)",
            border: "1px solid rgba(255,138,138,0.3)",
            color: "#ff8a8a",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded text-sm font-medium tracking-wide transition-opacity"
        style={{
          backgroundColor: "var(--color-gold-400)",
          color: "var(--color-void)",
          fontFamily: "var(--font-body)",
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
