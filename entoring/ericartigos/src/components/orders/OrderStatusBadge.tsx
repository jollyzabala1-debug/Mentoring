import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: "Pending",    className: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  PREPARING: { label: "Preparing",  className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  READY:     { label: "Ready",      className: "bg-green-500/15 text-green-400 border-green-500/30" },
  COMPLETED: { label: "Completed",  className: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
  CANCELLED: { label: "Cancelled",  className: "bg-red-500/15 text-red-400 border-red-500/30" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", cfg.className)}>
      {cfg.label}
    </span>
  );
}
