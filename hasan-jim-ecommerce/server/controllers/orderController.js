const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

const SHIPPING_FEE = 5.0;

// @desc  Place an order from the current cart (COD or manual transfer)
// @route POST /api/orders
const placeOrder = asyncHandler(async (req, res) => {
  const { shipping_name, shipping_phone, shipping_address, shipping_city, payment_method, notes } = req.body;

  if (!shipping_name || !shipping_phone || !shipping_address || !shipping_city) {
    res.status(400);
    throw new Error("Full shipping details are required");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [cartItems] = await conn.query(
      `SELECT ci.quantity, p.id AS product_id, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ? FOR UPDATE`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await conn.rollback();
      res.status(400);
      throw new Error("Your cart is empty");
    }

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        res.status(400);
        throw new Error(`Not enough stock for "${item.name}"`);
      }
    }

    const subtotal = cartItems.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
    const total = subtotal + SHIPPING_FEE;

    const [orderResult] = await conn.query(
      `INSERT INTO orders
        (user_id, payment_method, subtotal, shipping_fee, total, shipping_name, shipping_phone, shipping_address, shipping_city, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        payment_method === "manual_transfer" ? "manual_transfer" : "cod",
        subtotal,
        SHIPPING_FEE,
        total,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        notes || null,
      ]
    );
    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.image_url, item.price, item.quantity, Number(item.price) * item.quantity]
      );
      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.product_id]);
    }

    await conn.query("DELETE FROM cart_items WHERE user_id = ?", [req.user.id]);

    await conn.commit();
    res.status(201).json({ orderId, total, message: "Order placed successfully" });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const [orders] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(orders);
});

// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const [orders] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  if (orders.length === 0) {
    res.status(404);
    throw new Error("Order not found");
  }
  const order = orders[0];
  if (order.user_id !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
  res.json({ ...order, items });
});

// @desc  List all orders (admin)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const where = [];
  const params = [];
  if (req.query.status) {
    where.push("o.status = ?");
    params.push(req.query.status);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [orders] = await pool.query(
    `SELECT o.*, u.name AS customer_name, u.email AS customer_email
     FROM orders o JOIN users u ON o.user_id = u.id
     ${whereSql}
     ORDER BY o.created_at DESC`,
    params
  );
  res.json(orders);
});

// @desc  Update order status / payment status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, payment_status } = req.body;
  const [result] = await pool.query(
    "UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status) WHERE id = ?",
    [status || null, payment_status || null, req.params.id]
  );
  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json({ message: "Order updated" });
});

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
