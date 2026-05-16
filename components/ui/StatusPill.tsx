interface Props {
  status: string;
}

const STATUS_VARS: Record<string, string> = {
  "Awaiting Payment": "awaiting",
  Paid: "paid",
  Packed: "packed",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Refunded: "refunded",
};

export default function StatusPill({ status }: Props) {
  const key = STATUS_VARS[status] ?? "delivered";

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        color: `var(--pill-${key}-fg)`,
        backgroundColor: `var(--pill-${key}-bg)`,
        border: `1px solid var(--pill-${key}-border)`,
        fontFamily: "var(--font-body)",
      }}
    >
      {status}
    </span>
  );
}
