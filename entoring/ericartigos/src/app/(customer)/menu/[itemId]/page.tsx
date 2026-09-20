"use client";

import { MOCK_MENU_ITEMS } from "@/lib/mock-data";
import { useCart } from "@/hooks/useCart";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";

const CATEGORY_EMOJI: Record<string, string> = {
  Pasta: "🍝",
  "Rice Meals": "🍚",
  Sandwiches: "🥪",
  Beverages: "🥤",
  Desserts: "🍮",
};

interface Props {
  params: Promise<{ itemId: string }>;
}

export default function ItemDetailPage({ params }: Props) {
  const { itemId } = use(params);
  const item = MOCK_MENU_ITEMS.find((i) => i.id === itemId);

  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);

  if (!item) return notFound();

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({ id: item!.id, name: item!.name, price: item!.price, imageUrl: item!.imageUrl });
    }
    toast.success(`${qty}× ${item!.name} added to cart`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <Link
        href="/menu"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </Link>

      <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="h-56 md:h-72 bg-gradient-to-br from-[hsl(220,25%,22%)] to-[hsl(220,25%,18%)] flex items-center justify-center">
          <span className="text-8xl opacity-50">
            {CATEGORY_EMOJI[item.category.name] ?? "🍽️"}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-full">
                {item.category.name}
              </span>
              <h1 className="text-2xl font-bold text-white mt-3">{item.name}</h1>
            </div>
            <span className="text-2xl font-bold text-blue-400 flex-shrink-0">
              ₱{item.price.toFixed(2)}
            </span>
          </div>

          {item.description && (
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.description}</p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-300">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                id="qty-decrement"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-[hsl(220,25%,22%)] border border-[hsl(220,25%,28%)] flex items-center justify-center text-white hover:bg-[hsl(220,25%,28%)] transition-colors disabled:opacity-50"
                disabled={qty <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-white text-lg">{qty}</span>
              <button
                id="qty-increment"
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-[hsl(220,25%,22%)] border border-[hsl(220,25%,28%)] flex items-center justify-center text-white hover:bg-[hsl(220,25%,28%)] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtotal + CTA */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-slate-500">Subtotal</p>
              <p className="text-xl font-bold text-white">
                ₱{(item.price * qty).toFixed(2)}
              </p>
            </div>
            <button
              id="add-to-cart-detail"
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
