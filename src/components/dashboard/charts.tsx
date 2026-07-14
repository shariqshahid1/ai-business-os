"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";

const axisStyle = { fontSize: 12, fill: "hsl(var(--muted-foreground))" };

function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-popover px-3 py-2 text-xs shadow-card">
      {label !== undefined && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">
            {formatter ? formatter(p.value, p.name) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: { data: { month: string; revenue: number; profit: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `$${formatNumber(v)}`} />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#rev)" />
        <Area type="monotone" dataKey="profit" name="Profit" stroke="hsl(var(--success))" strokeWidth={2.5} fill="url(#prof)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SalesChart({ data }: { data: { day: string; orders: number; sales: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} interval={4} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
        <Line type="monotone" dataKey="sales" name="Sales" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OrdersChart({ data }: { data: { name: string; value: number; fill: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3} stroke="none">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatNumber(v)} />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InventoryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={50} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `$${formatNumber(v)}`} />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
        <Bar dataKey="value" name="Stock value" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}
