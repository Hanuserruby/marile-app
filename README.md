# 🐟 Marile App

> **Point-of-Sale & Business Management Platform**  
> Fresh marinated fish brand from Semarang, Indonesia — _Ikan Marinasi Khas Nusantara_

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square)
![Recharts](https://img.shields.io/badge/Recharts-3-22B5BF?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-2BAE96?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Routing & Roles](#routing--roles)
- [Pages & Components](#pages--components)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)

---

## Overview

Marile is a full-stack web application serving two purposes:

1. **Public Storefront** — A branded landing page showcasing Marile's marinated fish products, best sellers, location, and contact info.
2. **Internal Operations System** — A role-based POS and management dashboard for admins and cashiers to manage products, process sales, track inventory, and view analytics.

---

## Features

### 🌊 Landing Page (Public)

- Auto-advancing hero carousel with crossfade transitions
- Best-seller product showcase (fetched live from API)
- Full product menu with IDR pricing
- Store location with embedded Google Maps
- WhatsApp & Instagram contact links

### 👑 Admin Panel

- **Dashboard** — Daily revenue/order stats, 12-month revenue chart, top products, recent transactions
- **Products** — Full CRUD with image upload, category filtering (protein, sayur, buah, lainnya)
- **Inventory** — Paginated stock movement log (restock, adjustment, sale, void)
- **History** — Full transaction history with invoice references
- **Export** — Download monthly sales reports as PDF or Excel (.xlsx)
- **Settings** — Update profile (name/username) and change password

### 💰 Cashier POS

- Product catalog with category tabs and stock indicators
- Shopping cart with quantity controls and stock-limit enforcement
- **Cash payment** — Numpad input, automatic change (kembalian) calculation
- **QRIS payment** — QR barcode display for customer scan
- Transaction history scoped to the cashier's own session
- **Settings** — Same profile/password management as admin

---

## Tech Stack

| Layer        | Technology                         |
| ------------ | ---------------------------------- |
| UI Framework | React 18                           |
| Routing      | React Router v6                    |
| Styling      | Tailwind CSS 3 + CSS Modules       |
| HTTP Client  | Axios 1.6 (with interceptors)      |
| Charts       | Recharts 3                         |
| Carousel     | Embla Carousel                     |
| Icons        | Lucide React + React Icons         |
| Build Tool   | Create React App (react-scripts 5) |

---

## Project Structure

```
marile-app/
├── Marile-frontend-main/            # React application
│   ├── public/                      # Static assets (logo, icons)
│   ├── src/
│   │   ├── App.js                   # Root router (all routes defined here)
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance + JWT refresh interceptor
│   │   ├── assets/                  # Hero images (PNG/JPG)
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx      # Admin sidebar + header + export
│   │   │   ├── CashierLayout.jsx    # Cashier sidebar + header
│   │   │   ├── CashierPayment.jsx   # Payment modal (Cash / QRIS)
│   │   │   └── ProtectedRoute.jsx   # Role-based route guard
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Public storefront
│   │   │   ├── Login.jsx            # Authentication form
│   │   │   ├── AdminDashboard.jsx   # Analytics & overview
│   │   │   ├── AdminProducts.jsx    # Product management
│   │   │   ├── AdminInventory.jsx   # Stock log viewer
│   │   │   ├── AdminHistory.jsx     # Transaction history (admin)
│   │   │   ├── AddProductModal.jsx  # Add product form modal
│   │   │   ├── EditProductModal.jsx # Edit product form modal
│   │   │   ├── CashierDashboard.jsx # POS terminal
│   │   │   ├── CashierProduct.jsx   # Product catalog (cashier)
│   │   │   ├── CashierHistory.jsx   # Transaction history (cashier)
│   │   │   └── Settings.jsx         # Profile & password settings
│   │   └── styles/                  # Per-page CSS files
│   ├── package.json
│   └── tailwind.config.js
└── marile-server-main/              # Backend (Git submodule → marile-express-server)
    ├── prisma/
    │   └── schema.prisma            # Database schema (MySQL via Prisma)
    ├── src/
    │   ├── config/                  # Prisma client singleton
    │   ├── controllers/             # Route handlers (auth, products, dashboard, …)
    │   ├── middleware/              # Auth guard, multer upload, error handler
    │   ├── routes/                  # Express routers
    │   ├── services/                # Backup scheduler
    │   ├── utils/
    │   └── seeder.js                # Seeds default admin + cashier accounts
    ├── scripts/
    │   ├── backup.bat               # MySQL backup script (Windows)
    │   └── restore.bat              # MySQL restore script (Windows)
    ├── app.js                       # Express entry point
    └── package.json
```

---

## Getting Started

This project uses a **Git submodule** for the backend. Follow the steps below to set up both the backend server and the frontend.

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v8 or higher
- [Laragon](https://laragon.org) (or any MySQL server) running on port `3306`

---

### Step 1 — Clone with submodules

```bash
git clone --recurse-submodules https://github.com/Hanuserruby/marile-app.git
cd marile-app
```

> If you already cloned without `--recurse-submodules`, run:
>
> ```bash
> git submodule update --init --recursive
> ```

---

### Step 2 — Set up the Backend

```bash
cd marile-server-main
npm install
```

**Create the database**

Open phpMyAdmin at `http://localhost/phpmyadmin` (or any MySQL client) and run:

```sql
CREATE DATABASE marile_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Configure backend environment variables**

Create a `.env` file inside `marile-server-main/`:

```env
PORT=8000
HOST=localhost
NODE_ENV=development
API_URL=/api

DATABASE_URL=mysql://root:@localhost:3306/marile_db
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=marile_db

JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
```

> ⚠️ Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to long, random strings before deploying to production. Never commit `.env` to version control.

**Run Prisma migrations and generate client**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

**Start the backend server**

```bash
npm start
# Server running at http://localhost:8000
```

On first boot, the seeder automatically creates two default accounts:

| Role    | Username | Password   |
| ------- | -------- | ---------- |
| Admin   | `admin`  | `admin123` |
| Cashier | `kasir1` | `kasir123` |

> ⚠️ Change these passwords immediately after first login.

---

### Step 3 — Set up the Frontend

Open a new terminal:

```bash
cd ../Marile-frontend-main
npm install
```

**Configure frontend environment variables**

Create a `.env` file inside `Marile-frontend-main/`:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_BASEURL=http://localhost:8000
```

**Start the frontend**

```bash
npm start
# Runs on http://localhost:3000
```

**Build for production**

```bash
npm run build
```

---

### Step 4 — Open the app

| URL                           | Description              |
| ----------------------------- | ------------------------ |
| `http://localhost:3000`       | Public landing page      |
| `http://localhost:3000/login` | Login (admin or cashier) |
| `http://localhost:8000/api`   | Backend API base         |

---

## Environment Variables

### Backend (`marile-server-main/.env`)

| Variable                 | Description                         | Default                                  |
| ------------------------ | ----------------------------------- | ---------------------------------------- |
| `PORT`                   | Server port                         | `8000`                                   |
| `HOST`                   | Server bind address                 | `localhost`                              |
| `NODE_ENV`               | `development` or `production`       | `development`                            |
| `API_URL`                | API route prefix                    | `/api`                                   |
| `DATABASE_URL`           | Prisma MySQL connection string      | `mysql://root:@localhost:3306/marile_db` |
| `DATABASE_HOST`          | MySQL host (used by backup scripts) | `localhost`                              |
| `DATABASE_PORT`          | MySQL port                          | `3306`                                   |
| `DATABASE_USER`          | MySQL user                          | `root`                                   |
| `DATABASE_PASSWORD`      | MySQL password                      | _(empty)_                                |
| `DATABASE_NAME`          | MySQL database name                 | `marile_db`                              |
| `JWT_ACCESS_SECRET`      | Secret for access tokens            | ⚠️ Set this                              |
| `JWT_REFRESH_SECRET`     | Secret for refresh tokens           | ⚠️ Set this                              |
| `JWT_ACCESS_EXPIRES_IN`  | Access token lifetime               | `15m`                                    |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime              | `7d`                                     |
| `CLIENT_URL`             | Allowed CORS origin (production)    | `http://localhost:3000`                  |

### Frontend (`Marile-frontend-main/.env`)

| Variable                | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `REACT_APP_API_URL`     | Base URL for all authenticated API calls (used by Axios)          |
| `REACT_APP_API_BASEURL` | Server origin for building absolute image URLs (no `/api` suffix) |

---

## Routing & Roles

The app has three access tiers:

| Path                | Component        | Role      | Description               |
| ------------------- | ---------------- | --------- | ------------------------- |
| `/`                 | LandingPage      | Public    | Brand storefront          |
| `/login`            | Login            | Public    | Authentication form       |
| `/admin`            | AdminDashboard   | `admin`   | Sales analytics overview  |
| `/admin/products`   | AdminProducts    | `admin`   | Product CRUD management   |
| `/admin/inventory`  | AdminInventory   | `admin`   | Stock movement log        |
| `/admin/history`    | AdminHistory     | `admin`   | Full transaction history  |
| `/admin/settings`   | Settings         | `admin`   | Profile & password        |
| `/cashier`          | CashierDashboard | `cashier` | POS terminal              |
| `/cashier/products` | CashierProduct   | `cashier` | Read-only product catalog |
| `/cashier/history`  | CashierHistory   | `cashier` | Cashier's own history     |
| `/cashier/settings` | Settings         | `cashier` | Profile & password        |

Protected routes use the `ProtectedRoute` component, which calls `GET /auth/me` on every load to verify the user's role before rendering. If the role doesn't match or the user isn't authenticated, they're redirected to `/login`.

---

## Pages & Components

### `ProtectedRoute`

Wraps all admin and cashier routes. Calls `/auth/me`, checks the returned role against `allowedRole` prop, and either renders children or redirects to `/login`.

### `AdminLayout`

Persistent sidebar with navigation links (Dashboard, Products, Inventory, History, Settings). Includes an export dropdown to download monthly sales reports as PDF or Excel.

### `CashierPayment`

Payment modal triggered from the POS terminal. Handles two flows:

- **Cash** — Numpad for entering amount paid, displays change, validates amount ≥ total, then posts to `/transactions`
- **QRIS** — Shows QR barcode; no manual input needed

### `Settings`

Shared between both roles. Accepts a `role` prop to wrap in the correct layout. Has two tabs: _Profile_ (update name + username) and _Security_ (change password with current password verification).

---

## API Endpoints

All requests use the Axios instance from `src/api/axios.js` with `withCredentials: true`.

### Auth

| Method | Endpoint        | Description                           |
| ------ | --------------- | ------------------------------------- |
| `POST` | `/auth/login`   | Login — sets HTTP-only session cookie |
| `POST` | `/auth/refresh` | Silently refresh expired access token |
| `GET`  | `/auth/me`      | Get current user profile + role       |

### Public

| Method | Endpoint                        | Description                                    |
| ------ | ------------------------------- | ---------------------------------------------- |
| `GET`  | `/public/menu?category=protein` | Menu & best-sellers for landing page (no auth) |

### Products

| Method   | Endpoint        | Description                                 |
| -------- | --------------- | ------------------------------------------- |
| `GET`    | `/products`     | List all products                           |
| `POST`   | `/products`     | Create product (admin, multipart/form-data) |
| `PUT`    | `/products/:id` | Update product (admin)                      |
| `DELETE` | `/products/:id` | Delete product (admin)                      |

### Dashboard

| Method | Endpoint                               | Description                   |
| ------ | -------------------------------------- | ----------------------------- |
| `GET`  | `/dashboard/summary`                   | Daily order count + revenue   |
| `GET`  | `/dashboard/revenue-chart?range=12m`   | 12-month revenue data         |
| `GET`  | `/dashboard/top-products?period=month` | Top products by qty & revenue |
| `GET`  | `/dashboard/snapshot`                  | Recent transactions list      |

### Inventory & Transactions

| Method | Endpoint                             | Description                                                 |
| ------ | ------------------------------------ | ----------------------------------------------------------- |
| `GET`  | `/inventory/logs?type=&page=&limit=` | Paginated stock movement log                                |
| `POST` | `/transactions`                      | Create sale — body: `{ items: [{ productsId, quantity }] }` |

### Users

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| `PUT`  | `/users/:id`          | Update name + username |
| `PUT`  | `/users/:id/password` | Change password        |

### Export

| Method | Endpoint                           | Description                    |
| ------ | ---------------------------------- | ------------------------------ |
| `GET`  | `/export/sales/pdf?period=month`   | Download sales report as PDF   |
| `GET`  | `/export/sales/excel?period=month` | Download sales report as Excel |

---

## Authentication Flow

The app uses **HTTP-only cookie-based JWT authentication**. No tokens are stored in `localStorage`.

```
User submits login form
       ↓
POST /auth/login
       ↓
Server sets HTTP-only cookie (access + refresh tokens)
       ↓
Frontend reads role from response → redirects to /admin or /cashier
       ↓
ProtectedRoute calls GET /auth/me on every protected page load
       ↓
Role matches? → render page   |   Role mismatch? → redirect to /login
```

**Automatic token refresh** — If any API call returns `401`, the Axios interceptor automatically calls `POST /auth/refresh`. If successful, the original request is retried. If refresh also fails, the user is redirected to `/login`. Concurrent `401` errors are queued and resolved together after a single refresh.

---

## License

This project is private. All rights reserved © 2026 Marile, Semarang.

---

_Dibuat dengan ❤ di Semarang_
