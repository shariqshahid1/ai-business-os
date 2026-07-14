import { Boxes } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ProductDialog, InventoryActions } from "@/components/dashboard/entity-dialogs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, formatNumber } from "@/lib/utils";

const categoryList = (cs: { id: string; name: string }[]) => cs.map((c) => ({ id: c.id, name: c.name }));

export default async function InventoryPage() {
  const session = await auth();
  const businessId = session!.user.businessId;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { businessId }, orderBy: { name: "asc" } }),
  ]);

  const cats = categoryList(categories);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track stock, pricing, and low-inventory alerts."
        action={<ProductDialog categories={cats} />}
      />

      {products.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No products yet"
          description="Add your first product to start tracking inventory and stock value."
          action={<ProductDialog categories={cats} />}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => {
                  const low = p.stock <= (p.lowStockAt ?? 0);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                      <TableCell className="text-muted-foreground">{p.category?.name ?? "—"}</TableCell>
                      <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
                      <TableCell className="text-right">{formatNumber(p.stock)}</TableCell>
                      <TableCell>
                        {low ? (
                          <Badge variant="warning">Low stock</Badge>
                        ) : (
                          <Badge variant="success">In stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <InventoryActions
                          product={{
                            id: p.id,
                            name: p.name,
                            sku: p.sku,
                            price: Number(p.price),
                            cost: p.cost == null ? null : Number(p.cost),
                            stock: p.stock,
                            lowStockAt: p.lowStockAt,
                            categoryId: p.categoryId,
                          }}
                          categories={cats}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
