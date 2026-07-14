"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { askAssistant, type ChatMessage } from "@/actions/ai";
import { cn } from "@/lib/utils";

const suggestions = [
  "What's my revenue this month?",
  "How is my profit looking?",
  "Which products are low on stock?",
  "Forecast my next quarter",
];

export function AIChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Nexora co-pilot. Ask me anything about your business — I read your live data in real time.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || thinking) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    const { reply } = await askAssistant(value);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    setThinking(false);
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur">
      <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-soft">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-tight">AI Assistant</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · reads live data
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
          >
            <Avatar className="h-8 w-8 shrink-0">
              {m.role === "assistant" ? (
                <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              ) : (
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              )}
            </Avatar>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "assistant"
                  ? "bg-muted/60 text-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {m.content}
            </div>
          </motion.div>
        ))}

        {thinking && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-500 text-white">
                <Sparkles className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 rounded-2xl bg-muted/60 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about revenue, inventory, customers…"
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="gradient" disabled={thinking || !input.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
