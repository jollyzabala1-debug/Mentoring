/**
 * Shared TypeScript types for Ericartigos Restaurant System
 * These types are derived from Prisma models and used throughout the app
 */

// ─── Enums ──────────────────────────────────────────────

export type Role = "OWNER" | "ADMIN" | "SUPERVISOR";
export type UserStatus = "ACTIVE" | "ARCHIVED";
export type MenuItemStatus = "ACTIVE" | "ARCHIVED";
export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
export type StockStatus = "GOOD" | "LOW" | "OUT_OF_STOCK";

// ─── Database Models ────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  lastActive: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  status: MenuItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemIngredient {
  id: string;
  menuItemId: string;
  inventoryItemId: string;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  tableNumber: string | null;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface InventoryCategory {
  id: string;
  name: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  categoryId: string;
  stock: number;
  unit: string;
  supplier: string;
  expiryDate: Date | null;
  status: StockStatus;
  updatedById: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface DailyReport {
  id: string;
  date: Date;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
  createdAt: Date;
}

// ─── API Response Types ──────────────────────────────────

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ─── Session Types ──────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ─── Form Input Types ────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface CreateMenuItemInput {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
}

export interface UpdateMenuItemInput {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
}

export interface CreateInventoryItemInput {
  name: string;
  categoryId: string;
  stock: number;
  unit: string;
  supplier: string;
  expiryDate?: Date;
}

export interface UpdateInventoryItemInput {
  name?: string;
  stock?: number;
  unit?: string;
  supplier?: string;
  expiryDate?: Date;
  status?: StockStatus;
}

export interface CreateOrderInput {
  tableNumber?: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}
