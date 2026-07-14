import { PageHeader } from "@/components/dashboard/page-header";
import { RevenueChart, InventoryChart, SalesChart } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/actions/dashboard";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function ReportsPage() {
  const data = await getDashboardData();
  const { kpis } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Performance summaries generated from your live data."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Monthly Revenue", value: formatCurrency(kpis.monthlyRevenue) },
          { label: "Monthly Profit", value: formatCurrency(kpis.profit) },
          { label: "Expenses", value: formatCurrency(kpis.expenses) },
          { label: "Orders", value: formatNumber(kpis.orders) },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Revenue & Profit</CardTitle>
          <Badge variant="secondary">12 months</Badge>
        </CardHeader>
        <CardContent>
          <RevenueChart data={data.revenueSeries} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={data.salesSeries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory value by category</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryChart data={data.inventoryByCategory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
