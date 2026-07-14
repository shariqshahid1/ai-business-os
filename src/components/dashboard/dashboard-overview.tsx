import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  Users,
  Package,
  Clock,
  Plus,
  Send,
  UserPlus,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart, SalesChart, OrdersChart, InventoryChart } from "@/components/dashboard/charts";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardData } from "@/actions/dashboard";

export default function DashboardOverview({
  kpis,
  revenueSeries,
  salesSeries,
  orderStatus,
  inventoryByCategory,
  recentActivity,
  aiInsight,
}: DashboardData) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Business overview</h1>
        <p className="text-sm text-muted-foreground">
          Live performance across sales, inventory, and customers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Today's Sales"
          value={formatCurrency(kpis.todaysSales)}
          delta={kpis.deltas.todaysSales}
          icon={DollarSign}
          accent="success"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(kpis.monthlyRevenue)}
          delta={kpis.deltas.monthlyRevenue}
          icon={TrendingUp}
          accent="primary"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(kpis.profit)}
          delta={kpis.deltas.profit}
          icon={Wallet}
          accent="indigo"
        />
        <StatCard
          label="Orders"
          value={formatNumber(kpis.orders)}
          delta={kpis.deltas.orders}
          icon={ShoppingCart}
          accent="warning"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(kpis.expenses)}
          icon={Wallet}
          accent="destructive"
        />
        <StatCard
          label="Pending Payments"
          value={formatCurrency(kpis.pendingPayments)}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Low Stock Items"
          value={formatNumber(kpis.lowStock)}
          icon={AlertTriangle}
          accent="destructive"
        />
        <StatCard
          label="Employees"
          value={formatNumber(kpis.employees)}
          icon={Users}
          accent="primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Profit</CardTitle>
            <CardDescription>Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueSeries} />
          </CardContent>
        </Card>
        <AIInsightCard
          headline={aiInsight.headline}
          body={aiInsight.body}
          metric={aiInsight.metric}
          trend={aiInsight.trend}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesSeries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersChart data={orderStatus} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryChart data={inventoryByCategory} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest sales, expenses and customers</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity items={recentActivity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump back in</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <Button asChild className="justify-start">
              <Link href="/dashboard/sales">
                <Plus className="mr-2 h-4 w-4" /> New sale
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/dashboard/customers">
                <UserPlus className="mr-2 h-4 w-4" /> Add customer
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/dashboard/inventory">
                <Package className="mr-2 h-4 w-4" /> Manage inventory
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/dashboard/expenses">
                <Send className="mr-2 h-4 w-4" /> Log expense
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/dashboard/ai-assistant">
                <Sparkles className="mr-2 h-4 w-4" /> Ask the assistant
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/dashboard/reports">
                <BarChart3 className="mr-2 h-4 w-4" /> View reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
