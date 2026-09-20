import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function Cart() {
  const { items, subtotal, loading, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate("/login");
    navigate("/checkout");
  };

  if (loading) return <Loader />;

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-mist-50">Your cart is empty</h1>
        <p className="mt-2 text-mist-400">Add a few things you like and they'll show up here.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-mist-50">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.cart_item_id} className="card-surface flex gap-4 p-4">
              <Link to={`/product/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-900">
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${item.slug}`} className="font-medium text-mist-50 hover:text-violet-400">
                    {item.name}
                  </Link>
                  <button onClick={() => removeItem(item.cart_item_id)} className="text-mist-500 hover:text-red-400" aria-label="Remove item">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-ink-600">
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                      className="p-2 text-mist-300 hover:text-violet-400"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, Math.min(item.stock, item.quantity + 1))}
                      className="p-2 text-mist-300 hover:text-violet-400"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-semibold text-violet-400">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-surface h-fit p-6">
          <h2 className="font-display text-lg font-semibold text-mist-50">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-mist-300">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>$5.00</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink-700 pt-4 font-semibold text-mist-50">
            <span>Total</span>
            <span>${(subtotal + 5).toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary mt-6 w-full">
            Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
