import Link from "next/link";
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from "@/lib/mock-data";
import { ArrowRight, Star, Clock, MapPin } from "lucide-react";

export default function CustomerLandingPage() {
  const featuredItems = MOCK_MENU_ITEMS.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Now accepting QR orders
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Authentic Filipino{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Flavors
              </span>{" "}
              &amp; More
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Browse our freshly prepared menu, build your order, and let us
              serve you — right at your table. No waiting in line.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                id="order-now-cta"
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[hsl(220,25%,28%)] text-slate-300 hover:text-white hover:border-slate-500 transition-all"
              >
                Browse Menu
              </Link>
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: <Clock className="w-3.5 h-3.5" />, text: "Open 7AM – 10PM" },
                { icon: <MapPin className="w-3.5 h-3.5" />, text: "Dine-in &amp; Takeout" },
                { icon: <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />, text: "4.8 / 5 Rating" },
              ].map((chip) => (
                <div key={chip.text} className="flex items-center gap-1.5 text-xs text-slate-400">
                  {chip.icon}
                  <span dangerouslySetInnerHTML={{ __html: chip.text }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MOCK_CATEGORIES.map((cat) => {
            const emoji: Record<string, string> = {
              Pasta: "🍝",
              "Rice Meals": "🍚",
              Sandwiches: "🥪",
              Beverages: "🥤",
              Desserts: "🍮",
            };
            return (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] hover:border-blue-500/50 hover:bg-[hsl(220,25%,20%)] transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {emoji[cat.name] ?? "🍽️"}
                </span>
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Popular Picks</h2>
          <Link href="/menu" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className="group rounded-2xl bg-[hsl(220,25%,16%)] border border-[hsl(220,25%,22%)] hover:border-blue-500/40 overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-[hsl(220,25%,22%)] to-[hsl(220,25%,18%)] flex items-center justify-center">
                <span className="text-5xl opacity-60">🍝</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-blue-400">₱{item.price.toFixed(2)}</span>
                  <span className="text-xs text-slate-500">{item.category.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
