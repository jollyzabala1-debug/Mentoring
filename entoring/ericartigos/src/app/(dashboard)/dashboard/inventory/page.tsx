"use client";

import { useState } from "react";
import { MOCK_INVENTORY } from "@/lib/mock-data";
import { InventoryItemData, StockStatus } from "@/types";
import { formatDateShort } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STOCK_BADGE: Record<StockStatus, string> = {
  GOOD:         "bg-green-500/15 text-green-400 border-green-500/30",
  LOW:          "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  OUT_OF_STOCK: "bg-red-500/15 text-red-400 border-red-500/30",
};

const STOCK_LABEL: Record<StockStatus, string> = {
  GOOD: "Good",
  LOW: "Low",
  OUT_OF_STOCK: "Out of Stock",
};

const ALL_CATEGORIES = ["All", ...Array.from(new Set(MOCK_INVENTORY.map((i) => i.category.name)))];

export default function InventoryPage() {
  const [items] = useState<InventoryItemData[]>(MOCK_INVENTORY);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "ALL">("ALL");

  const filtered = items.filter((i) => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || i.category.name === catFilter;
    const matchStatus = statusFilter === "ALL" || i.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const outCount = items.filter((i) => i.status === "OUT_OF_STOCK").length;
  const lowCount = items.filter((i) => i.status === "LOW").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Monitoring</h1>
          <p className="text-sm text-slate-400 mt-1">{items.length} ingredients tracked</p>
        </div>
        <button
          id="add-stock-btn"
          onClick={() => toast.info("Add stock form coming soon — connect DB first")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Stock
        </button>
      </div>

      {/* Alert banners */}
      {outCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          <span className="text-lg">⚠️</span>
          <span>{outCount} item{outCount > 1 ? "s" : ""} out of stock — check affected menu items</span>
        </div>
      )}
      {lowCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm text-yellow-400">
          <span className="text-lg">🔔</span>
          <span>{lowCount} item{lowCount > 1 ? "s" : ""} running low — consider restocking soon</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="inventory-search"
            type="text"
            placeholder="Search ingredient or supplier…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors w-64"
          />
        </div>
        <select
          id="inventory-category-filter"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-slate-300 outline-none focus:border-blue-500"
        >
          {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          id="inventory-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StockStatus | "ALL")}
          className="px-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-slate-300 outline-none focus:border-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="GOOD">Good</option>
          <option value="LOW">Low</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,25%,22%)]">
                {["Ingredient", "Category", "Stock", "Unit", "Supplier", "Expiry", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,25%,20%)]">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No items found</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[hsl(220,25%,18%)] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{item.category.name}</td>
                    <td className="px-4 py-3 font-bold text-white">{Number(item.stock).toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{item.unit}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{item.supplier}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {item.expiryDate ? formatDateShort(item.expiryDate) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border", STOCK_BADGE[item.status])}>
                        {STOCK_LABEL[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toast.info("Edit stock form coming soon")}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
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
