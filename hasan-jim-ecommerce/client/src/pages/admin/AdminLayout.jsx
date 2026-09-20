import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, Tags } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/categories", label: "Categories", icon: Tags },
];

export default function AdminLayout() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <h2 className="mb-4 px-3 font-display text-lg font-semibold text-mist-50">Admin Panel</h2>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive ? "bg-violet-500/15 text-violet-400" : "text-mist-300 hover:bg-ink-850"
              }`
            }
          >
            <item.icon size={16} /> {item.label}
          </NavLink>
        ))}
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
