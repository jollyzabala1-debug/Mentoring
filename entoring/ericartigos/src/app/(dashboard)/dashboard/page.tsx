import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  MOCK_DAILY_REPORTS,
  MOCK_INVENTORY,
  MOCK_ORDERS,
  MOCK_TOP_ITEMS,
} from "@/lib/mock-data";
import StatsCard from "@/components/dashboard/StatsCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ProfitTrendChart from "@/components/dashboard/ProfitTrendChart";
import StockDistributionChart from "@/components/dashboard/StockDistributionChart";
import TopSellingTable from "@/components/dashboard/TopSellingTable";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role;
  const today = MOCK_DAILY_REPORTS[0];
  const yesterday = MOCK_DAILY_REPORTS[1];

  const lowStock = MOCK_INVENTORY.filter((i) => i.status === "LOW").length;
  const outOfStock = MOCK_INVENTORY.filter((i) => i.status === "OUT_OF_STOCK").length;
  const pendingOrders = MOCK_ORDERS.filter((o) => o.status === "PENDING").length;

  const revTrend = (((today.totalRevenue - yesterday.totalRevenue) / yesterday.totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR") && (
          <>
            <StatsCard
              label="Today's Revenue"
              value={formatCurrency(today.totalRevenue)}
              icon={DollarSign}
              accent="blue"
              trend={{ value: `${Math.abs(Number(revTrend))}%`, up: Number(revTrend) > 0 }}
            />
            <StatsCard
              label="Total Orders"
              value={String(today.totalOrders)}
              icon={ShoppingCart}
              accent="purple"
              trend={{ value: "8.2%", up: true }}
            />
          </>
        )}

        {role === "OWNER" && (
          <StatsCard
            label="Net Profit"
            value={formatCurrency(today.netProfit)}
            icon={TrendingUp}
            accent="green"
            trend={{ value: "5.4%", up: true }}
          />
        )}

        <StatsCard
          label="Low / Out of Stock"
          value={`${lowStock} / ${outOfStock}`}
          icon={Package}
          accent={outOfStock > 0 ? "red" : "orange"}
        />

        {role === "SUPERVISOR" && (
          <StatsCard
            label="Pending Orders"
            value={String(pendingOrders)}
            icon={AlertTriangle}
            accent="orange"
          />
        )}
      </div>

      {/* ── Owner: Full Charts ────────────────────────────── */}
      {role === "OWNER" && (
        <>
          <div className="grid lg:grid-cols-2 gap-4">
            <RevenueChart data={MOCK_DAILY_REPORTS} />
            <ProfitTrendChart data={MOCK_DAILY_REPORTS} />
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <TopSellingTable items={MOCK_TOP_ITEMS} />
            <StockDistributionChart />
          </div>
        </>
      )}

      {/* ── Admin: Inventory + Top Items ──────────────────── */}
      {role === "ADMIN" && (
        <>
          <div className="grid lg:grid-cols-2 gap-4">
            <TopSellingTable items={MOCK_TOP_ITEMS} />
            {/* Inventory Status */}
            <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Inventory Status</h3>
              <div className="space-y-2">
                {MOCK_INVENTORY.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 truncate">{item.name}</span>
                    <span className={
                      item.status === "GOOD" ? "text-green-400 text-xs font-medium" :
                      item.status === "LOW" ? "text-yellow-400 text-xs font-medium" :
                      "text-red-400 text-xs font-medium"
                    }>
                      {item.status === "OUT_OF_STOCK" ? "Out of Stock" : item.status === "LOW" ? "Low" : "Good"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Decision Support */}
          <div className="bg-[hsl(220,25%,16%)] border border-yellow-500/20 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">💡 Decision Support Insights</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-400">
              <div className="flex gap-2"><span className="text-yellow-400">⚠</span> Olive Oil is out of stock — affects pasta items</div>
              <div className="flex gap-2"><span className="text-blue-400">📈</span> Spaghetti Carbonara trending up — consider promotion</div>
              <div className="flex gap-2"><span className="text-green-400">✓</span> Chicken Breast levels are adequate for 3 more days</div>
              <div className="flex gap-2"><span className="text-orange-400">🔔</span> Parmesan Cheese nearing low threshold</div>
            </div>
          </div>
        </>
      )}

      {/* ── Supervisor: Orders Summary ───────────────────── */}
      {role === "SUPERVISOR" && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["PENDING", "PREPARING", "READY", "COMPLETED"] as const).map((status) => {
              const count = MOCK_ORDERS.filter((o) => o.status === status).length;
              const COLOR: Record<string, string> = {
                PENDING: "border-orange-500/30 text-orange-400",
                PREPARING: "border-blue-500/30 text-blue-400",
                READY: "border-green-500/30 text-green-400",
                COMPLETED: "border-slate-500/30 text-slate-400",
              };
              return (
                <div key={status} className={`bg-[hsl(220,25%,16%)] border rounded-2xl p-4 text-center ${COLOR[status]}`}>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs font-medium mt-1 capitalize">{status.toLowerCase()}</p>
                </div>
              );
            })}
          </div>
          <RevenueChart data={MOCK_DAILY_REPORTS} />
        </>
      )}
    </div>
  );
}
