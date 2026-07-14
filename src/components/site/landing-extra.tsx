"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { Play, Check, Loader2, Sparkles, Zap, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { subscribe } from "@/actions/subscribe";
import { Reveal } from "@/components/site/reveal";

function useCountUp(target: number, active: boolean, decimals = 0, duration = 1400) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const display = useCountUp(value, inView, decimals);
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const companies = ["Lumina", "Northpeak", "Craftly", "Vela", "Orbit", "Monogram", "Foundry"];

export function TrustedBy() {
  return (
    <section className="border-y border-border/60 bg-card/30 py-12">
      <div className="container mx-auto">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by 12,000+ modern teams
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {companies.map((c) => (
              <span
                key={c}
                className="text-xl font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const stats = [
  { value: 12000, suffix: "+", label: "Businesses powered" },
  { value: 99.99, suffix: "%", label: "Uptime SLA", decimals: 2 },
  { value: 4.9, suffix: "/5", label: "Average customer rating", decimals: 1 },
  { value: 2.4, suffix: "B+", label: "Decisions automated", decimals: 1 },
];

export function Stats() {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge6 />
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Numbers that speak for themselves
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6 text-center transition-all hover:-translate-y-1 hover:shadow-soft">
                <p className="bg-gradient-to-br from-foreground to-primary bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Badge6() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
      <Sparkles className="h-3.5 w-3.5 text-primary" /> By the numbers
    </span>
  );
}

const highlights = [
  { icon: Zap, text: "Real-time sync across every module" },
  { icon: ShieldCheck, text: "SOC 2-ready security by design" },
  { icon: Globe, text: "Built for global, remote-first teams" },
];

export function DemoModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <div className="relative aspect-video w-full bg-gradient-to-br from-primary/30 via-card to-indigo-500/20">
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-primary shadow-glow">
              <Play className="h-7 w-7 translate-x-0.5 fill-current" />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>See Nexora in action</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-sm text-muted-foreground">
            A 90-second tour of the AI operating system — dashboards, automation, and
            the assistant that runs your business.
          </p>
          <ul className="mt-4 space-y-2">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-2 text-sm">
                <h.icon className="h-4 w-4 text-primary" /> {h.text}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    const fd = new FormData();
    fd.set("email", email);
    const res = await subscribe(fd);
    setStatus(res?.error ? "error" : "done");
  }

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-indigo-500/10 px-8 py-14">
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative mx-auto max-w-xl text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Get product news in your inbox
              </h2>
              <p className="mt-4 text-muted-foreground">
                Monthly insights on running a smarter business with AI. No spam, ever.
              </p>

              {status === "done" ? (
                <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3 text-sm font-medium text-success">
                  <Check className="h-4 w-4" /> You&apos;re subscribed — welcome to Nexora!
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 bg-background/60"
                  />
                  <Button type="submit" variant="gradient" disabled={status === "loading"}>
                    {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                    Subscribe
                  </Button>
                </form>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm text-destructive">Please enter a valid email.</p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
