import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const perks = [
  { icon: Truck, title: "Fast delivery", desc: "Dhaka-wide delivery in 24–48 hours" },
  { icon: ShieldCheck, title: "Secure checkout", desc: "Your details stay protected" },
  { icon: RotateCcw, title: "Easy returns", desc: "7-day hassle-free return window" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products", { params: { featured: 1, limit: 8 } }),
      api.get("/categories"),
    ])
      .then(([p, c]) => {
        setFeatured(p.data.products);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-800">
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
        />
        <div className="container-page relative grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 px-4 py-1.5 text-xs text-mist-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> New arrivals every week
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-mist-50 sm:text-5xl">
              Everyday things, chosen with an eye for quality.
            </h1>
            <p className="mt-5 max-w-md text-mist-400">
              From tech to home essentials — Hasan Jim curates a small, dependable catalog so
              you don't have to sift through a thousand options to find one good one.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary">
                Browse the shop <ArrowRight size={16} />
              </Link>
              <Link to="/shop?featured=1" className="btn-outline">
                See featured
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((p, i) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className={`overflow-hidden rounded-2xl border border-ink-700 bg-ink-850 ${i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
              >
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-page grid gap-6 py-12 sm:grid-cols-3">
        {perks.map((perk) => (
          <div key={perk.title} className="flex items-start gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
              <perk.icon size={20} />
            </div>
            <div>
              <div className="font-medium text-mist-50">{perk.title}</div>
              <div className="text-sm text-mist-400">{perk.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-page py-8">
          <h2 className="font-display text-2xl font-semibold text-mist-50">Shop by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop?category=${c.slug}`}
                className="card-surface flex flex-col items-center justify-center gap-1 py-8 text-center transition hover:border-violet-600/60"
              >
                <span className="font-medium text-mist-50">{c.name}</span>
                <span className="text-xs text-mist-500">{c.product_count} items</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="container-page py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-mist-50">Featured products</h2>
          <Link to="/shop" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
