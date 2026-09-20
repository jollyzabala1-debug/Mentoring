"use client";

import { Bell } from "lucide-react";

interface TopBarProps {
  user: {
    name?: string | null;
    role?: string;
  };
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 bg-[hsl(220,25%,12%)] border-b border-[hsl(220,25%,20%)]">
      <div>
        <p className="text-xs text-slate-500">
          Welcome back,{" "}
          <span className="text-slate-300 font-medium">{user.name}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          id="notifications-btn"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[hsl(220,25%,20%)] transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
}
