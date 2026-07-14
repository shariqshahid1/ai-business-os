import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/logo";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border/60 bg-card/40 p-12 lg:flex">
        <Link href="/">
          <Logo />
        </Link>
        <div className="space-y-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Operating System
            </div>
            <h2 className="max-w-md text-balance text-4xl font-bold leading-tight tracking-tight">
              Run your entire business from one intelligent workspace.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Sales, inventory, customers, and finance — unified with AI that acts on
              your data in real time.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Real-time dashboards & forecasting",
              "Role-based security with JWT sessions",
              "Automations that run your ops",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
           © {new Date().getFullYear()} Nexora. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <Link href="/" className="mb-10 lg:hidden">
          <Logo />
        </Link>
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
