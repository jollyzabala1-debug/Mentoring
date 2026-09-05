# 🍽️ Ericartigos Restaurant System — Architecture Blueprint

> **Stack:** TypeScript · Next.js 16 (App Router) · Tailwind CSS · shadcn/ui
> **Backend:** MySQL (Aiven Cloud) · Uploadthing · Vercel

---

## 📌 Table of Contents

1. [System Overview](#1-system-overview)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [Tech Stack & Rationale](#3-tech-stack--rationale)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Application Modules](#6-application-modules)
7. [API Route Architecture](#7-api-route-architecture)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [File Uploads (Uploadthing)](#9-file-uploads-uploadthing)
10. [Deployment Architecture (Vercel)](#10-deployment-architecture-vercel)
11. [Environment Variables](#11-environment-variables)
12. [UI Component Library](#12-ui-component-library)
13. [Development Phases](#13-development-phases)

---

## 1. System Overview

A full-stack, cloud-native **Restaurant Ordering & Management System** with two distinct interfaces:

| Interface | Target Users | Description |
|---|---|---|
| **Customer Web App** | Dine-in / walk-in customers | QR-based menu browsing and ordering |
| **Staff/Admin Dashboard** | Supervisor, Admin, Owner | Order fulfillment, inventory, reports |

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel (CDN + Edge)                  │
│                                                          │
│   ┌──────────────────┐      ┌─────────────────────────┐ │
│   │  Customer Web    │      │  Staff/Admin Dashboard  │ │
│   │  /customer/*     │      │  /dashboard/*           │ │
│   └────────┬─────────┘      └────────────┬────────────┘ │
│            │                             │               │
│            └──────────┬──────────────────┘               │
│                       │ Next.js API Routes                │
│                       │ (/api/*)                          │
│                       │                                   │
│            ┌──────────▼──────────────────┐               │
│            │   Aiven MySQL Cloud DB       │               │
│            └─────────────────────────────┘               │
│                                                          │
│            ┌──────────────────────────────┐              │
│            │   Uploadthing (File Storage) │              │
│            └──────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## 2. User Roles & Permissions

```
Owner
  └── Full access: Dashboard, Orders, Users, Menu, Inventory, Reports
Admin
  └── Dashboard, Users, Menu (no Inventory, limited Reports)
Supervisor
  └── Dashboard, Orders, Users, Menu, Inventory, Reports
Customer
  └── Menu browsing, cart, QR-based order placement (no auth required)
```

### Role Permission Matrix

| Feature | Owner | Admin | Supervisor |
|---|:---:|:---:|:---:|
| Dashboard (full) | ✅ | ✅ | — |
| Dashboard (read) | ✅ | ✅ | ✅ |
| User Management | ✅ | ✅ | — |
| Menu Management | ✅ | ✅ | ✅ |
| Inventory | ✅ | — | ✅ |
| Reports | ✅ | ✅ | ✅ |
| Orders | ✅ | — | ✅ |
| Archive Users | ✅ | ✅ | — |

---

## 3. Tech Stack & Rationale

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router) | SSR + RSC for performance; unified API routes |
| Language | **TypeScript** | Type safety across full stack |
| Styling | **Tailwind CSS** | Utility-first, consistent design tokens |
| Components | **shadcn/ui** | Accessible, customizable Radix-based components |
| Database | **MySQL on Aiven** | Managed cloud MySQL; reliable, scalable, free tier available |
| ORM | **Prisma** | Type-safe DB queries; easy schema migrations |
| Auth | **NextAuth.js v5** | Role-based session management; credential provider |
| File Storage | **Uploadthing** | Simple Next.js-native file uploads for menu images |
| Deployment | **Vercel** | Zero-config Next.js hosting; edge functions |
| State Mgmt | **Zustand** | Lightweight client-side cart and UI state |
| Data Fetching | **TanStack Query v5** | Server-state caching for dashboard data |
| Forms | **React Hook Form + Zod** | Schema-validated forms throughout |
| Charts | **Recharts** | Revenue vs expenses, profit trend, stock distribution |

---

## 4. Project Structure

```
ericartigos/
├── prisma/
│   └── schema.prisma
├── public/
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx            # Role selection + login
│   │   ├── (customer)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                # Landing page
│   │   │   ├── menu/
│   │   │   │   └── page.tsx            # Menu browsing
│   │   │   ├── menu/[itemId]/
│   │   │   │   └── page.tsx            # Item detail
│   │   │   ├── cart/
│   │   │   │   └── page.tsx            # Cart summary
│   │   │   └── checkout/
│   │   │       └── page.tsx            # QR code generation
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Sidebar + role nav
│   │   │   ├── dashboard/page.tsx      # Role-specific dashboard
│   │   │   ├── orders/page.tsx         # All orders
│   │   │   ├── menu/
│   │   │   │   ├── page.tsx            # Menu management grid
│   │   │   │   └── [itemId]/page.tsx   # Edit menu item
│   │   │   ├── users/
│   │   │   │   ├── page.tsx            # User list
│   │   │   │   └── [userId]/page.tsx   # User profile view
│   │   │   ├── inventory/page.tsx      # Inventory monitoring
│   │   │   └── reports/page.tsx        # Sales & profit reports
│   │   └── api/
│   │       ├── auth/[...nextauth]/     # NextAuth handler
│   │       ├── menu/                   # Menu CRUD
│   │       ├── orders/                 # Order management
│   │       ├── users/                  # User management
│   │       ├── inventory/              # Inventory CRUD
│   │       ├── reports/                # Aggregated reports
│   │       └── uploadthing/            # Uploadthing router
│   ├── components/
│   │   ├── ui/                         # shadcn/ui base components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── RoleGuard.tsx
│   │   ├── customer/
│   │   │   ├── MenuGrid.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── QRCodeDisplay.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── ProfitTrendChart.tsx
│   │   │   ├── StockDistributionChart.tsx
│   │   │   ├── InventoryStatusCard.tsx
│   │   │   └── TopSellingTable.tsx
│   │   ├── orders/
│   │   │   ├── OrderTable.tsx
│   │   │   └── OrderStatusBadge.tsx
│   │   ├── users/
│   │   │   ├── UserTable.tsx
│   │   │   └── AddUserDialog.tsx
│   │   ├── menu/
│   │   │   ├── MenuItemCard.tsx
│   │   │   ├── AddMenuItemDialog.tsx
│   │   │   └── MenuCategoryTabs.tsx
│   │   └── inventory/
│   │       ├── InventoryTable.tsx
│   │       └── AddStockDialog.tsx
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── uploadthing.ts              # Uploadthing config
│   │   └── utils.ts                    # cn(), formatCurrency(), etc.
│   ├── hooks/
│   │   ├── useCart.ts                  # Zustand cart store
│   │   ├── useOrders.ts                # TanStack Query order hooks
│   ├── types/
│   │   └── index.ts                    # Shared TypeScript interfaces
│   └── middleware.ts                   # Route protection by role
└── .env.local
```

---

## 5. Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ─── Users ───────────────────────────────────────────────

model User {
  id         String     @id @default(cuid())
  name       String
  email      String     @unique
  password   String                       // bcrypt hashed
  role       Role
  status     UserStatus @default(ACTIVE)
  lastActive DateTime?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  updatedInventory InventoryItem[]
  orders           Order[]
}

enum Role {
  OWNER
  ADMIN
  SUPERVISOR
}

enum UserStatus {
  ACTIVE
  ARCHIVED
}

// ─── Menu ────────────────────────────────────────────────

model MenuCategory {
  id        String     @id @default(cuid())
  name      String                        // "Pasta", "Rice Meals", etc.
  items     MenuItem[]
  createdAt DateTime   @default(now())
}

model MenuItem {
  id           String         @id @default(cuid())
  name         String
  description  String?        @db.Text
  price        Decimal        @db.Decimal(10, 2)
  imageUrl     String?                    // Uploadthing URL
  categoryId   String
  category     MenuCategory   @relation(fields: [categoryId], references: [id])
  status       MenuItemStatus @default(ACTIVE)
  ingredients  MenuItemIngredient[]
  orderItems   OrderItem[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

enum MenuItemStatus {
  ACTIVE
  ARCHIVED
}

model MenuItemIngredient {
  id              String        @id @default(cuid())
  menuItemId      String
  menuItem        MenuItem      @relation(fields: [menuItemId], references: [id])
  inventoryItemId String
  inventoryItem   InventoryItem @relation(fields: [inventoryItemId], references: [id])
  quantity        Decimal       @db.Decimal(10, 3)
  unit            String                  // "g", "ml", "pcs"
}

// ─── Orders ──────────────────────────────────────────────

model Order {
  id          String      @id @default(cuid())
  orderNumber Int         @unique @default(autoincrement())
  tableNumber String?
  status      OrderStatus @default(PENDING)
  source      OrderSource @default(CUSTOMER_QR)
  totalAmount Decimal     @db.Decimal(10, 2)
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  PREPARING
  READY
  COMPLETED
  CANCELLED
}

enum OrderSource {
  CUSTOMER_QR
}

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id])
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  quantity   Int
  unitPrice  Decimal  @db.Decimal(10, 2)
  subtotal   Decimal  @db.Decimal(10, 2)
}

// ─── Inventory ───────────────────────────────────────────

model InventoryCategory {
  id    String          @id @default(cuid())
  name  String                        // "Pasta", "Dairy", "Syrups", etc.
  items InventoryItem[]
}

model InventoryItem {
  id              String            @id @default(cuid())
  name            String
  categoryId      String
  category        InventoryCategory @relation(fields: [categoryId], references: [id])
  stock           Decimal           @db.Decimal(10, 3)
  unit            String                      // "kg", "ml", "pcs", "g"
  supplier        String
  expiryDate      DateTime?
  status          StockStatus       @default(GOOD)
  updatedById     String
  updatedBy       User              @relation(fields: [updatedById], references: [id])
  menuIngredients MenuItemIngredient[]
  updatedAt       DateTime          @updatedAt
  createdAt       DateTime          @default(now())
}

enum StockStatus {
  GOOD
  LOW
  OUT_OF_STOCK
}

// ─── Daily Report Snapshots ──────────────────────────────

model DailyReport {
  id            String   @id @default(cuid())
  date          DateTime @unique @db.Date
  totalRevenue  Decimal  @db.Decimal(10, 2)
  totalExpenses Decimal  @db.Decimal(10, 2)
  netProfit     Decimal  @db.Decimal(10, 2)
  totalOrders   Int
  createdAt     DateTime @default(now())
}
```

---

## 6. Application Modules

### 6.1 Customer Web App

> Entry: Customer scans a QR code tied to their table number → ordering flow begins.

| Route | Screen | Key Features |
|---|---|---|
| `/` | Landing Page | Hero banner, "Order Now" CTA, branding |
| `/menu` | Menu (All Items) | Category filter tabs, item cards, cart badge |
| `/menu?category=pasta` | Menu (filtered) | Same layout filtered by category |
| `/menu/[itemId]` | Item Detail | Photo, description, ingredients, qty selector, add to cart |
| `/cart` (empty) | Cart Empty | Empty state, "Browse Menu" CTA |
| `/cart` (filled) | Cart Filled | Order summary, quantities, subtotal, proceed button |
| `/checkout` | QR Code | Display QR for cashier scan |
| `/checkout/confirm` | Order Confirmed | Order number, success state |

**Customer Flow:**
```
Landing Page
  └──► Menu (All / Category / Promo / Recommendations)
            └──► Item Detail
                      └──► Add to Cart
                                └──► Cart Review
                                          └──► Generate QR
                                                    └──► Cashier Scans → Order Created
```

---

### 6.2 Staff / Admin Dashboard

> Entry: `/login` — Role selection picker → credential login → role-based redirect.

| Route | Roles | Screen | Key Features |
|---|---|---|---|
| `/login` | All | Role Selection + Login | Role picker, email/password |
| `/dashboard` | All Staff | Dashboard | Stats, charts, inventory status, top items, insights |
| `/orders` | Owner, Supervisor | Order Management | Tabbed: All Orders, Daily Sales |
| `/menu` | Owner, Admin, Supervisor | Menu Management | Category tabs, item cards (CRUD + image upload) |
| `/users` | Owner, Admin | User Management | Search, role/status filters, archive/restore |
| `/inventory` | Owner, Supervisor | Inventory Monitoring | Category tabs, ingredient table with stock status |
| `/reports` | Owner, Admin, Supervisor | Reports | Day/Week/Month/Year, charts, top items |

**Dashboard Variants by Role:**

| Role | Dashboard Shows |
|---|---|
| **Admin** | Inventory Status cards, Top Selling Items, Decision Support Insights |
| **Owner** | Full: Inventory Status, Top Selling, Decision Support, Total Ingredient stats, Most Used bar chart, Stock Level Distribution pie chart, Usage Insights, Restocking Recommendations |
| **Supervisor** | Orders summary, daily sales stats |

---

## 7. API Route Architecture

```
# Authentication
POST   /api/auth/[...nextauth]

# Menu
GET    /api/menu                         # List active items (public)
GET    /api/menu?category=:id
GET    /api/menu/:id
POST   /api/menu                         # [Admin, Owner]
PATCH  /api/menu/:id                     # [Admin, Owner, Supervisor]
DELETE /api/menu/:id                     # Archive [Admin, Owner]
GET    /api/menu/categories
POST   /api/menu/categories              # [Admin, Owner]

# Orders
GET    /api/orders                       # With filters: status, date, source
GET    /api/orders/:id
POST   /api/orders                       # Create (QR or POS)
PATCH  /api/orders/:id/status            # PENDING→PREPARING→READY→COMPLETED

# Users
GET    /api/users                        # [Admin, Owner]
GET    /api/users/:id
POST   /api/users                        # [Admin, Owner]
PATCH  /api/users/:id
PATCH  /api/users/:id/archive            # [Admin, Owner]
PATCH  /api/users/:id/restore            # [Admin, Owner]

# Inventory
GET    /api/inventory
GET    /api/inventory?category=:id
POST   /api/inventory                    # [Supervisor, Owner]
PATCH  /api/inventory/:id                # [Supervisor, Owner]
POST   /api/inventory/categories         # [Owner]

# Reports
GET    /api/reports?period=day|week|month|year
GET    /api/reports/top-items?period=:period

# File Uploads
POST   /api/uploadthing
```

---

## 8. Authentication & Authorization

### NextAuth.js v5 Setup

- **Provider:** `CredentialsProvider` (email + bcrypt password)
- **Session Strategy:** `JWT` (stateless, Vercel edge-compatible)
- **Session Payload:**

```ts
interface Session {
  user: {
    id:    string;
    name:  string;
    email: string;
    role:  "OWNER" | "ADMIN" | "SUPERVISOR";
  }
}
```

### Middleware Route Protection

```ts
// src/middleware.ts
// All /dashboard/* routes redirect to /login if unauthenticated.
// After login, each role is redirected to their home route:

const ROLE_HOME = {
  OWNER:      "/dashboard",
  ADMIN:      "/dashboard",
  SUPERVISOR: "/dashboard",
};
```

### Server-Side API Guard

```ts
// Applied in every protected API route handler
const session = await auth();
if (!session || !["ADMIN", "OWNER"].includes(session.user.role)) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

---

## 9. File Uploads (Uploadthing)

Used exclusively for **menu item images**.

```ts
// src/lib/uploadthing.ts
export const ourFileRouter = {
  menuItemImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
};
```

**Upload Flow:**
1. Staff opens Add/Edit Menu Item dialog
2. Image file selected → `useUploadThing("menuItemImage")` hook
3. File uploaded directly to Uploadthing CDN
4. Returned URL saved to `MenuItem.imageUrl` in MySQL via Prisma

---

## 10. Deployment Architecture (Vercel)

```
GitHub (main branch)
       │ push → auto-deploy
       ▼
  Vercel Platform
       ├── Next.js App (Edge Runtime for middleware)
       │     ├── Customer UI  (/)
       │     └── Staff Dashboard (/dashboard/*)
       │
       ├── Serverless API Functions (/api/*)
       │     └── Prisma → Aiven MySQL (SSL)
       │
       └── Static Assets (Vercel Edge CDN)

External Services:
  ├── Aiven MySQL   ─── DATABASE_URL (SSL required)
  └── Uploadthing   ─── UPLOADTHING_SECRET + UPLOADTHING_APP_ID
```

### Vercel Settings

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Build Command | `npx prisma generate && next build` |
| Node.js Version | 20.x |
| Root Directory | `./` |

---

## 11. Environment Variables

```bash
# .env.local

# Aiven MySQL (with SSL)
DATABASE_URL="mysql://user:password@host:port/dbname?ssl-mode=REQUIRED"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key"

# Uploadthing
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

---

## 12. UI Component Library

Built on **shadcn/ui** with a custom dark sidebar theme matching the Figma designs.

| shadcn Component | Used In |
|---|---|
| `Button` | CTAs, form actions, table actions |
| `Dialog` | Add User, Add Menu Item, Add Stock, Add Category |
| `Table` | User Management, Orders, Inventory, Reports Top Items |
| `Tabs` | Menu categories, Report periods (Day/Week/Month/Year), Order views |
| `Badge` | Role tags (Cashier, Admin, Supervisor), Order status, Stock status |
| `Card` | Dashboard stat cards, Inventory status, Menu item cards |
| `Input` | Search bars (users, menu, inventory), form fields |
| `Select` | Role picker on login, category filter dropdowns |
| `Form` | All CRUD forms (React Hook Form + Zod validation) |
| `Avatar` | User profile in sidebar header |
| `DropdownMenu` | Row action menus (view, archive, restore) |
| `Skeleton` | Loading states for tables and charts |
| `Sonner` (Toast) | Success/error notifications |
| `Chart` (Recharts) | Revenue vs Expenses bar, Profit Trend line, Stock pie |

### Design Token Reference

```css
/* Sidebar background  */ hsl(220, 25%, 14%)
/* Primary accent blue */ hsl(217, 91%, 60%)   /* "Add" buttons */
/* Success green       */ hsl(142, 76%, 36%)   /* Active / Good */
/* Warning orange      */ hsl(25,  95%, 53%)   /* Out of Stock  */
/* Danger red          */ hsl(0,   84%, 60%)   /* Low Stock     */
/* Warning yellow      */ hsl(48,  96%, 53%)   /* Low badge     */
/* Admin purple badge  */ hsl(265, 83%, 80%)
/* Supervisor purple   */ hsl(270, 60%, 75%)
```

---

## 13. Development Phases

### Phase 1 — Foundation
- [ ] Init Next.js 16 project (`npx create-next-app@latest`)
- [ ] Configure TypeScript, Tailwind CSS, shadcn/ui
- [ ] Set up Prisma + Aiven MySQL connection + `schema.prisma`
- [ ] Implement NextAuth.js v5 with `CredentialsProvider`
- [ ] Build Role Selection → Login page

### Phase 2 — Customer Web App
- [ ] Landing page with branding and CTA
- [ ] Menu browsing: all items, category filter, promo, recommendations
- [ ] Item detail page with ingredients
- [ ] Cart (Zustand store: add, remove, update quantity)
- [ ] QR code generation on checkout (`qrcode` or `react-qr-code`)
- [ ] Order confirmation screen

### Phase 3 — Staff Dashboard Core
- [ ] Role-aware sidebar layout
- [ ] Dashboard page with role-specific data (Admin vs Owner vs Supervisor)
- [ ] Order management table (All / Daily Sales tabs)

### Phase 4 — Management Features
- [ ] Menu management (CRUD + Uploadthing image upload + ingredient linking)
- [ ] User management (CRUD + archive/restore + role badges)
- [ ] Inventory monitoring (CRUD + category filter + stock status badges)

### Phase 5 — Reports & Analytics
- [ ] Reports page: Revenue vs Expenses bar chart (Recharts)
- [ ] Profit Trend line chart
- [ ] Top Menu Items list
- [ ] Day / Week / Month / Year tab switching
- [ ] Print and CSV export buttons
- [ ] Owner dashboard: Most Used Ingredients, Stock Level Distribution pie

### Phase 6 — Polish & Deployment
- [ ] Mobile responsiveness for all pages
- [ ] Loading skeletons and error boundaries
- [ ] Prisma DB migrations on Aiven MySQL
- [ ] Set all environment variables on Vercel
- [ ] Configure Uploadthing production keys
- [ ] Custom domain + SSL on Vercel

---

*Generated from Figma design exports — Ericartigos Restaurant System*
*Blueprint Version 1.0 — August 2026*
