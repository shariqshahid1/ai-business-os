import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  categoryId: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be positive"),
  cost: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const expenseSchema = z.object({
  description: z.string().min(2, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  category: z.enum(["RENT", "SALARIES", "MARKETING", "UTILITIES", "SOFTWARE", "TRAVEL", "OTHER"]),
});

export const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  salary: z.coerce.number().min(0).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
