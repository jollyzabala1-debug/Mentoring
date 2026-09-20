"use client";

import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ItemCard from "@/components/customer/ItemCard";
import Link from "next/link";

function MenuContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const filtered = categoryId
    ? MOCK_MENU_ITEMS.filter((i) => i.categoryId === categoryId && i.status === "ACTIVE")
    : MOCK_MENU_ITEMS.filter((i) => i.status === "ACTIVE");

  const activeCategory = categoryId
    ? MOCK_CATEGORIES.find((c) => c.id === categoryId)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {activeCategory ? activeCategory.name : "All Menu Items"}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <Link
          href="/menu"
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !categoryId
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-[hsl(220,25%,18%)] text-slate-400 hover:text-white border border-[hsl(220,25%,24%)]"
          }`}
        >
          All
        </Link>
        {MOCK_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/menu?category=${cat.id}`}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              categoryId === cat.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-[hsl(220,25%,18%)] text-slate-400 hover:text-white border border-[hsl(220,25%,24%)]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <span className="text-5xl mb-4 block">🍽️</span>
          <p>No items in this category right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] h-64 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
