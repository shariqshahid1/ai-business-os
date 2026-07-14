"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Boxes,
  Users,
  Receipt,
  Bot,
  ShieldCheck,
  Zap,
  Star,
  Check,
  Quote,
  Gauge,
  Globe,
  Database,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/site/reveal";
import { Logo } from "@/components/site/logo";
import { DemoModal } from "@/components/site/landing-extra";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-40" />
      </div>

      <div className="container mx-auto flex flex-col items-center text-center">
        <Reveal>
          <Link
            href="#ai"
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm shadow-soft backdrop-blur transition-colors hover:border-primary/40"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Powered by AI â€” </span>
            <span className="font-medium">See what&apos;s new</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            The Smart <span className="text-gradient-primary">AI Operating System</span> for
            Modern Businesses
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Unify sales, inventory, customers, and finances in one beautiful workspace.
            Nexora turns your data into decisions with real-time intelligence.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/register">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <DemoModal>
              <Button variant="outline" size="lg">
                <Play className="h-4 w-4" /> Watch demo
              </Button>
            </DemoModal>
            <Button variant="ghost" size="lg" asChild>
              <Link href="#features">Explore platform</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 text-xs text-muted-foreground">
            No credit card required Â· 14-day Pro trial Â· Cancel anytime
          </p>
        </Reveal>

        <Reveal delay={0.25} className="mt-16 w-full">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-indigo-500/20 blur-2xl" />
            <div className="glass-card overflow-hidden rounded-2xl">
              <DashboardPreview />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Logo className="scale-90" showText={false} />
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-destructive/60" />
          <div className="h-3 w-3 rounded-full bg-warning/60" />
          <div className="h-3 w-3 rounded-full bg-success/60" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Revenue", value: "$84.2k", trend: "+12.4%" },
          { label: "Orders", value: "1,204", trend: "+8.1%" },
          { label: "Profit", value: "$31.8k", trend: "+4.6%" },
          { label: "Customers", value: "3,942", trend: "+2.3%" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 bg-background/50 p-3 text-left">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-lg font-bold">{s.value}</p>
            <p className="text-[11px] font-medium text-success">{s.trend}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 h-40 rounded-xl border border-border/60 bg-background/50 p-4">
        <div className="flex h-full items-end gap-1.5">
          {[40, 55, 48, 70, 62, 85, 78, 95, 88, 100, 92, 110].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
              className="flex-1 rounded-t-md bg-gradient-to-t from-primary/40 to-primary"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  { icon: BarChart3, title: "Real-time Analytics", desc: "Live dashboards that update as your business moves. Revenue, profit, and cohorts at a glance." },
  { icon: Boxes, title: "Inventory Intelligence", desc: "Track stock, get low-inventory alerts, and forecast demand with AI-powered insights." },
  { icon: Users, title: "Customer CRM", desc: "Unify every customer interaction. Segments, lifetimes value, and communication in one place." },
  { icon: Receipt, title: "Finance & Expenses", desc: "Invoices, expenses, and profit tracking. Reconcile your books without the spreadsheet chaos." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "Role-based access, JWT sessions, and encrypted credentials. SOC-2 ready by design." },
  { icon: Zap, title: "Automations", desc: "Trigger workflows on every event. From restock to welcome emails â€” let the OS run itself." },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Features</Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything your business needs to run
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A single operating system that replaces a dozen disconnected tools.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                <CardContent className="p-6">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const aiCapabilities = [
  { icon: Gauge, title: "Predictive Forecasting", desc: "Project revenue and demand 90 days out with confidence intervals." },
  { icon: Database, title: "Natural Language Reports", desc: "Ask â€œwhat were my top products last quarter?â€ and get a chart." },
  { icon: Bot, title: "Autonomous Assistant", desc: "Draft emails, summarize performance, and recommend next actions." },
];

export function AISection() {
  return (
    <section id="ai" className="py-24">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Badge className="mb-3 gap-1">
              <Sparkles className="h-3.5 w-3.5" /> AI Built-in
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your business, with an AI co-pilot
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Nexora reads your data continuously and surfaces the next best
              move â€” before you even open a dashboard.
            </p>
            <div className="mt-8 space-y-4">
              {aiCapabilities.map((c) => (
                <div key={c.title} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-soft">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{c.title}</h4>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative">
              <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 to-indigo-500/10 blur-2xl" />
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">AI Insight</p>
                      <p className="text-xs text-muted-foreground">Generated 2m ago</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-medium text-foreground">
                      Revenue is up 12.4% this month. Your top category
                      <span className="text-primary"> Electronics</span> is running low â€”
                      consider restocking before the weekend surge.
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {["Restock 3 SKUs", "Launch loyalty email", "Review ad spend"].map((t) => (
                      <div key={t} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        {t}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const tiers = [
  { name: "Starter", monthly: 0, description: "For solo founders getting organized.", features: ["1 workspace", "Up to 100 products", "Basic dashboard", "Email support"], cta: "Start free", highlight: false },
  { name: "Pro", monthly: 29, description: "For growing teams that need AI & automation.", features: ["Unlimited products", "AI insights & forecasting", "Automations", "Priority support", "Advanced reports"], cta: "Start Pro trial", highlight: true },
  { name: "Enterprise", monthly: 99, description: "For scale-ups with custom needs.", features: ["SSO & SAML", "Dedicated success manager", "Custom roles & permissions", "Audit logs", "99.99% SLA"], cta: "Contact sales", highlight: false },
];

export function Pricing() {
  const [annual, setAnnual] = React.useState(true);

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Pricing</Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple pricing that scales with you
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when your business grows.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/60 p-1 text-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 transition-colors ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Annual <span className="text-xs opacity-80">âˆ’20%</span>
            </button>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => {
            const price = annual ? Math.round(t.monthly * 0.8) : t.monthly;
            return (
              <Reveal key={t.name} delay={i * 0.05}>
                <Card
                  className={`relative h-full ${t.highlight ? "border-primary/50 shadow-glow" : ""}`}
                >
                  {t.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </div>
                  )}
                  <CardContent className="p-7">
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                    <div className="mt-5 flex items-end gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">${price}</span>
                      <span className="mb-1 text-sm text-muted-foreground">/mo</span>
                    </div>
                    <Button
                      variant={t.highlight ? "gradient" : "outline"}
                      className="mt-5 w-full"
                      asChild
                    >
                      <Link href="/register">{t.cta}</Link>
                    </Button>
                    <ul className="mt-6 space-y-3">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Ava Chen", role: "CEO, Lumina Retail", content: "Nexora replaced four tools for us. We closed the month 18% ahead of forecast thanks to the AI insights." },
  { name: "Marcus Reid", role: "Founder, Northpeak", content: "The dashboard is genuinely beautiful. My team actually enjoys checking metrics now â€” that never happened before." },
  { name: "Priya Nair", role: "Ops Lead, Craftly", content: "Inventory alerts alone paid for the year. We haven't stocked out once since switching." },
  { name: "Diego Santos", role: "GM, Vela Foods", content: "Setup took an afternoon. The auth, roles, and reports just worked. It feels like a billion-dollar product." },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Loved by operators</Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Trusted by modern businesses
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <Card className="h-full">
                <CardContent className="p-7">
                  <Quote className="h-7 w-7 text-primary/40" />
                  <p className="mt-3 text-lg leading-relaxed">{t.content}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className="h-3.5 w-3.5 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "Do I need a credit card to start?", a: "No. The Starter plan is free forever and the Pro trial needs no card. You only pay when you upgrade." },
  { q: "Is my data secure?", a: "Yes. We use JWT-based authentication, bcrypt-hashed passwords, and role-based access control. Data is encrypted in transit and at rest." },
  { q: "Can I invite my team?", a: "Absolutely. Pro and Enterprise plans include roles (Owner, Admin, Manager, Staff) and granular permissions." },
  { q: "Does it work on mobile?", a: "The entire interface is fully responsive and designed mobile-first, so you can run your business from anywhere." },
  { q: "How does the AI work?", a: "Nexora analyzes your sales, inventory, and finance data to forecast trends and recommend actions â€” all inside your workspace." },
  { q: "Can I export my data?", a: "Yes. Every module supports CSV export and our API allows programmatic access on higher tiers." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto max-w-3xl">
        <Reveal className="text-center">
          <Badge variant="secondary" className="mb-3">FAQ</Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Questions, answered
          </h2>
        </Reveal>
        <Reveal delay={0.05} className="mt-12">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-indigo-500/10 px-8 py-16 text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                Run your business on autopilot
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Join thousands of operators building smarter companies with Nexora.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="gradient" size="lg" asChild>
                  <Link href="/register">Get started free <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const groups = [
    { title: "Product", items: ["Features", "Pricing", "AI Assistant", "Changelog", "Integrations"] },
    { title: "Company", items: ["About", "Careers", "Blog", "Customers"] },
    { title: "Resources", items: ["Docs", "API", "Status", "Community"] },
    { title: "Legal", items: ["Privacy", "Terms", "Security", "GDPR"] },
  ];
  return (
    <footer className="border-t border-border/60 py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The Smart AI Operating System for Modern Businesses. Run, automate,
              and grow â€” all in one place.
            </p>
            <div className="mt-5 flex gap-2">
              {[Globe, ShieldCheck, Zap].map((I, i) => (
                <div key={i} className="grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground">
                  <I className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm font-semibold">{g.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it}>
                    <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {it}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>Â© {new Date().getFullYear()} Nexora. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" /> All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
