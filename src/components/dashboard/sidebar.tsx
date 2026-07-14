"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users,
  Receipt,
  UserCog,
  BarChart3,
  Bot,
  Settings,
  X,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { label: "Sales", href: "/dashboard/sales", icon: ShoppingCart },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { label: "Employees", href: "/dashboard/employees", icon: UserCog },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" onClick={onClose}>
            <Logo />
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px] transition-transform group-hover:scale-110", active && "text-primary-foreground")} />
                {item.label}
                {item.href === "/dashboard/ai-assistant" && (
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" /> AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 to-indigo-500/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> Upgrade to Pro
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlock AI forecasting & automations.
          </p>
          <Button variant="gradient" size="sm" className="mt-3 w-full" asChild>
            <Link href="/dashboard/settings">Upgrade</Link>
          </Button>
        </div>
      </aside>
    </>
  );
}
