const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.name, p.slug,
            p.price, p.image_url, p.stock
     FROM cart_items ci JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ? ORDER BY ci.created_at DESC`,
    [req.user.id]
  );
  const subtotal = rows.reduce((sum, r) => sum + Number(r.price) * r.quantity, 0);
  res.json({ items: rows, subtotal: Number(subtotal.toFixed(2)) });
});

// @route POST /api/cart  { product_id, quantity }
const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  const [productRows] = await pool.query("SELECT * FROM products WHERE id = ? AND is_active = 1", [product_id]);
  if (productRows.length === 0) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (productRows[0].stock < quantity) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [req.user.id, product_id, quantity]
  );
  res.status(201).json({ message: "Added to cart" });
});

// @route PUT /api/cart/:cartItemId  { quantity }
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }
  const [result] = await pool.query(
    "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
    [quantity, req.params.cartItemId, req.user.id]
  );
  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error("Cart item not found");
  }
  res.json({ message: "Cart updated" });
});

// @route DELETE /api/cart/:cartItemId
const removeCartItem = asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [req.params.cartItemId, req.user.id]);
  res.json({ message: "Item removed" });
});

// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM cart_items WHERE user_id = ?", [req.user.id]);
  res.json({ message: "Cart cleared" });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
