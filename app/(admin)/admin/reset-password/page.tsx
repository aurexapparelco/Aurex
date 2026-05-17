import type { Metadata } from "next";
import AdminResetPasswordForm from "@/components/admin/AdminResetPasswordForm";

export const metadata: Metadata = { title: "Set New Password | Admin" };

export default function AdminResetPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-void)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span
            className="text-3xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-gold-400)" }}
          >
            Auréx
          </span>
          <p
            className="text-xs tracking-[0.2em] uppercase mt-1"
            style={{ color: "var(--color-fg-tertiary)" }}
          >
            Staff Portal
          </p>
        </div>

        <div
          className="rounded-sm p-8"
          style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
        >
          <h1
            className="text-2xl mb-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
          >
            Set New Password
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-fg-muted)" }}>
            Choose a strong password for your account.
          </p>

          <AdminResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
