"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { ReportData } from "@/types";

interface RevenueChartProps {
  data: ReportData[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[hsl(220,25%,18%)] border border-[hsl(220,25%,26%)] rounded-xl p-3 shadow-xl text-xs">
        <p className="text-slate-400 mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name}: ₱{Number(p.value).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = [...data]
    .reverse()
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
      Revenue: d.totalRevenue,
      Expenses: d.totalExpenses,
    }));

  return (
    <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Revenue vs Expenses</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,25%,22%)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(220,25%,20%)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="Revenue" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="hsl(25,95%,53%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
