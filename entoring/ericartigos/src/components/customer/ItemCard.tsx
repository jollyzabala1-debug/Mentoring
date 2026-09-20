"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { MenuItemData } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_EMOJI: Record<string, string> = {
  Pasta: "🍝",
  "Rice Meals": "🍚",
  Sandwiches: "🥪",
  Beverages: "🥤",
  Desserts: "🍮",
};

interface ItemCardProps {
  item: MenuItemData;
}

export default function ItemCard({ item }: ItemCardProps) {
  const addItem = useCart((s) => s.addItem);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    toast.success(`${item.name} added to cart`);
  }

  return (
    <div className="group rounded-2xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] hover:border-blue-500/40 overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/10 flex flex-col">
      {/* Image */}
      <Link href={`/menu/${item.id}`} className="block">
        <div className="h-44 bg-gradient-to-br from-[hsl(220,25%,22%)] to-[hsl(220,25%,18%)] flex items-center justify-center relative overflow-hidden">
          <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">
            {CATEGORY_EMOJI[item.category.name] ?? "🍽️"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,16%)] to-transparent opacity-50" />
          <span className="absolute bottom-2 left-3 text-xs text-slate-400 bg-[hsl(220,25%,14%)]/80 px-2 py-0.5 rounded-full">
            {item.category.name}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/menu/${item.id}`}>
          <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors leading-snug">
            {item.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 flex-1">{item.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-blue-400">₱{item.price.toFixed(2)}</span>
          <button
            id={`add-to-cart-${item.id}`}
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
