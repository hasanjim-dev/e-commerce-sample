import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const statusColors = {
  pending: "bg-gold-500/15 text-gold-400",
  processing: "bg-violet-500/15 text-violet-400",
  shipped: "bg-blue-500/15 text-blue-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="container-page py-24 text-center text-mist-400">Order not found.</div>;

  return (
    <div className="container-page max-w-2xl py-10">
      <Link to="/my-orders" className="text-sm text-violet-400 hover:text-violet-300">← Back to orders</Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-mist-50">Order #{order.id}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-mist-500">Placed on {new Date(order.created_at).toLocaleString()}</p>

      <div className="card-surface mt-6 divide-y divide-ink-700">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 overflow-hidden rounded-lg bg-ink-900">
              {item.product_image && <img src={item.product_image} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">
              <div className="text-mist-50">{item.product_name}</div>
              <div className="text-sm text-mist-500">Qty {item.quantity} × ${Number(item.unit_price).toFixed(2)}</div>
            </div>
            <div className="font-semibold text-violet-400">${Number(item.line_total).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="card-surface mt-6 p-5 text-sm text-mist-300">
        <div className="flex justify-between"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>${Number(order.shipping_fee).toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between border-t border-ink-700 pt-2 font-semibold text-mist-50">
          <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      <div className="card-surface mt-6 p-5">
        <h2 className="mb-2 font-semibold text-mist-50">Shipping to</h2>
        <p className="text-sm text-mist-300">
          {order.shipping_name} · {order.shipping_phone}<br />
          {order.shipping_address}, {order.shipping_city}
        </p>
        <p className="mt-2 text-sm text-mist-500 capitalize">
          Payment: {order.payment_method.replace("_", " ")} ({order.payment_status})
        </p>
      </div>
    </div>
  );
}
