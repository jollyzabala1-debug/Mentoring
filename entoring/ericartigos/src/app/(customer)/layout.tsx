import Link from "next/link";
import CartButton from "@/components/customer/CartButton";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(220,25%,10%)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[hsl(220,25%,13%)]/90 backdrop-blur-md border-b border-[hsl(220,25%,20%)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-sm">🍽️</span>
            </div>
            <span className="font-bold text-white tracking-tight">Ericartigos</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/menu"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Menu
            </Link>
            <CartButton />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[hsl(220,25%,20%)] py-6 text-center">
        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Ericartigos Restaurant. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
