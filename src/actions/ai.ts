"use server";

import { auth } from "@/lib/auth";
import { getDashboardData } from "@/actions/dashboard";
import { formatCurrency, formatNumber } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export async function askAssistant(query: string): Promise<{ reply: string }> {
  const session = await auth();
  if (!session?.user?.businessId) return { reply: "Please sign in to use the assistant." };

  const q = query.toLowerCase();
  const data = await getDashboardData();
  const { kpis } = data;

  const intent = (...words: string[]) => words.some((w) => q.includes(w));

  if (intent("revenue", "sales", "income", "earn")) {
    return {
      reply: `Your monthly revenue is ${formatCurrency(kpis.monthlyRevenue)}, up ${kpis.deltas.monthlyRevenue.toFixed(1)}% versus last month. Today's sales are ${formatCurrency(kpis.todaysSales)}. Want a 12-month breakdown?`,
    };
  }
  if (intent("profit", "margin")) {
    return {
      reply: `This month's profit is ${formatCurrency(kpis.profit)} against ${formatCurrency(kpis.expenses)} in expenses — a healthy spread. Profit is ${kpis.deltas.profit >= 0 ? "up" : "down"} ${Math.abs(kpis.deltas.profit).toFixed(1)}% vs last month.`,
    };
  }
  if (intent("inventory", "stock", "product")) {
    return {
      reply: `You track ${formatNumber(kpis.totalProducts)} products, with ${formatNumber(kpis.lowStock)} currently at or below their low-stock threshold. I'd prioritize restocking those to avoid missed sales.`,
    };
  }
  if (intent("customer")) {
    return {
      reply: `You have a growing customer base. Recent activity shows steady orders — consider a loyalty email to your top buyers to lift repeat purchases.`,
    };
  }
  if (intent("expense", "spend", "cost")) {
    return {
      reply: `Your expenses this month total ${formatCurrency(kpis.expenses)}. Reviewing the largest categories could surface quick savings.`,
    };
  }
  if (intent("forecast", "predict", "next", "future")) {
    return {
      reply: `Based on the last 12 months, revenue is ${kpis.deltas.monthlyRevenue >= 0 ? "trending up" : "cooling off"}. I'd plan inventory for a ${Math.abs(kpis.deltas.monthlyRevenue).toFixed(0)}% move and pre-stock your top category.`,
    };
  }
  if (intent("hello", "hi", "hey", "help")) {
    return {
      reply: `Hi! I'm your Nexora co-pilot. Ask me about revenue, profit, inventory, customers, expenses, or a forecast — and I'll read your live data.`,
    };
  }

  return {
    reply: `Here's your snapshot: revenue ${formatCurrency(kpis.monthlyRevenue)} (${kpis.deltas.monthlyRevenue.toFixed(1)}%), profit ${formatCurrency(kpis.profit)}, ${formatNumber(kpis.orders)} orders, and ${formatNumber(kpis.lowStock)} low-stock items. Ask me about any of these in more detail.`,
  };
}
