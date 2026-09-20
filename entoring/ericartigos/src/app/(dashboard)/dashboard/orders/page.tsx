"use client";

import { useState } from "react";
import { MOCK_ORDERS } from "@/lib/mock-data";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatus } from "@/types";
import { Search } from "lucide-react";

const TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchesTab = activeTab === "ALL" || o.status === activeTab;
    const matchesSearch =
      !search ||
      String(o.orderNumber).includes(search) ||
      (o.tableNumber ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Order Management</h1>
        <p className="text-sm text-slate-400 mt-1">{MOCK_ORDERS.length} total orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            id={`orders-tab-${tab.value.toLowerCase()}`}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-[hsl(220,25%,18%)] text-slate-400 hover:text-white border border-[hsl(220,25%,24%)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          id="orders-search"
          type="text"
          placeholder="Search order # or table…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,25%,22%)]">
                {["Order #", "Table", "Items", "Total", "Status", "Time"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,25%,20%)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[hsl(220,25%,18%)] transition-colors">
                    <td className="px-4 py-3 font-bold text-white">#{order.orderNumber}</td>
                    <td className="px-4 py-3 text-slate-300">{order.tableNumber ?? "Walk-in"}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {order.items.map((i) => `${i.menuItem.name} ×${i.quantity}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-400">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(order.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
