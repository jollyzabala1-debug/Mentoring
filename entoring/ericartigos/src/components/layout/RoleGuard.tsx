"use client";

import { useSession } from "next-auth/react";

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;

  if (!role || !roles.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
