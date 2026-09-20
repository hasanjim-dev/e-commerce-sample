# 🛍️ Hasan Jim E-Commerce

A full-stack e-commerce web application built with **React**, **Node.js**, **Express**, and **MySQL** — featuring a complete shopping experience (browsing, cart, checkout, order tracking) and a fully functional admin dashboard for managing products, orders, and categories.

<!-- Add a live demo link here once deployed, e.g.: -->
<!-- 🔗 **Live Demo:** [hasan-jim-shop.vercel.app](#) -->
## ✨ Features

### Customer
- Browse products with **search, category filters, price sorting, and pagination**
- Product detail pages with image gallery, stock status, and ratings
- Persistent shopping cart (saved per user in the database)
- Checkout with **Cash on Delivery** or **manual bank transfer**
- Order history and order status tracking
- User authentication (JWT) with profile management

### Admin
- Dashboard with revenue, order, and stock statistics
- Full product CRUD with image upload
- Order management with status updates (pending → processing → shipped → delivered)
- Category management

---

## 🛠️ Tech Stack

**Frontend:** React, React Router, Tailwind CSS, Axios, Vite
**Backend:** Node.js, Express.js, JWT Authentication, Multer (file uploads)
**Database:** MySQL (with connection pooling via `mysql2`)
**Other:** bcrypt.js (password hashing), RESTful API architecture

---

## 🏗️ Project Architecture

```
hasan-jim-ecommerce/
├── server/                 # Node.js/Express REST API
│   ├── config/db.js        # MySQL connection pool
│   ├── controllers/        # Business logic (auth, products, orders, cart...)
│   ├── middleware/         # JWT auth, error handling, file uploads
│   ├── routes/             # API route definitions
│   ├── schema.sql          # Database schema
│   └── server.js           # App entry point
└── client/                 # React (Vite) frontend
    └── src/
        ├── pages/          # Route-level pages (incl. admin panel)
        ├── components/     # Reusable UI components
        ├── context/        # Global state (Auth, Cart)
        └── services/api.js # Axios instance
```

---

## 🔑 Key Technical Highlights

- **Transactional checkout** — stock is deducted safely inside a MySQL transaction, preventing overselling during concurrent orders
- **Normalized relational schema** — proper foreign keys, indexes, and a full-text search index on products
- **JWT-based authentication** with role-based access control (customer vs. admin)
- **RESTful API design** with centralized error handling and input validation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### 1. Clone the repository
```bash
git clone https://github.com/hasanjim-dev/e-commerce-sample.git
cd e-commerce-sample
```

### 2. Set up the database
```bash
mysql -u root -p < server/schema.sql
```

### 3. Backend setup
```bash
cd server
npm install
cp .env.example .env   # then fill in your MySQL password & a JWT secret
npm run seed            # creates an admin account + sample products
npm run dev              # runs on http://localhost:5000
```

### 4. Frontend setup
```bash
cd client
npm install
npm run dev              # runs on http://localhost:5173
```

### Demo Admin Login
```
Email:    admin@hasanjim.com
Password: Admin@123
```

---

## 📡 API Overview

| Method | Endpoint              | Description                  |
|--------|------------------------|-------------------------------|
| POST   | `/api/auth/register`   | Register a new user          |
| POST   | `/api/auth/login`      | Login and receive a JWT      |
| GET    | `/api/products`        | List products (search/filter/paginate) |
| GET    | `/api/products/:slug`  | Get product details          |
| POST   | `/api/cart`             | Add item to cart             |
| POST   | `/api/orders`           | Place an order (checkout)    |
| GET    | `/api/admin/stats`      | Admin dashboard statistics   |

---

## 🔮 Future Improvements
- Online payment gateway integration (SSLCommerz / Stripe)
- Email verification & password reset
- Product reviews and ratings UI
- Wishlist feature

---

## 👤 Author

**Muntasir Hasan Jim**
Full Stack Developer
- Portfolio: [muntasirhasanjim.vercel.app](https://muntasirhasanjim.vercel.app)
- GitHub: [@hasanjim-dev](https://github.com/hasanjim-dev)
