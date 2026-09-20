"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { ReportData } from "@/types";

interface ProfitTrendChartProps {
  data: ReportData[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[hsl(220,25%,18%)] border border-[hsl(220,25%,26%)] rounded-xl p-3 shadow-xl text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-green-400 font-semibold">
          Net Profit: ₱{payload[0]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProfitTrendChart({ data }: ProfitTrendChartProps) {
  const chartData = [...data]
    .reverse()
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
      "Net Profit": d.netProfit,
    }));

  return (
    <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Profit Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(142,76%,36%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142,76%,36%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,25%,22%)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(220,25%,28%)" }} />
          <Area
            type="monotone"
            dataKey="Net Profit"
            stroke="hsl(142,76%,46%)"
            strokeWidth={2}
            fill="url(#profitGradient)"
            dot={{ fill: "hsl(142,76%,46%)", strokeWidth: 0, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
