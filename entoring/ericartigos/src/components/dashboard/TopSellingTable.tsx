import { TopMenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface TopSellingTableProps {
  items: TopMenuItem[];
}

export default function TopSellingTable({ items }: TopSellingTableProps) {
  return (
    <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Top Selling Items</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[hsl(220,25%,20%)] transition-colors"
          >
            <span className="w-6 h-6 rounded-lg bg-[hsl(220,25%,22%)] flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
              {i + 1}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[hsl(220,25%,22%)] flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🍝</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{item.name}</p>
              <p className="text-xs text-slate-500">{item.totalSold} sold</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-blue-400">{formatCurrency(item.totalRevenue)}</p>
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">+{Math.floor(Math.random() * 15 + 3)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
