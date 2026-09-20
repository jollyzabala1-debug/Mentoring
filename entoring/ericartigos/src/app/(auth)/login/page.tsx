"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type RoleOption = {
  value: "OWNER" | "ADMIN" | "SUPERVISOR";
  label: string;
  description: string;
  icon: string;
  color: string;
};

const ROLES: RoleOption[] = [
  {
    value: "OWNER",
    label: "Owner",
    description: "Full system access",
    icon: "👑",
    color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/40 data-[selected=true]:border-yellow-400 data-[selected=true]:bg-yellow-500/20",
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Management & reporting",
    icon: "🛡️",
    color: "from-purple-500/20 to-violet-500/10 border-purple-500/40 data-[selected=true]:border-purple-400 data-[selected=true]:bg-purple-500/20",
  },
  {
    value: "SUPERVISOR",
    label: "Supervisor",
    description: "Orders & inventory",
    icon: "📋",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/40 data-[selected=true]:border-blue-400 data-[selected=true]:bg-blue-500/20",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleOption["value"]>("OWNER");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: selectedRole,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials or role mismatch. Please try again.");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(220,25%,10%)] px-4">
      {/* Background decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 mb-4">
            <span className="text-2xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ericartigos</h1>
          <p className="text-sm text-slate-400 mt-1">Restaurant Management System</p>
        </div>

        {/* Card */}
        <div className="bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,24%)] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-1">Sign in to your account</h2>
          <p className="text-sm text-slate-400 mb-6">Select your role, then enter your credentials</p>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                data-selected={selectedRole === role.value}
                onClick={() => setSelectedRole(role.value)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border bg-gradient-to-b transition-all duration-200 text-center cursor-pointer",
                  role.color,
                  selectedRole === role.value
                    ? "ring-2 ring-offset-2 ring-offset-[hsl(220,25%,16%)]"
                    : "opacity-70 hover:opacity-90"
                )}
              >
                <span className="text-2xl">{role.icon}</span>
                <span className="text-xs font-semibold text-white">{role.label}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{role.description}</span>
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@ericartigos.com"
                {...register("email")}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl bg-[hsl(220,25%,12%)] border text-white placeholder:text-slate-500 text-sm transition-colors outline-none",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.email ? "border-red-500" : "border-[hsl(220,25%,24%)]"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl bg-[hsl(220,25%,12%)] border text-white placeholder:text-slate-500 text-sm transition-colors outline-none",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.password ? "border-red-500" : "border-[hsl(220,25%,24%)]"
                )}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                `Sign in as ${ROLES.find((r) => r.value === selectedRole)?.label}`
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Ericartigos Restaurant System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
