"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        />
      </div>
      <div>
        <label className="block text-xs tracking-[0.12em] uppercase mb-2" style={{ color: "var(--color-fg-muted)" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-sm text-sm"
          style={inputStyle}
        />
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
