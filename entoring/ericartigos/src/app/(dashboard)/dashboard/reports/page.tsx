"use client";

import { useState } from "react";
import { MOCK_DAILY_REPORTS, MOCK_TOP_ITEMS } from "@/lib/mock-data";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ProfitTrendChart from "@/components/dashboard/ProfitTrendChart";
import TopSellingTable from "@/components/dashboard/TopSellingTable";
import { formatCurrency } from "@/lib/utils";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

type Period = "day" | "week" | "month" | "year";

const PERIOD_LABELS: Record<Period, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

// Simulated aggregation multipliers
const MULTIPLIERS: Record<Period, number> = { day: 1, week: 7, month: 30, year: 365 };

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("week");

  const mult = MULTIPLIERS[period];
  const base = MOCK_DAILY_REPORTS[0];

  const summary = {
    totalRevenue: base.totalRevenue * mult,
    totalExpenses: base.totalExpenses * mult,
    netProfit: base.netProfit * mult,
    totalOrders: base.totalOrders * mult,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports &amp; Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Financial performance overview</p>
        </div>
        <div className="flex gap-2">
          <button
            id="reports-print-btn"
            onClick={() => toast.info("Print report coming soon")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(220,25%,18%)] border border-[hsl(220,25%,24%)] text-slate-300 hover:text-white text-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            id="reports-export-btn"
            onClick={() => toast.info("CSV export coming soon")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(220,25%,18%)] border border-[hsl(220,25%,24%)] text-slate-300 hover:text-white text-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2">
        {(["day", "week", "month", "year"] as Period[]).map((p) => (
          <button
            key={p}
            id={`reports-tab-${p}`}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === p
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-[hsl(220,25%,18%)] text-slate-400 hover:text-white border border-[hsl(220,25%,24%)]"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(summary.totalRevenue), color: "text-blue-400" },
          { label: "Total Expenses", value: formatCurrency(summary.totalExpenses), color: "text-orange-400" },
          { label: "Net Profit", value: formatCurrency(summary.netProfit), color: "text-green-400" },
          { label: "Total Orders", value: summary.totalOrders.toLocaleString(), color: "text-purple-400" },
        ].map((card) => (
          <div key={card.label} className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{PERIOD_LABELS[period]}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <RevenueChart data={MOCK_DAILY_REPORTS} />
        <ProfitTrendChart data={MOCK_DAILY_REPORTS} />
      </div>

      {/* Top Items */}
      <TopSellingTable items={MOCK_TOP_ITEMS} />
    </div>
  );
}
