"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? "var(--color-forest)"
            : "transparent",
          borderBottom: scrolled
            ? "1px solid var(--color-card-border)"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/home" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Auréx Atelier"
                height={36}
                width={140}
                style={{ objectFit: "contain", objectPosition: "left" }}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm tracking-wide transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 450,
                      color: active
                        ? "var(--color-gold-400)"
                        : "var(--color-fg-muted)",
                    }}
                    onMouseEnter={(e) =>
                      !active &&
                      (e.currentTarget.style.color = "var(--color-fg)")
                    }
                    onMouseLeave={(e) =>
                      !active &&
                      (e.currentTarget.style.color = "var(--color-fg-muted)")
                    }
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="hidden md:flex p-2 rounded-lg transition-colors"
                style={{ color: "var(--color-fg-muted)" }}
                title="Account"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative flex p-2 rounded-lg transition-colors"
                style={{ color: "var(--color-fg-muted)" }}
                aria-label="Open cart"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {count > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center rounded-full text-xs px-1"
                    style={{
                      backgroundColor: "var(--color-gold-400)",
                      color: "var(--color-void)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 500,
                    }}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2"
                style={{ color: "var(--color-fg-muted)" }}
                aria-label="Toggle menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {menuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{
              backgroundColor: "var(--color-dark-forest)",
              borderColor: "var(--color-card-border)",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm tracking-wide border-b"
                  style={{
                    color:
                      pathname === href
                        ? "var(--color-gold-400)"
                        : "var(--color-fg-muted)",
                    borderColor: "var(--color-card-border)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm tracking-wide"
                style={{
                  color: "var(--color-fg-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Account
              </Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
