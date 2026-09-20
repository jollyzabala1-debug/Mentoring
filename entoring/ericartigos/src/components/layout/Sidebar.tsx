"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  Package,
  BarChart2,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["OWNER", "ADMIN", "SUPERVISOR"] },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList, roles: ["OWNER", "SUPERVISOR"] },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed, roles: ["OWNER", "ADMIN", "SUPERVISOR"] },
  { href: "/dashboard/users", label: "Users", icon: Users, roles: ["OWNER", "ADMIN"] },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package, roles: ["OWNER", "SUPERVISOR"] },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart2, roles: ["OWNER", "ADMIN", "SUPERVISOR"] },
];

const ROLE_COLOR: Record<string, string> = {
  OWNER: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  ADMIN: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  SUPERVISOR: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const role = user.role ?? "";
  const allowedItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-[hsl(220,25%,14%)] border-r border-[hsl(220,25%,20%)]">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[hsl(220,25%,20%)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <span className="text-lg">🍽️</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Ericartigos</p>
            <p className="text-[10px] text-slate-500">Restaurant System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-2">
          Navigation
        </p>
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href + "/") || pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/25"
                  : "text-slate-400 hover:text-white hover:bg-[hsl(220,25%,20%)]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              {item.label}
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-blue-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-[hsl(220,25%,20%)]">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {user.name?.charAt(0).toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <span
          className={cn(
            "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-3 ml-2",
            ROLE_COLOR[role] ?? "bg-slate-700 text-slate-400"
          )}
        >
          {role}
        </span>

        <button
          id="logout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
