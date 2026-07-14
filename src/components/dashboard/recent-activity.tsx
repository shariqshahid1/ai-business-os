import { ShoppingCart, Receipt, UserPlus, Sparkles } from "lucide-react";
import { formatCurrency, formatRelative } from "@/lib/utils";

const icons = {
  sale: ShoppingCart,
  expense: Receipt,
  customer: UserPlus,
  system: Sparkles,
};

export function RecentActivity({
  items,
}: {
  items: {
    id: string;
    title: string;
    subtitle: string;
    amount?: number;
    time: string;
    type: "sale" | "expense" | "customer" | "system";
  }[];
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-12 text-center">
        <p className="text-sm font-medium">No activity yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sales and customers will appear here as they happen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = icons[item.type];
        const positive = (item.amount ?? 0) >= 0;
        return (
          <div key={item.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/50">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
            </div>
            <div className="text-right">
              {item.amount !== undefined && (
                <p className={`text-sm font-semibold ${positive ? "text-success" : "text-destructive"}`}>
                  {positive ? "+" : "−"}
                  {formatCurrency(Math.abs(item.amount))}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{formatRelative(item.time)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
