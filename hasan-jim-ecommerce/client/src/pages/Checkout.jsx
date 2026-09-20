import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { items, subtotal, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shipping_name: user?.name || "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    payment_method: "cod",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-mist-300">Your cart is empty — add something before checking out.</p>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", form);
      await refreshCart();
      toast.success("Order placed successfully!");
      navigate(`/my-orders/${data.orderId}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-mist-50">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold text-mist-50">Shipping Details</h2>

          <div>
            <label className="mb-1.5 block text-sm text-mist-300">Full name</label>
            <input name="shipping_name" required value={form.shipping_name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-mist-300">Phone number</label>
            <input name="shipping_phone" required value={form.shipping_phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-mist-300">Address</label>
            <input name="shipping_address" required value={form.shipping_address} onChange={handleChange} className="input-field" placeholder="House, road, area" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-mist-300">City</label>
            <input name="shipping_city" required value={form.shipping_city} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-mist-300">Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="input-field" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-mist-300">Payment method</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 rounded-lg border border-ink-700 p-3 text-sm text-mist-200">
                <input type="radio" name="payment_method" value="cod" checked={form.payment_method === "cod"} onChange={handleChange} className="text-violet-500" />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-ink-700 p-3 text-sm text-mist-200">
                <input type="radio" name="payment_method" value="manual_transfer" checked={form.payment_method === "manual_transfer"} onChange={handleChange} className="text-violet-500" />
                Manual Bank/Mobile Transfer
              </label>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>

        <div className="card-surface h-fit p-6">
          <h2 className="font-display text-lg font-semibold text-mist-50">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.cart_item_id} className="flex justify-between text-mist-300">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-ink-700 pt-4 text-sm text-mist-300">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>$5.00</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink-700 pt-4 font-semibold text-mist-50">
            <span>Total</span>
            <span>${(subtotal + 5).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
