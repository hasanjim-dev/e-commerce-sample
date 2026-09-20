import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-800">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold">
            Hasan <span className="text-violet-400">Jim</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-mist-400">
            Everyday products, picked with care and delivered without fuss.
          </p>
          <div className="mt-5 flex gap-4 text-mist-400">
            <a href="#" aria-label="GitHub" className="hover:text-violet-400"><Github size={18} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-violet-400"><Linkedin size={18} /></a>
            <a href="#" aria-label="Email" className="hover:text-violet-400"><Mail size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-mist-50">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-mist-400">
            <li><a href="/shop" className="hover:text-violet-400">All Products</a></li>
            <li><a href="/shop?featured=1" className="hover:text-violet-400">Featured</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-mist-50">Support</h4>
          <ul className="mt-4 space-y-2 text-sm text-mist-400">
            <li><a href="/my-orders" className="hover:text-violet-400">Track an Order</a></li>
            <li><a href="/cart" className="hover:text-violet-400">Cart</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800 py-6 text-center text-xs text-mist-500">
        © {new Date().getFullYear()} Hasan Jim E-Commerce. Built for demonstration purposes.
      </div>
    </footer>
  );
}
