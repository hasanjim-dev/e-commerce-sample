import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColors = {
  pending: "bg-gold-500/15 text-gold-400",
  processing: "bg-violet-500/15 text-violet-400",
  shipped: "bg-blue-500/15 text-blue-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = () => api.get("/orders", { params: filter ? { status: filter } : {} }).then((res) => setOrders(res.data));

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Order updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-mist-50">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-40 text-sm">
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="card-surface mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-left text-mist-400">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink-800 last:border-0">
                <td className="p-4 text-mist-50">#{o.id}<div className="text-xs text-mist-500">{new Date(o.created_at).toLocaleDateString()}</div></td>
                <td className="p-4 text-mist-300">{o.customer_name}<div className="text-xs text-mist-500">{o.customer_email}</div></td>
                <td className="p-4 text-violet-400">${Number(o.total).toFixed(2)}</td>
                <td className="p-4 capitalize text-mist-400">{o.payment_method.replace("_", " ")}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-medium capitalize ${statusColors[o.status]}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s} className="bg-ink-900 text-mist-50">{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-mist-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
