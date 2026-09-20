import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          Hasan <span className="text-violet-400">Jim</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm transition ${isActive ? "text-violet-400" : "text-mist-300 hover:text-mist-50"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/my-orders" className={({ isActive }) => `text-sm transition ${isActive ? "text-violet-400" : "text-mist-300 hover:text-mist-50"}`}>
              My Orders
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-1 text-sm transition ${isActive ? "text-violet-400" : "text-mist-300 hover:text-mist-50"}`}>
              <LayoutDashboard size={15} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full p-2 text-mist-200 transition hover:text-violet-400" aria-label="Cart">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/profile" className="flex items-center gap-1 text-sm text-mist-200 hover:text-violet-400">
                <User size={16} /> {user.name?.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-mist-400 hover:text-red-400">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden btn-primary !px-5 !py-2 text-sm md:inline-flex">
              Sign in
            </Link>
          )}

          <button className="p-2 text-mist-200 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-800 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-mist-200">
                {l.label}
              </Link>
            ))}
            {user && (
              <Link to="/my-orders" onClick={() => setOpen(false)} className="text-mist-200">My Orders</Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-mist-200">Admin</Link>
            )}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-mist-200">Profile</Link>
                <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-fit">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
