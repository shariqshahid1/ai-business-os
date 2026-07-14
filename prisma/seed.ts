import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🌱 Seeding database…");

  const business = await prisma.business.upsert({
    where: { slug: "acme-commerce" },
    update: {},
    create: {
      name: "Acme Commerce",
      slug: "acme-commerce",
      description: "A demo workspace for Nexora",
      industry: "Retail",
    },
  });

  const passwordHash = await bcrypt.hash("Password123", 12);

  const owner = await prisma.user.upsert({
    where: { email: "demo@businessos.ai" },
    update: { passwordHash, businessId: business.id },
    create: {
      email: "demo@businessos.ai",
      name: "Demo Founder",
      passwordHash,
      role: "OWNER",
      businessId: business.id,
      emailVerified: new Date(),
      status: "ACTIVE",
    },
  });

  // Categories
  const categoryNames = ["Electronics", "Apparel", "Home", "Accessories"];
  const categories = [];
  for (const name of categoryNames) {
    const existing = await prisma.category.findFirst({
      where: { businessId: business.id, name },
    });
    const cat =
      existing ??
      (await prisma.category.create({ data: { name, businessId: business.id } }));
    categories.push(cat);
  }

  // Products
  const productDefs = [
    { name: "Wireless Earbuds", sku: "ELEC-001", price: 79.99, cost: 32, stock: 120, cat: 0 },
    { name: "Smart Watch", sku: "ELEC-002", price: 149.0, cost: 70, stock: 8, cat: 0 },
    { name: "Cotton T-Shirt", sku: "APP-001", price: 24.99, cost: 8, stock: 300, cat: 1 },
    { name: "Denim Jacket", sku: "APP-002", price: 89.0, cost: 40, stock: 5, cat: 1 },
    { name: "Ceramic Mug", sku: "HOME-001", price: 14.5, cost: 4, stock: 240, cat: 2 },
    { name: "Desk Lamp", sku: "HOME-002", price: 39.99, cost: 18, stock: 60, cat: 2 },
    { name: "Leather Wallet", sku: "ACC-001", price: 49.0, cost: 20, stock: 90, cat: 3 },
    { name: "Sunglasses", sku: "ACC-002", price: 59.0, cost: 22, stock: 12, cat: 3 },
  ];
  for (const p of productDefs) {
    await prisma.product.upsert({
      where: { businessId_sku: { businessId: business.id, sku: p.sku } },
      update: {},
      create: {
        name: p.name,
        sku: p.sku,
        price: p.price,
        cost: p.cost,
        stock: p.stock,
        lowStockAt: 10,
        categoryId: categories[p.cat].id,
        businessId: business.id,
      },
    });
  }

  // Customers
  const customerNames = ["Olivia Martin", "Liam Johnson", "Emma Davis", "Noah Wilson", "Ava Brown"];
  const customers = [];
  for (const name of customerNames) {
    const c = await prisma.customer.create({
      data: { name, email: `${name.split(" ")[0].toLowerCase()}@example.com`, businessId: business.id },
    });
    customers.push(c);
  }

  // Sales over last 12 months + daily for last 30 days
  const now = new Date();
  const statuses = ["PAID", "PAID", "PAID", "COMPLETED", "SHIPPED", "PENDING", "CANCELLED"];
  let ref = 1000;

  for (let m = 11; m >= 0; m--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const count = rand(20, 45);
    for (let i = 0; i < count; i++) {
      const day = rand(1, 28);
      const created = new Date(monthDate.getFullYear(), monthDate.getMonth(), day, rand(8, 20), rand(0, 59));
      if (created > now) continue;
      const cust = customers[rand(0, customers.length - 1)];
      const status = statuses[rand(0, statuses.length - 1)];
      const total = rand(40, 600) + Math.random();
      await prisma.sale.create({
        data: {
          businessId: business.id,
          customerId: cust.id,
          reference: `ORD-${ref++}`,
          status: status as any,
          total,
          createdAt: created,
          items: {
            create: [
              { name: "Mixed items", quantity: rand(1, 4), price: total },
            ],
          },
        },
      });
    }
  }

  // Extra daily sales for the trailing 30 days (so the trend chart is dense)
  for (let d = 29; d >= 0; d--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d, rand(8, 20));
    const count = rand(1, 5);
    for (let i = 0; i < count; i++) {
      const cust = customers[rand(0, customers.length - 1)];
      const total = rand(30, 400) + Math.random();
      await prisma.sale.create({
        data: {
          businessId: business.id,
          customerId: cust.id,
          reference: `ORD-${ref++}`,
          status: "PAID",
          total,
          createdAt: date,
          items: { create: [{ name: "Daily order", quantity: rand(1, 3), price: total }] },
        },
      });
    }
  }

  // Expenses
  for (let m = 5; m >= 0; m--) {
    const date = new Date(now.getFullYear(), now.getMonth() - m, rand(1, 28));
    const cats = ["RENT", "SALARIES", "MARKETING", "UTILITIES", "SOFTWARE"];
    for (const c of cats) {
      await prisma.expense.create({
        data: {
          businessId: business.id,
          description: `${c.charAt(0) + c.slice(1).toLowerCase()} expense`,
          amount: rand(200, 2000) + Math.random(),
          category: c as any,
          date,
        },
      });
    }
  }

  // Employees
  const employeeDefs = [
    { name: "Jordan Lee", position: "Operations Manager", salary: 72000 },
    { name: "Maya Patel", position: "Sales Lead", salary: 64000 },
    { name: "Chris Evans", position: "Support Specialist", salary: 48000 },
  ];
  for (const e of employeeDefs) {
    await prisma.employee.create({
      data: { ...e, businessId: business.id, email: `${e.name.split(" ")[0].toLowerCase()}@acme.com`, hiredAt: new Date(now.getFullYear() - 1, rand(0, 11), rand(1, 28)) },
    });
  }

  // Notifications
  const notifs = [
    { title: "Low stock alert", message: "Smart Watch is below its threshold." },
    { title: "New sale", message: "Order ORD-1042 was placed for $312.00." },
    { title: "New customer", message: "Olivia Martin was added to your CRM." },
  ];
  for (const n of notifs) {
    await prisma.notification.create({
      data: { ...n, businessId: business.id, userId: owner.id, read: false },
    });
  }

  console.log("✅ Seed complete. Login: demo@businessos.ai / Password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
