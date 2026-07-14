"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  productSchema,
  customerSchema,
  expenseSchema,
  employeeSchema,
  type ProductInput,
  type CustomerInput,
  type ExpenseInput,
  type EmployeeInput,
} from "@/lib/data-schemas";

async function requireBusiness() {
  const session = await auth();
  if (!session?.user?.businessId) throw new Error("Unauthorized");
  return session.user.businessId;
}

export async function createProduct(values: ProductInput) {
  const parsed = productSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const businessId = await requireBusiness();

  const existing = await prisma.product.findFirst({
    where: { businessId, sku: parsed.data.sku },
  });
  if (existing) return { error: "A product with this SKU already exists" };

  await prisma.product.create({
    data: {
      businessId,
      sku: parsed.data.sku,
      name: parsed.data.name,
      categoryId: parsed.data.categoryId || null,
      price: parsed.data.price,
      cost: parsed.data.cost ?? 0,
      stock: parsed.data.stock,
      lowStockAt: parsed.data.lowStockAt ?? 10,
    },
  });
  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function deleteProduct(id: string) {
  try {
    const businessId = await requireBusiness();
    await prisma.product.deleteMany({ where: { id, businessId } });
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch {
    return { error: "Could not delete product" };
  }
}

export async function updateProduct(id: string, values: ProductInput) {
  const parsed = productSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const businessId = await requireBusiness();

  const existing = await prisma.product.findFirst({
    where: { businessId, sku: parsed.data.sku, NOT: { id } },
  });
  if (existing) return { error: "A product with this SKU already exists" };

  await prisma.product.update({
    where: { id },
    data: {
      sku: parsed.data.sku,
      name: parsed.data.name,
      categoryId: parsed.data.categoryId || null,
      price: parsed.data.price,
      cost: parsed.data.cost ?? 0,
      stock: parsed.data.stock,
      lowStockAt: parsed.data.lowStockAt ?? 10,
    },
  });
  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function createCustomer(values: CustomerInput) {
  const parsed = customerSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const businessId = await requireBusiness();
  await prisma.customer.create({
    data: {
      businessId,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
    },
  });
  revalidatePath("/dashboard/customers");
  return { success: true };
}

export async function createExpense(values: ExpenseInput) {
  const parsed = expenseSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const businessId = await requireBusiness();
  await prisma.expense.create({
    data: {
      businessId,
      description: parsed.data.description,
      amount: parsed.data.amount,
      category: parsed.data.category,
    },
  });
  revalidatePath("/dashboard/expenses");
  return { success: true };
}

export async function createEmployee(values: EmployeeInput) {
  const parsed = employeeSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const businessId = await requireBusiness();
  await prisma.employee.create({
    data: {
      businessId,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      position: parsed.data.position || null,
      salary: parsed.data.salary ?? null,
    },
  });
  revalidatePath("/dashboard/employees");
  return { success: true };
}
