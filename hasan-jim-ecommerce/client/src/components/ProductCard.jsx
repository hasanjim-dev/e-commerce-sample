import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-850 transition hover:border-violet-600/60 hover:shadow-glow">
      <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-ink-900">
        <img
          src={product.image_url || "https://placehold.co/400x400/14141C/8B5CF6?text=No+Image"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      {outOfStock && (
        <span className="absolute left-3 top-3 rounded-full bg-ink-950/90 px-3 py-1 text-xs font-medium text-mist-200">
          Out of stock
        </span>
      )}
      {product.is_featured === 1 && !outOfStock && (
        <span className="absolute left-3 top-3 rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-ink-950">
          Featured
        </span>
      )}

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category_name && (
          <span className="text-xs text-mist-500">{product.category_name}</span>
        )}
        <Link to={`/product/${product.slug}`} className="line-clamp-1 font-medium text-mist-50 hover:text-violet-400">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold text-violet-400">${Number(product.price).toFixed(2)}</span>
            {product.compare_price && (
              <span className="text-sm text-mist-500 line-through">${Number(product.compare_price).toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product.id, 1)}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="rounded-full border border-ink-600 p-2 text-mist-200 transition hover:border-violet-500 hover:text-violet-400 disabled:opacity-40"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
