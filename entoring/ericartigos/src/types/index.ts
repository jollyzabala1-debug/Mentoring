import { Role } from "@prisma/client";

// ── Session / Auth ─────────────────────────────────────────
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ── Cart ───────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

// ── Menu ───────────────────────────────────────────────────
export interface MenuCategoryData {
  id: string;
  name: string;
  createdAt: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  category: MenuCategoryData;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

// ── Orders ─────────────────────────────────────────────────
export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export interface OrderItemData {
  id: string;
  menuItemId: string;
  menuItem: { name: string; imageUrl: string | null };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderData {
  id: string;
  orderNumber: number;
  tableNumber: string | null;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemData[];
  createdAt: string;
  updatedAt: string;
}

// ── Users ──────────────────────────────────────────────────
export type UserStatus = "ACTIVE" | "ARCHIVED";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastActive: string | null;
  createdAt: string;
}

// ── Inventory ──────────────────────────────────────────────
export type StockStatus = "GOOD" | "LOW" | "OUT_OF_STOCK";

export interface InventoryCategoryData {
  id: string;
  name: string;
}

export interface InventoryItemData {
  id: string;
  name: string;
  categoryId: string;
  category: InventoryCategoryData;
  stock: number;
  unit: string;
  supplier: string;
  expiryDate: string | null;
  status: StockStatus;
  updatedAt: string;
  createdAt: string;
}

// ── Reports ────────────────────────────────────────────────
export interface ReportData {
  date: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
}

export interface TopMenuItem {
  id: string;
  name: string;
  imageUrl: string | null;
  totalSold: number;
  totalRevenue: number;
}

// ── API Response ───────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
