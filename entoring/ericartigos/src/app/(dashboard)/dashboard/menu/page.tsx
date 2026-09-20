"use client";

import { useState } from "react";
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { MenuItemData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Pencil, Archive } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_EMOJI: Record<string, string> = {
  Pasta: "🍝", "Rice Meals": "🍚", Sandwiches: "🥪", Beverages: "🥤", Desserts: "🍮",
};

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItemData[]>(MOCK_MENU_ITEMS);
  const [activeCat, setActiveCat] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = items.filter((i) => {
    const matchesCat = activeCat === "ALL" || i.categoryId === activeCat;
    const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  function handleArchive(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE" }
          : i
      )
    );
    const item = items.find((i) => i.id === id);
    toast.success(`${item?.name} ${item?.status === "ACTIVE" ? "archived" : "restored"}`);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu Management</h1>
          <p className="text-sm text-slate-400 mt-1">{items.filter((i) => i.status === "ACTIVE").length} active items</p>
        </div>
        <button
          id="add-menu-item-btn"
          onClick={() => toast.info("Add menu item form coming soon — connect DB first")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCat("ALL")}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCat === "ALL"
              ? "bg-blue-600 text-white"
              : "bg-[hsl(220,25%,18%)] text-slate-400 hover:text-white border border-[hsl(220,25%,24%)]"
          }`}
        >
          All
        </button>
        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCat === cat.id
                ? "bg-blue-600 text-white"
                : "bg-[hsl(220,25%,18%)] text-slate-400 hover:text-white border border-[hsl(220,25%,24%)]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          id="menu-search"
          type="text"
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl bg-[hsl(220,25%,16%)] border overflow-hidden transition-all ${
              item.status === "ARCHIVED"
                ? "border-[hsl(220,25%,22%)] opacity-60"
                : "border-[hsl(220,25%,22%)] hover:border-blue-500/40"
            }`}
          >
            <div className="h-36 bg-gradient-to-br from-[hsl(220,25%,22%)] to-[hsl(220,25%,18%)] flex items-center justify-center relative">
              <span className="text-5xl opacity-50">
                {CATEGORY_EMOJI[item.category.name] ?? "🍽️"}
              </span>
              {item.status === "ARCHIVED" && (
                <span className="absolute top-2 right-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">
                  Archived
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white leading-snug">{item.name}</h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => toast.info("Edit form coming soon")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[hsl(220,25%,24%)] transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchive(item.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mb-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-400">{formatCurrency(item.price)}</span>
                <span className="text-xs text-slate-500">{item.category.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
