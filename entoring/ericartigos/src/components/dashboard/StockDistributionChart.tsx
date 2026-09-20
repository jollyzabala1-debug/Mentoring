"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

const DATA = [
  { name: "Good Stock",    value: 62, color: "hsl(142,76%,36%)" },
  { name: "Low Stock",     value: 24, color: "hsl(48,96%,53%)" },
  { name: "Out of Stock",  value: 14, color: "hsl(0,84%,60%)" },
];

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[hsl(220,25%,18%)] border border-[hsl(220,25%,26%)] rounded-xl p-3 shadow-xl text-xs">
        <p style={{ color: payload[0].payload.color }} className="font-semibold">
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function StockDistributionChart() {
  return (
    <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Stock Level Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={DATA}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {DATA.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
