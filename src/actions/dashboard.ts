"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

export type DashboardData = {
  kpis: {
    todaysSales: number;
    monthlyRevenue: number;
    orders: number;
    profit: number;
    expenses: number;
    lowStock: number;
    totalProducts: number;
    employees: number;
    pendingPayments: number;
    deltas: {
      todaysSales: number;
      monthlyRevenue: number;
      orders: number;
      profit: number;
    };
  };
  revenueSeries: { month: string; revenue: number; profit: number }[];
  salesSeries: { day: string; orders: number; sales: number }[];
  orderStatus: { name: string; value: number; fill: string }[];
  inventoryByCategory: { name: string; value: number }[];
  recentActivity: {
    id: string;
    title: string;
    subtitle: string;
    amount?: number;
    time: string;
    type: "sale" | "expense" | "customer" | "system";
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    time: string;
  }[];
  aiInsight: {
    headline: string;
    body: string;
    metric: string;
    trend: "up" | "down" | "neutral";
  };
};

function toNum(d: { toNumber: () => number } | number | null | undefined) {
  if (d == null) return 0;
  if (typeof d === "number") return d;
  return d.toNumber();
}

export async function getDashboardData(): Promise<DashboardData> {
  const session = await auth();
  if (!session?.user?.businessId) {
    throw new Error("Unauthorized");
  }
  const businessId = session.user.businessId;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

  const [
    todaysSalesAgg,
    monthSalesAgg,
    prevMonthSalesAgg,
    ordersCount,
    prevOrdersCount,
    expensesAgg,
    prevExpensesAgg,
    productsForLowStock,
    totalProducts,
    employeesCount,
    pendingAgg,
    todaysOrdersCount,
    prevTodaysOrders,
    sales12,
    expenses12,
    sales30,
    orderStatusGroup,
    categories,
    recentSales,
    recentExpenses,
    recentCustomers,
    notificationsRaw,
  ] = await Promise.all([
    prisma.sale.aggregate({
      _sum: { total: true },
      where: { businessId, createdAt: { gte: startOfDay }, status: "PAID" },
    }),
    prisma.sale.aggregate({
      _sum: { total: true },
      where: { businessId, createdAt: { gte: startOfMonth }, status: "PAID" },
    }),
    prisma.sale.aggregate({
      _sum: { total: true },
      where: {
        businessId,
        createdAt: { gte: startOfPrevMonth, lte: endOfPrevMonth },
        status: "PAID",
      },
    }),
    prisma.sale.count({ where: { businessId } }),
    prisma.sale.count({
      where: { businessId, createdAt: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
    }),
    prisma.expense.aggregate({ _sum: { amount: true }, where: { businessId, date: { gte: startOfMonth } } }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { businessId, date: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
    }),
    prisma.product.findMany({ where: { businessId }, select: { stock: true, lowStockAt: true } }),
    prisma.product.count({ where: { businessId } }),
    prisma.employee.count({ where: { businessId } }),
    prisma.sale.aggregate({
      _sum: { total: true },
      where: { businessId, status: "PENDING" },
    }),
    prisma.sale.count({ where: { businessId, createdAt: { gte: startOfDay } } }),
    prisma.sale.count({
      where: {
        businessId,
        createdAt: { gte: new Date(startOfDay.getTime() - 86400000), lte: startOfDay },
      },
    }),
    prisma.sale.findMany({
      where: { businessId, status: "PAID", createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true, total: true },
    }),
    prisma.expense.findMany({
      where: { businessId, date: { gte: twelveMonthsAgo } },
      select: { date: true, amount: true },
    }),
    prisma.sale.findMany({
      where: { businessId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, total: true },
    }),
    prisma.sale.groupBy({
      by: ["status"],
      where: { businessId },
      _count: { _all: true },
    }),
    prisma.category.findMany({
      where: { businessId },
      include: { products: { select: { price: true, stock: true } } },
    }),
    prisma.sale.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { customer: true },
    }),
    prisma.expense.findMany({ where: { businessId }, orderBy: { date: "desc" }, take: 3 }),
    prisma.customer.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.notification.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const todaysSales = toNum(todaysSalesAgg._sum.total);
  const monthlyRevenue = toNum(monthSalesAgg._sum.total);
  const prevMonthRevenue = toNum(prevMonthSalesAgg._sum.total);
  const monthlyExpenses = toNum(expensesAgg._sum.amount);
  const prevExpenses = toNum(prevExpensesAgg._sum.amount);
  const profit = monthlyRevenue - monthlyExpenses;
  const prevProfit = prevMonthRevenue - prevExpenses;

  const pct = (a: number, b: number) =>
    b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100;

  const kpis = {
    todaysSales,
    monthlyRevenue,
    orders: ordersCount,
    profit,
    expenses: monthlyExpenses,
    lowStock: productsForLowStock.filter((p) => p.stock <= p.lowStockAt).length,
    totalProducts,
    employees: employeesCount,
    pendingPayments: toNum(pendingAgg._sum.total),
    deltas: {
      todaysSales: pct(todaysOrdersCount, prevTodaysOrders),
      monthlyRevenue: pct(monthlyRevenue, prevMonthRevenue),
      orders: pct(ordersCount, prevOrdersCount),
      profit: pct(profit, prevProfit),
    },
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return { label: d.toLocaleString("en-US", { month: "short" }), y: d.getFullYear(), m: d.getMonth() };
  });
  const monthBase = months[0];
  const revenueSeries = months.map((mo) => ({ month: mo.label, revenue: 0, profit: 0 }));
  const monthIndex = (d: Date) =>
    Math.max(0, Math.min(11, (d.getFullYear() - monthBase.y) * 12 + (d.getMonth() - monthBase.m)));

  for (const s of sales12) {
    const i = monthIndex(new Date(s.createdAt));
    revenueSeries[i].revenue += toNum(s.total);
  }
  for (const e of expenses12) {
    const i = monthIndex(new Date(e.date));
    revenueSeries[i].profit -= toNum(e.amount);
  }

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (29 - i));
    return { label: d.toLocaleString("en-US", { day: "numeric", month: "short" }), t: d.getTime() };
  });
  const salesSeries = days.map((d) => ({ day: d.label, orders: 0, sales: 0 }));
  for (const s of sales30) {
    const idx = Math.max(0, Math.min(29, Math.floor((new Date(s.createdAt).getTime() - days[0].t) / 86400000)));
    salesSeries[idx].orders += 1;
    salesSeries[idx].sales += toNum(s.total);
  }

  const statusOrder = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
  const colors = ["#f59e0b", "#6366f1", "#06b6d4", "#10b981", "#ef4444"];
  const statusMap = new Map(orderStatusGroup.map((g) => [g.status, g._count._all]));
  const orderStatus = statusOrder.map((s, i) => ({
    name: s.charAt(0) + s.slice(1).toLowerCase(),
    value: statusMap.get(s) ?? 0,
    fill: colors[i],
  }));

  const inventoryByCategory = categories.map((c) => ({
    name: c.name,
    value: c.products.reduce((acc, p) => acc + toNum(p.price) * p.stock, 0),
  }));

  const recentActivity = [
    ...recentSales.map((s) => ({
      id: s.id,
      title: s.customer?.name ?? "Walk-in customer",
      subtitle: `Order ${s.reference}`,
      amount: toNum(s.total),
      time: s.createdAt.toISOString(),
      type: "sale" as const,
    })),
    ...recentExpenses.map((e) => ({
      id: e.id,
      title: e.description,
      subtitle: e.category,
      amount: -toNum(e.amount),
      time: e.date.toISOString(),
      type: "expense" as const,
    })),
    ...recentCustomers.map((c) => ({
      id: c.id,
      title: `${c.name} added`,
      subtitle: "New customer",
      time: c.createdAt.toISOString(),
      type: "customer" as const,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  const notifications = notificationsRaw.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    read: n.read,
    time: n.createdAt.toISOString(),
  }));

  const topCategory = inventoryByCategory.slice().sort((a, b) => b.value - a.value)[0];
  const revenueTrend = kpis.deltas.monthlyRevenue;
  const aiInsight = {
    headline: revenueTrend >= 0 ? "Revenue is trending upward" : "Revenue needs attention",
    body:
      revenueTrend >= 0
        ? `Monthly revenue is up ${revenueTrend.toFixed(1)}% versus last month. Consider increasing stock in ${topCategory?.name ?? "your top category"} to capture demand.`
        : `Monthly revenue is down ${Math.abs(revenueTrend).toFixed(1)}% versus last month. Review ${kpis.lowStock} low-stock items and re-engage ${ordersCount} recent customers.`,
    metric: formatCurrency(monthlyRevenue),
    trend: (revenueTrend >= 0 ? "up" : "down") as "up" | "down",
  };

  return {
    kpis,
    revenueSeries,
    salesSeries,
    orderStatus,
    inventoryByCategory,
    recentActivity,
    notifications,
    aiInsight,
  };
}
