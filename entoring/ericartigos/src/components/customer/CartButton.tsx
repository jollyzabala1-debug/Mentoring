"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

export default function CartButton() {
  const totalItems = useCart((s) => s.totalItems());

  return (
    <Link
      href="/cart"
      id="cart-button"
      className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-medium shadow-lg shadow-blue-500/20"
    >
      <ShoppingCart className="w-4 h-4" />
      <span className="hidden sm:inline">Cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
