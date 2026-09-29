# Lexal Tech Store

A basic e-commerce site with product listings. Frontend: HTML, CSS, JavaScript (EJS + vanilla JS). Backend: Express.js (Node.js). Database: MySQL (users, products, orders, order_items).

UI combines the two provided templates:
- **Lexal Tech Store desktop**: header + search, category pills, hero “Latest Tech Gadgets”, category cards, Trending Products, trust badges, Ideas for Your Next Upgrade, Exclusive Deals + newsletter, footer.
- **Mobile flows**: product details (color/qty, rating bars, reviews, Write a Review), My Wishlist, My Cart with promo code, Checkout (shipping address + shipping type + order list + voucher), order confirmation + “How is your order?” rating modal.

## Features
- Product listings with search (`?q=`) + category filter, product details page (`/products/:id`)
- Shopping cart (localStorage, qty +/-, promo codes `TECH10`, `WELCOME15`, `SAVE20`)
- Wishlist (localStorage)
- User registration / login (`/register`, `/login`, scrypt password hashing, signed cookie sessions)
- Order processing: authenticated checkout (`POST /api/orders/checkout`) with shipping fees + promo discount, order history (`/orders`, `/orders/:id`)
- REST API: `GET /api/products`, `GET /api/products/:id`, `POST /api/auth/*`, `GET /api/auth/me`, `POST /api/orders/checkout`, `GET /api/orders`

## Quickstart
```bash
npm install
# create DB + tables
mysql -u root -e "CREATE DATABASE IF NOT EXISTS lexal_store"
mysql -u root lexal_store < public/sql/001_create_users.sql
mysql -u root lexal_store < public/sql/002_create_products.sql
mysql -u root lexal_store < public/sql/003_create_orders.sql
# (004 migration runs automatically on boot)
cp .env.example .env
npm run dev   # or npm start
# open http://localhost:3000
```
Products seed automatically on first boot (12 Lexal Tech Store gadgets). Photos live in `public/img/products/*.jpg`, `public/img/hero/hero.jpg`, `public/img/ideas/*.jpg` (royalty-free Unsplash, Pinterest-style — see `public/img/ATTRIBUTION.md`). To use your own Pinterest downloads, replace the JPGs and restart — DB `.svg` URLs auto-migrate to `.jpg`.

