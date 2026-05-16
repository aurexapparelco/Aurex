interface Props {
  status: string;
}

const STATUS_STYLES: Record<
  string,
  { fg: string; bg: string; border: string }
> = {
  "Awaiting Payment": {
    fg: "#F8E7B0",
    bg: "rgba(248,231,176,0.10)",
    border: "rgba(248,231,176,0.30)",
  },
  Paid: {
    fg: "#EFCE7E",
    bg: "rgba(212,162,76,0.12)",
    border: "rgba(212,162,76,0.40)",
  },
  Packed: {
    fg: "#A0E6C9",
    bg: "rgba(160,230,201,0.08)",
    border: "rgba(160,230,201,0.30)",
  },
  Shipped: {
    fg: "#9BC9FF",
    bg: "rgba(155,201,255,0.08)",
    border: "rgba(155,201,255,0.30)",
  },
  Delivered: {
    fg: "#A1A1AA",
    bg: "transparent",
    border: "#3F3F46",
  },
  Cancelled: {
    fg: "#FF8A8A",
    bg: "rgba(255,138,138,0.08)",
    border: "rgba(255,138,138,0.30)",
  },
  Refunded: {
    fg: "#71717A",
    bg: "transparent",
    border: "#3F3F46",
  },
};

export default function StatusPill({ status }: Props) {
  const style = STATUS_STYLES[status] ?? {
    fg: "#A1A1AA",
    bg: "transparent",
    border: "#3F3F46",
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        color: style.fg,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        fontFamily: "var(--font-body)",
      }}
    >
      {status}
    </span>
  );
}
