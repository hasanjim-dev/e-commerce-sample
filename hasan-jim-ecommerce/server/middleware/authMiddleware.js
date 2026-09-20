const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

// Verifies the JWT and attaches the current user to req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      "SELECT id, name, email, role, phone, address_line, city FROM users WHERE id = ?",
      [decoded.id]
    );
    if (rows.length === 0) {
      res.status(401);
      throw new Error("User no longer exists");
    }
    req.user = rows[0];
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }
});

// Restricts a route to admin users only — use after `protect`
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Admin access required");
};

module.exports = { protect, adminOnly };
