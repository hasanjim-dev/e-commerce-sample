import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Minus, Plus, ShoppingBag } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(0);
        setQuantity(1);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (notFound || !product) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-mist-300">This product could not be found.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to shop</Link>
      </div>
    );
  }

  const images = [product.image_url, ...product.gallery.map((g) => g.image_url)].filter(Boolean);

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-mist-500">
        <Link to="/shop" className="hover:text-violet-400">Shop</Link>
        {product.category_name && (
          <>
            {" / "}
            <Link to={`/shop?category=${product.category_slug}`} className="hover:text-violet-400">{product.category_name}</Link>
          </>
        )}
        {" / "}
        <span className="text-mist-300">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
            <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border ${i === activeImage ? "border-violet-500" : "border-ink-700"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category_name && <span className="text-sm text-mist-500">{product.category_name}</span>}
          <h1 className="mt-1 font-display text-3xl font-semibold text-mist-50">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-mist-400">
              <div className="flex items-center gap-0.5 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.avgRating) ? "currentColor" : "none"} />
                ))}
              </div>
              {product.avgRating} ({product.reviewCount} reviews)
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-violet-400">${Number(product.price).toFixed(2)}</span>
            {product.compare_price && (
              <span className="text-lg text-mist-500 line-through">${Number(product.compare_price).toFixed(2)}</span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-mist-300">{product.description}</p>

          <div className="mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-emerald-400">In stock — {product.stock} available</span>
            ) : (
              <span className="text-red-400">Out of stock</span>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-ink-600">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-mist-300 hover:text-violet-400"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="p-3 text-mist-300 hover:text-violet-400"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => addToCart(product.id, quantity)}
              disabled={product.stock <= 0}
              className="btn-primary flex-1"
            >
              <ShoppingBag size={16} /> Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
