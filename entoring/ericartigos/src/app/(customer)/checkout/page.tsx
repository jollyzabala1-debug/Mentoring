"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, tableNumber, setTableNumber, clearCart } = useCart();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber] = useState(() => Math.floor(Math.random() * 900) + 1100);
  const [table, setTable] = useState(tableNumber || "");

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      router.push("/menu");
    }
  }, [items.length, submitted, router]);

  if (items.length === 0 && !submitted) {
    return null;
  }

  const qrPayload = JSON.stringify({
    orderNumber,
    tableNumber: table || "Walk-in",
    items: items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
    total: totalPrice(),
    timestamp: new Date().toISOString(),
  });

  function handleConfirm() {
    setTableNumber(table);
    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-slate-400 mb-2 text-sm">
          Your order <span className="text-white font-semibold">#{orderNumber}</span> has been placed.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Please wait while our staff prepares your order. You'll be notified when it's ready.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

      {/* Table Number Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Table Number <span className="text-slate-500">(optional)</span>
        </label>
        <input
          id="table-number-input"
          type="text"
          value={table}
          onChange={(e) => setTable(e.target.value)}
          placeholder="e.g. T-3"
          className="w-full px-4 py-2.5 rounded-xl bg-[hsl(220,25%,14%)] border border-[hsl(220,25%,24%)] text-white placeholder:text-slate-500 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        />
      </div>

      {/* QR Code */}
      <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-6 mb-6 text-center">
        <p className="text-sm text-slate-400 mb-4">
          Show this QR code to the cashier to place your order
        </p>
        <div className="bg-white p-4 rounded-xl inline-block">
          <QRCode value={qrPayload} size={180} />
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Order #{orderNumber} &bull; {table ? `Table ${table}` : "Walk-in"}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </h3>
        <div className="space-y-1.5">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-xs text-slate-400">
              <span>{i.name} × {i.quantity}</span>
              <span>₱{(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[hsl(220,25%,24%)] mt-3 pt-3 flex justify-between">
          <span className="text-sm font-bold text-white">Total</span>
          <span className="text-sm font-bold text-blue-400">{formatCurrency(totalPrice())}</span>
        </div>
      </div>

      <button
        id="confirm-order-btn"
        onClick={handleConfirm}
        className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all shadow-lg shadow-green-500/20"
      >
        Confirm Order
      </button>
    </div>
  );
}
