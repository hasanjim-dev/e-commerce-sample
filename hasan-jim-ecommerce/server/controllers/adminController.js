const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

// @route GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [[{ totalRevenue }]] = await pool.query(
    "SELECT COALESCE(SUM(total),0) AS totalRevenue FROM orders WHERE payment_status = 'paid' OR payment_method = 'cod'"
  );
  const [[{ totalOrders }]] = await pool.query("SELECT COUNT(*) AS totalOrders FROM orders");
  const [[{ pendingOrders }]] = await pool.query(
    "SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'"
  );
  const [[{ totalProducts }]] = await pool.query("SELECT COUNT(*) AS totalProducts FROM products");
  const [[{ totalCustomers }]] = await pool.query(
    "SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'customer'"
  );
  const [[{ lowStock }]] = await pool.query("SELECT COUNT(*) AS lowStock FROM products WHERE stock <= 5");

  const [recentOrders] = await pool.query(
    `SELECT o.id, o.total, o.status, o.created_at, u.name AS customer_name
     FROM orders o JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC LIMIT 5`
  );

  const [topProducts] = await pool.query(
    `SELECT p.name, SUM(oi.quantity) AS units_sold
     FROM order_items oi JOIN products p ON oi.product_id = p.id
     GROUP BY oi.product_id ORDER BY units_sold DESC LIMIT 5`
  );

  res.json({
    totalRevenue: Number(totalRevenue),
    totalOrders,
    pendingOrders,
    totalProducts,
    totalCustomers,
    lowStock,
    recentOrders,
    topProducts,
  });
});

module.exports = { getDashboardStats };
