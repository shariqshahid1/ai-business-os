import { UserCog } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { EmployeeDialog } from "@/components/dashboard/entity-dialogs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

export default async function EmployeesPage() {
  const session = await auth();
  const businessId = session!.user.businessId;

  const employees = await prisma.employee.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Your team and their roles."
        action={<EmployeeDialog />}
      />

      {employees.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No employees yet"
          description="Add team members to manage your organization."
          action={<EmployeeDialog />}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                  <TableHead>Hired</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{initials(e.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{e.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{e.position ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{e.email ?? e.phone ?? "—"}</TableCell>
                    <TableCell className="text-right">{e.salary ? formatCurrency(e.salary) : "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(e.hiredAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
