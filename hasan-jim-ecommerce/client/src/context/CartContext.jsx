import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setSubtotal(0);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setItems(data.items);
      setSubtotal(data.subtotal);
    } catch (err) {
      // silent — cart just stays empty
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return false;
    }
    try {
      await api.post("/cart", { product_id: productId, quantity });
      toast.success("Added to cart");
      await refreshCart();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}`, { quantity });
    await refreshCart();
  };

  const removeItem = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`);
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{ items, subtotal, loading, addToCart, updateQuantity, removeItem, refreshCart, count: items.reduce((n, i) => n + i.quantity, 0) }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
