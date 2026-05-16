"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ORDER_STATUSES } from "@/lib/constants";

interface Props {
  orderId: string;
  currentStatus: string;
}

const FLOW_STATUSES = ["Awaiting Payment", "Paid", "Packed", "Shipped", "Delivered"];

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isTerminal = ["Cancelled", "Refunded"].includes(currentStatus);

  async function handleUpdate(newStatus: string) {
    setLoading(true);
    setError("");

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as unknown as any;
    const { error: updateError } = await sb
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (updateError) {
      setError("Failed to update status");
    } else {
      setStatus(newStatus);
      router.refresh();
    }
    setLoading(false);
  }

  if (isTerminal) {
    return (
      <div className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
        Terminal status: {currentStatus}
      </div>
    );
  }

  const currentIdx = FLOW_STATUSES.indexOf(status);
  const nextStatus = currentIdx < FLOW_STATUSES.length - 1 ? FLOW_STATUSES[currentIdx + 1] : null;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        {nextStatus && (
          <button
            onClick={() => handleUpdate(nextStatus)}
            disabled={loading}
            className="px-4 py-2 rounded text-sm font-medium"
            style={{
              backgroundColor: "var(--color-gold-400)",
              color: "var(--color-void)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Updating…" : `Mark as ${nextStatus}`}
          </button>
        )}
        <select
          value=""
          onChange={(e) => e.target.value && handleUpdate(e.target.value)}
          className="px-3 py-2 rounded text-sm"
          style={{
            backgroundColor: "var(--color-dark-forest)",
            border: "1px solid var(--color-card-border)",
            color: "var(--color-fg-muted)",
          }}
        >
          <option value="">Other status…</option>
          <option value="Cancelled">Cancel Order</option>
          <option value="Refunded">Mark Refunded</option>
        </select>
      </div>
      {error && <p className="text-xs" style={{ color: "#ff8a8a" }}>{error}</p>}
    </div>
  );
}
