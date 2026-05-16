"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If autoconfirm is on, signUp returns a session — go straight to account
    if (data.session) {
      router.push("/account");
      router.refresh();
      return;
    }

    // Otherwise show the email confirmation prompt
    setSuccess(true);
    setLoading(false);
  }

  const inputStyle = {
    backgroundColor: "var(--color-forest)",
    border: "1px solid var(--color-card-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-body)",
    outline: "none",
  };

  if (success) {
    return (
      <div
        className="p-4 rounded text-center"
        style={{
          backgroundColor: "rgba(160,230,201,0.08)",
          border: "1px solid rgba(160,230,201,0.3)",
        }}
      >
        <p
          className="text-sm"
          style={{ color: "#a0e6c9" }}
        >
          Check your email to confirm your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          className="block text-xs tracking-[0.12em] uppercase mb-2"
          style={{ color: "var(--color-fg-muted)" }}
        >
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-sm text-sm"
          style={inputStyle}
        />
      </div>

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
        <label
          className="block text-xs tracking-[0.12em] uppercase mb-2"
          style={{ color: "var(--color-fg-muted)" }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          placeholder="Min. 8 characters"
          className="w-full px-4 py-3 rounded-sm text-sm"
          style={inputStyle}
        />
      </div>

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
        className="w-full py-3.5 rounded text-sm font-medium tracking-wide"
        style={{
          backgroundColor: "var(--color-gold-400)",
          color: "var(--color-void)",
          fontFamily: "var(--font-body)",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
