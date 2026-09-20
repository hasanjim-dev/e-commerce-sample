const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// @desc  List products — supports search, category filter, price range, sort, pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 12, 48);
  const offset = (page - 1) * limit;

  const where = ["p.is_active = 1"];
  const params = [];

  if (req.query.search) {
    where.push("(p.name LIKE ? OR p.description LIKE ?)");
    params.push(`%${req.query.search}%`, `%${req.query.search}%`);
  }
  if (req.query.category) {
    where.push("c.slug = ?");
    params.push(req.query.category);
  }
  if (req.query.minPrice) {
    where.push("p.price >= ?");
    params.push(req.query.minPrice);
  }
  if (req.query.maxPrice) {
    where.push("p.price <= ?");
    params.push(req.query.maxPrice);
  }
  if (req.query.featured) {
    where.push("p.is_featured = 1");
  }

  const sortMap = {
    newest: "p.created_at DESC",
    price_asc: "p.price ASC",
    price_desc: "p.price DESC",
    name: "p.name ASC",
  };
  const orderBy = sortMap[req.query.sort] || sortMap.newest;

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereSql}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereSql}`,
    params
  );

  const total = countRows[0].total;
  res.json({
    products: rows,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    totalResults: total,
  });
});

// @desc  Get a single product by slug, with gallery images + review summary
// @route GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.is_active = 1`,
    [req.params.slug]
  );
  if (rows.length === 0) {
    res.status(404);
    throw new Error("Product not found");
  }
  const product = rows[0];

  const [images] = await pool.query(
    "SELECT id, image_url FROM product_images WHERE product_id = ? ORDER BY sort_order",
    [product.id]
  );
  const [reviewStats] = await pool.query(
    "SELECT COUNT(*) AS count, COALESCE(AVG(rating),0) AS avgRating FROM reviews WHERE product_id = ?",
    [product.id]
  );

  res.json({ ...product, gallery: images, reviewCount: reviewStats[0].count, avgRating: Number(reviewStats[0].avgRating).toFixed(1) });
});

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, compare_price, stock, category_id, is_featured } = req.body;
  if (!name || !price) {
    res.status(400);
    throw new Error("Name and price are required");
  }

  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;
  let slug = slugify(name);

  const [existing] = await pool.query("SELECT id FROM products WHERE slug = ?", [slug]);
  if (existing.length > 0) slug = `${slug}-${Date.now()}`;

  const [result] = await pool.query(
    `INSERT INTO products (name, slug, description, price, compare_price, stock, image_url, category_id, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, slug, description || null, price, compare_price || null, stock || 0, image_url, category_id || null, is_featured ? 1 : 0]
  );

  res.status(201).json({ id: result.insertId, slug, message: "Product created" });
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  if (rows.length === 0) {
    res.status(404);
    throw new Error("Product not found");
  }
  const existing = rows[0];
  const { name, description, price, compare_price, stock, category_id, is_featured, is_active } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || existing.image_url;

  await pool.query(
    `UPDATE products SET
      name = ?, description = ?, price = ?, compare_price = ?, stock = ?,
      image_url = ?, category_id = ?, is_featured = ?, is_active = ?
     WHERE id = ?`,
    [
      name ?? existing.name,
      description ?? existing.description,
      price ?? existing.price,
      compare_price ?? existing.compare_price,
      stock ?? existing.stock,
      image_url,
      category_id ?? existing.category_id,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id,
    ]
  );

  res.json({ message: "Product updated" });
});

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product deleted" });
});

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
