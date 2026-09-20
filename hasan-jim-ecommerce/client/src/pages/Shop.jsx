import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const featured = searchParams.get("featured") || "";

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: Object.fromEntries(searchParams) })
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setTotalResults(res.data.totalResults);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput);
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-mist-50">Shop</h1>
          <p className="mt-1 text-sm text-mist-400">{totalResults} products</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" size={16} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…"
            className="input-field !pl-9"
          />
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Filters sidebar */}
        <button
          className="flex items-center gap-2 text-sm text-mist-300 lg:hidden"
          onClick={() => setShowFilters((s) => !s)}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        <aside className={`${showFilters ? "block" : "hidden"} space-y-8 lg:block`}>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-mist-50">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => updateParam("category", "")}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${!category ? "bg-violet-500/15 text-violet-400" : "text-mist-300 hover:bg-ink-850"}`}
              >
                All categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam("category", c.slug)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${category === c.slug ? "bg-violet-500/15 text-violet-400" : "text-mist-300 hover:bg-ink-850"}`}
                >
                  {c.name} <span className="text-mist-500">({c.product_count})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-mist-50">Sort by</h3>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="input-field text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-mist-300">
            <input
              type="checkbox"
              checked={featured === "1"}
              onChange={(e) => updateParam("featured", e.target.checked ? "1" : "")}
              className="h-4 w-4 rounded border-ink-600 bg-ink-900 text-violet-500"
            />
            Featured only
          </label>
        </aside>

        {/* Product grid */}
        <div>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="py-24 text-center text-mist-400">
              No products match your filters. Try a different search or category.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParam("page", p)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
