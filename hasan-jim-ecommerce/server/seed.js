// Populates the database with an admin user, categories, and sample products.
// Run with: npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("./config/db");

const categories = ["Electronics", "Fashion", "Home & Living", "Books"];

const products = [
  { name: "Wireless Headphones", price: 49.99, stock: 19, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", featured: 1 },
  { name: "Smart Watch", price: 79.99, stock: 15, category: "Electronics", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600", featured: 1 },
  { name: "Cotton T-Shirt", price: 15.99, stock: 100, category: "Fashion", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", featured: 0 },
  { name: "Denim Jacket", price: 39.99, stock: 40, category: "Fashion", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", featured: 1 },
  { name: "Table Lamp", price: 22.50, stock: 30, category: "Home & Living", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", featured: 0 },
  { name: "Coffee Mug Set", price: 12.00, stock: 60, category: "Home & Living", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600", featured: 0 },
  { name: "The Pragmatic Programmer", price: 28.00, stock: 20, category: "Books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600", featured: 1 },
  { name: "Notebook Set", price: 9.99, stock: 70, category: "Books", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600", featured: 0 },
];

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log("Seeding admin user...");
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    await conn.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ('Hasan Jim', 'admin@hasanjim.com', ?, 'admin')
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [adminPassword]
    );

    console.log("Seeding categories...");
    const categoryIds = {};
    for (const name of categories) {
      const slug = slugify(name);
      await conn.query(
        `INSERT INTO categories (name, slug) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [name, slug]
      );
      const [rows] = await conn.query("SELECT id FROM categories WHERE slug = ?", [slug]);
      categoryIds[name] = rows[0].id;
    }

    console.log("Seeding products...");
    for (const p of products) {
      const slug = slugify(p.name);
      await conn.query(
        `INSERT INTO products (name, slug, description, price, stock, image_url, category_id, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE price = VALUES(price), stock = VALUES(stock)`,
        [
          p.name,
          slug,
          `${p.name} — quality product from Hasan Jim E-Commerce.`,
          p.price,
          p.stock,
          p.image,
          categoryIds[p.category],
          p.featured,
        ]
      );
    }

    console.log("✅ Seed complete.");
    console.log("Admin login → email: admin@hasanjim.com  password: Admin@123");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
