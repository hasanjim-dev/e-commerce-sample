# Hasan Jim E-Commerce — Professional Edition

A full-stack e-commerce app rebuilt from your original project: **React + Tailwind**
frontend, **Node.js/Express** backend, **MySQL** database. Same product catalog you
already had, with proper architecture, a polished UI, real cart/checkout, order
tracking, and a working admin panel.

## What's included

- **Customer side:** home page, shop with search/filter/sort/pagination, product
  detail pages, persistent cart, checkout (Cash on Delivery or manual transfer),
  order history, profile editing.
- **Admin side:** dashboard with revenue/orders/stock stats, product CRUD (with
  image upload), order status management, category management.
- **Backend:** JWT authentication, bcrypt password hashing, transactional checkout
  (stock is safely deducted inside a DB transaction), input validation, centralized
  error handling.
- **Database:** normalized MySQL schema with foreign keys, indexes, and a
  full-text search index on products.

## Project structure

```
hasan-jim-ecommerce/
├── server/          Node/Express API
│   ├── config/db.js       MySQL connection pool
│   ├── controllers/       Route logic
│   ├── middleware/        Auth, error handling, file upload
│   ├── routes/            API route definitions
│   ├── schema.sql         Database schema — run this first
│   ├── seed.js            Populates admin user + your 8 sample products
│   └── server.js          App entry point
└── client/          React (Vite) frontend
    └── src/
        ├── pages/          Route-level pages (incl. pages/admin/)
        ├── components/     Reusable UI pieces
        ├── context/        Auth + Cart global state
        └── services/api.js Axios instance
```

## Setup

### 1. Database

Make sure MySQL is running locally, then:

```bash
mysql -u root -p < server/schema.sql
```

This creates the `hasan_jim_shop` database and all tables.

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and set `DB_PASSWORD` to your MySQL password (and `JWT_SECRET` to any
long random string). Then:

```bash
npm run seed   # creates an admin account + your original 8 products
npm run dev    # starts the API on http://localhost:5000
```

Admin login after seeding: **admin@hasanjim.com / Admin@123**

### 3. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev    # starts on http://localhost:5173
```

Vite is already configured to proxy `/api` and `/uploads` requests to the backend,
so the two just work together — no CORS setup needed in development.

### 4. Build for production

```bash
cd client && npm run build     # outputs client/dist — serve as static files
cd server && NODE_ENV=production npm start
```

## Notes for going further

- **Payments:** currently COD / manual transfer only, as requested. To add
  SSLCommerz or Stripe, you'd add a payment controller and swap the checkout
  flow's `payment_method` handling for a real gateway redirect/webhook.
- **Image uploads:** product images can be uploaded as files (stored in
  `server/uploads/`) or set via a direct image URL — the seed data uses Unsplash
  URLs so the shop looks populated immediately.
- **Auth:** basic JWT (register/login). Email verification, password reset, and
  OAuth (Google) can be added later without touching the schema much — everything
  is set up in `authController.js` and `authRoutes.js`.
- **Reviews table** already exists in the schema for whenever you want to add
  product ratings/reviews to the UI.
