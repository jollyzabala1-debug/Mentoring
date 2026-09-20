import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: "blue" | "green" | "orange" | "red" | "purple";
}

const ACCENT = {
  blue:   { bg: "bg-blue-500/10",   icon: "text-blue-400",   border: "border-blue-500/20" },
  green:  { bg: "bg-green-500/10",  icon: "text-green-400",  border: "border-green-500/20" },
  orange: { bg: "bg-orange-500/10", icon: "text-orange-400", border: "border-orange-500/20" },
  red:    { bg: "bg-red-500/10",    icon: "text-red-400",    border: "border-red-500/20" },
  purple: { bg: "bg-purple-500/10", icon: "text-purple-400", border: "border-purple-500/20" },
};

export default function StatsCard({ label, value, icon: Icon, trend, accent = "blue" }: StatsCardProps) {
  const a = ACCENT[accent];
  return (
    <div className={cn(
      "rounded-2xl bg-[hsl(220,25%,16%)] border p-5 flex items-start justify-between gap-4",
      a.border
    )}>
      <div>
        <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <p className={cn(
            "text-xs mt-1 font-medium",
            trend.up ? "text-green-400" : "text-red-400"
          )}>
            {trend.up ? "↑" : "↓"} {trend.value} vs yesterday
          </p>
        )}
      </div>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", a.bg)}>
        <Icon className={cn("w-5 h-5", a.icon)} />
      </div>
    </div>
  );
}
