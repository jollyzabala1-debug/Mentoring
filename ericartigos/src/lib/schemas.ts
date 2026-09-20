/**
 * Zod validation schemas for Ericartigos
 * Used for form validation and API request validation
 */

import { z } from "zod";
import type { Role } from "@/types";

// ─── Auth Schemas ───────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── User Schemas ───────────────────────────────────────

export const roleSchema = z.enum(["OWNER", "ADMIN", "SUPERVISOR"]);

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
  role: roleSchema,
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

// ─── Menu Item Schemas ──────────────────────────────────

export const createMenuItemSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z.string().optional(),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be greater than 0"),
  categoryId: z
    .string({ required_error: "Category is required" })
    .min(1, "Category is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export type CreateMenuItemFormData = z.infer<typeof createMenuItemSchema>;

export const updateMenuItemSchema = createMenuItemSchema.partial();

export type UpdateMenuItemFormData = z.infer<typeof updateMenuItemSchema>;

// ─── Menu Category Schemas ──────────────────────────────

export const createMenuCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters"),
});

export type CreateMenuCategoryFormData = z.infer<typeof createMenuCategorySchema>;

// ─── Inventory Schemas ──────────────────────────────────

export const stockStatusSchema = z.enum(["GOOD", "LOW", "OUT_OF_STOCK"]);

export const createInventoryItemSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  categoryId: z
    .string({ required_error: "Category is required" })
    .min(1, "Category is required"),
  stock: z
    .number({ required_error: "Stock quantity is required" })
    .nonnegative("Stock must be non-negative"),
  unit: z
    .string({ required_error: "Unit is required" })
    .min(1, "Unit is required"),
  supplier: z
    .string({ required_error: "Supplier is required" })
    .min(1, "Supplier is required"),
  expiryDate: z.coerce.date().optional(),
});

export type CreateInventoryItemFormData = z.infer<typeof createInventoryItemSchema>;

export const updateInventoryItemSchema = createInventoryItemSchema.partial();

export type UpdateInventoryItemFormData = z.infer<typeof updateInventoryItemSchema>;

export const createInventoryCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters"),
});

export type CreateInventoryCategoryFormData = z.infer<typeof createInventoryCategorySchema>;

// ─── Order Schemas ──────────────────────────────────────

export const orderStatusSchema = z.enum([
  "PENDING",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
]);

export const orderItemSchema = z.object({
  menuItemId: z
    .string({ required_error: "Menu item is required" })
    .min(1, "Menu item is required"),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

export const createOrderSchema = z.object({
  tableNumber: z.string().optional(),
  items: z
    .array(orderItemSchema, {
      required_error: "At least one item is required",
    })
    .min(1, "At least one item is required"),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;

// ─── Query Schemas ──────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type DateRangeParams = z.infer<typeof dateRangeSchema>;
