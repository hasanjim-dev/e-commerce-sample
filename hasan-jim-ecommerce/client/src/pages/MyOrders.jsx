import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const statusColors = {
  pending: "bg-gold-500/15 text-gold-400",
  processing: "bg-violet-500/15 text-violet-400",
  shipped: "bg-blue-500/15 text-blue-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-mist-50">My Orders</h1>

      {orders.length === 0 ? (
        <div className="py-16 text-center text-mist-400">
          You haven't placed any orders yet. <Link to="/shop" className="text-violet-400">Start shopping</Link>.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/my-orders/${order.id}`}
              className="card-surface flex flex-wrap items-center justify-between gap-3 p-5 transition hover:border-violet-600/60"
            >
              <div>
                <div className="font-medium text-mist-50">Order #{order.id}</div>
                <div className="text-sm text-mist-500">{new Date(order.created_at).toLocaleDateString()}</div>
              </div>
              <div className="font-semibold text-violet-400">${Number(order.total).toFixed(2)}</div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
