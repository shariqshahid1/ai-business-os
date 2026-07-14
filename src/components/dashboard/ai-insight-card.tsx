import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AIInsightCard({
  headline,
  body,
  metric,
  trend,
}: {
  headline: string;
  body: string;
  metric: string;
  trend: "up" | "down" | "neutral";
}) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-indigo-500/5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
      <CardContent className="relative p-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-soft">
            <Sparkles className="h-4 w-4" />
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">AI Insight</Badge>
          {trend !== "neutral" && (
            <Badge
              variant="secondary"
              className={cn(
                "ml-auto bg-background/60",
                trend === "up" ? "text-success" : "text-destructive",
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {trend === "up" ? "Trending up" : "Trending down"}
            </Badge>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <h3 className="text-lg font-semibold leading-snug">{headline}</h3>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">This month</p>
            <p className="text-xl font-bold">{metric}</p>
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>

        <Button variant="outline" className="mt-4 w-full bg-background/50" asChild>
          <Link href="/dashboard/ai-assistant">
            Ask the assistant <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
