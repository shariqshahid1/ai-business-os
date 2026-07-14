import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExpenseDialog } from "@/components/dashboard/entity-dialogs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ExpensesPage() {
  const session = await auth();
  const businessId = session!.user.businessId;

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where: { businessId },
      orderBy: { date: "desc" },
      take: 50,
    }),
    prisma.expense.aggregate({ _sum: { amount: true }, where: { businessId } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Monitor spend across categories."
        action={<ExpenseDialog />}
      />

      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses recorded"
          description="Track every cost to understand your true margins."
          action={<ExpenseDialog />}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{e.category.charAt(0) + e.category.slice(1).toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(e.date)}</TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      −{formatCurrency(e.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {expenses.length > 0 && (
        <div className="flex justify-end">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-sm text-muted-foreground">Total expenses</span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(total._sum.amount ?? 0)}
              </span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
