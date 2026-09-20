const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, COUNT(p.id) AS product_count
     FROM categories c LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
     GROUP BY c.id ORDER BY c.name`
  );
  res.json(rows);
});

// @route POST /api/categories (admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }
  const slug = slugify(name);
  const [result] = await pool.query(
    "INSERT INTO categories (name, slug) VALUES (?, ?)",
    [name, slug]
  );
  res.status(201).json({ id: result.insertId, name, slug });
});

// @route DELETE /api/categories/:id (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ message: "Category deleted" });
});

module.exports = { getCategories, createCategory, deleteCategory };
