"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";



export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-[hsl(220,25%,18%)] border border-[hsl(220,25%,24%)] flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-slate-500" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-slate-400 text-sm mb-6">
          Browse the menu and add some delicious items!
        </p>
        <Link
          id="browse-menu-cta"
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
        >
          Browse Menu
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Your Cart</h1>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl"
          >
            {/* Emoji icon */}
            <div className="w-12 h-12 rounded-xl bg-[hsl(220,25%,22%)] flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🍽️</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
              <p className="text-xs text-blue-400 font-medium mt-0.5">
                ₱{item.price.toFixed(2)} each
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 rounded-lg bg-[hsl(220,25%,22%)] border border-[hsl(220,25%,28%)] flex items-center justify-center text-white hover:bg-[hsl(220,25%,28%)] transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-white">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-lg bg-[hsl(220,25%,22%)] border border-[hsl(220,25%,28%)] flex items-center justify-center text-white hover:bg-[hsl(220,25%,28%)] transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-white">
                ₱{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Order Summary</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-slate-400">
              <span>{item.name} × {item.quantity}</span>
              <span>₱{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[hsl(220,25%,24%)] mt-3 pt-3 flex justify-between items-center">
          <span className="font-bold text-white">Total</span>
          <span className="text-xl font-bold text-blue-400">
            {formatCurrency(totalPrice())}
          </span>
        </div>
      </div>

      <Link
        id="proceed-to-checkout"
        href="/checkout"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
      >
        Proceed to Checkout
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
