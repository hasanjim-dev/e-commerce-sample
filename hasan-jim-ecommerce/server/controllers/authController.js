const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

// @desc  Register a new customer
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed]
  );

  const user = { id: result.insertId, name, email, role: "customer" };
  res.status(201).json({ ...user, token: generateToken(user.id) });
});

// @desc  Login
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id),
  });
});

// @desc  Get logged-in user's profile
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc  Update profile (name, phone, address)
// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address_line, city } = req.body;
  await pool.query(
    "UPDATE users SET name = COALESCE(?, name), phone = ?, address_line = ?, city = ? WHERE id = ?",
    [name, phone || null, address_line || null, city || null, req.user.id]
  );
  const [rows] = await pool.query(
    "SELECT id, name, email, role, phone, address_line, city FROM users WHERE id = ?",
    [req.user.id]
  );
  res.json(rows[0]);
});

module.exports = { register, login, getMe, updateMe };
