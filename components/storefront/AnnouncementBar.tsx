export default function AnnouncementBar() {
  return (
    <div
      className="w-full text-center py-2.5 px-4 text-xs tracking-[0.18em] uppercase"
      style={{
        backgroundColor: "var(--color-deep-teal)",
        color: "var(--color-gold-200)",
        fontFamily: "var(--font-body)",
        borderBottom: "1px solid var(--color-card-border)",
      }}
    >
      Free shipping on orders over LKR 15,000 · Made in Sri Lanka
    </div>
  );
}
