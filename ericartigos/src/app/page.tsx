import { redirect } from "next/navigation";

/**
 * Home page - redirects to login or dashboard based on auth state
 */
export default function Home() {
  // Redirect to dashboard
  // Middleware will handle auth check and redirect to login if needed
  redirect("/dashboard");
}
