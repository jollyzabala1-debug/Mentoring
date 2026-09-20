"use client";

import { useState } from "react";
import { MOCK_USERS } from "@/lib/mock-data";
import { UserData } from "@/types";
import { formatDateShort } from "@/lib/utils";
import { Search, Plus, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ROLE_BADGE: Record<string, string> = {
  OWNER:      "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  ADMIN:      "bg-purple-500/15 text-purple-400 border-purple-500/30",
  SUPERVISOR: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  function toggleArchive(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE" } : u
      )
    );
    const user = users.find((u) => u.id === id);
    toast.success(`${user?.name} ${user?.status === "ACTIVE" ? "archived" : "restored"}`);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-slate-400 mt-1">{users.filter((u) => u.status === "ACTIVE").length} active users</p>
        </div>
        <button
          id="add-user-btn"
          onClick={() => toast.info("Add user form coming soon — connect DB first")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="users-search"
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <select
          id="users-role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-slate-300 outline-none focus:border-blue-500 transition-colors"
        >
          <option value="ALL">All Roles</option>
          <option value="OWNER">Owner</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPERVISOR">Supervisor</option>
        </select>

        <select
          id="users-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] text-sm text-slate-300 outline-none focus:border-blue-500 transition-colors"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,25%,22%)]">
                {["User", "Role", "Status", "Last Active", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,25%,20%)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">No users found</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[hsl(220,25%,18%)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border", ROLE_BADGE[user.role])}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium", user.status === "ACTIVE" ? "text-green-400" : "text-slate-500")}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "ACTIVE" ? "bg-green-400" : "bg-slate-600")} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {user.lastActive ? formatDateShort(user.lastActive) : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDateShort(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleArchive(user.id)}
                        className={cn(
                          "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors",
                          user.status === "ACTIVE"
                            ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            : "text-slate-400 hover:text-green-400 hover:bg-green-500/10"
                        )}
                      >
                        {user.status === "ACTIVE" ? (
                          <><UserX className="w-3.5 h-3.5" /> Archive</>
                        ) : (
                          <><UserCheck className="w-3.5 h-3.5" /> Restore</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
