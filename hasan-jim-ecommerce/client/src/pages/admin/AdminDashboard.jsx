import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle } from "lucide-react";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart },
    { label: "Pending Orders", value: stats.pendingOrders, icon: AlertTriangle },
    { label: "Products", value: stats.totalProducts, icon: Package },
    { label: "Customers", value: stats.totalCustomers, icon: Users },
    { label: "Low Stock (≤5)", value: stats.lowStock, icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-mist-50">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-5">
            <div className="flex items-center gap-2 text-mist-400">
              <c.icon size={16} />
              <span className="text-sm">{c.label}</span>
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-mist-50">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="mb-4 font-semibold text-mist-50">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.map((o) => (
              <Link key={o.id} to="/admin/orders" className="flex items-center justify-between text-sm">
                <span className="text-mist-300">#{o.id} · {o.customer_name}</span>
                <span className="text-violet-400">${Number(o.total).toFixed(2)}</span>
              </Link>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-sm text-mist-500">No orders yet.</p>}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="mb-4 font-semibold text-mist-50">Top Selling Products</h2>
          <div className="space-y-3">
            {stats.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-mist-300">{p.name}</span>
                <span className="text-mist-500">{p.units_sold} sold</span>
              </div>
            ))}
            {stats.topProducts.length === 0 && <p className="text-sm text-mist-500">No sales yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
