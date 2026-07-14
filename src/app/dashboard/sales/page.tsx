import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusVariant: Record<string, "warning" | "default" | "secondary" | "success" | "destructive"> = {
  PENDING: "warning",
  PAID: "default",
  SHIPPED: "secondary",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export default async function SalesPage() {
  const session = await auth();
  const businessId = session!.user.businessId;

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { customer: true, _count: { select: { items: true } } },
    }),
    prisma.sale.aggregate({ _sum: { total: true }, where: { businessId, status: "PAID" } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="Every order and transaction, in one place."
      />

      {sales.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No sales yet"
          description="Orders you create will appear here with customer, status, and totals."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.reference}</TableCell>
                    <TableCell className="text-muted-foreground">{s.customer?.name ?? "Walk-in"}</TableCell>
                    <TableCell className="text-muted-foreground">{s._count.items}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(s.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[s.status]}>{s.status.charAt(0) + s.status.slice(1).toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(s.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {sales.length > 0 && (
        <div className="flex justify-end">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-sm text-muted-foreground">Total recognized revenue</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(total._sum.total ?? 0)}
              </span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
