import { auth } from "@/lib/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  // Protected routes: /dashboard/*
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      return Response.redirect(
        new URL("/login", req.nextUrl.origin)
      );
    }
  }

  // Redirect logged-in users away from login page
  if (req.nextUrl.pathname === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return null;
});
