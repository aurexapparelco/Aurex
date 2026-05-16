import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/storefront/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--color-void)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/home" className="inline-block">
            <span
              className="text-3xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-gold-400)" }}
            >
              Auréx
            </span>
          </Link>
          <p
            className="text-xs tracking-[0.2em] uppercase mt-1"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Atelier
          </p>
        </div>

        <div
          className="rounded-sm p-8"
          style={{
            backgroundColor: "var(--color-dark-forest)",
            border: "1px solid var(--color-card-border)",
          }}
        >
          <h1
            className="text-2xl mb-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Sign in to your Auréx account
          </p>

          <LoginForm />

          <p
            className="text-sm text-center mt-6"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4"
              style={{ color: "var(--color-gold-400)" }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
