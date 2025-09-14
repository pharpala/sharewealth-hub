"use client";

import { useMemo, useState } from "react";
import {
  Home,
  Car,
  Rocket,
  ChevronDown,
  CalendarClock,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";

// --- Helpers ---
function formatCurrency(n: number | string) {
  const num = typeof n === "string" ? Number(n.replace(/[^0-9.]/g, "")) : n;
  if (Number.isNaN(num)) return "";
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function PlanningPage() {
  const [prompt, setPrompt] = useState<"house" | "car" | "explore" | null>(null);
  const [goal, setGoal] = useState<"house" | "purchase" | "explore">("house");
  const [duration, setDuration] = useState("3"); // years
  const [target, setTarget] = useState<string>("");

  const prettyTarget = useMemo(() => (target ? `$ ${formatCurrency(target)}` : ""), [target]);

  const quickPrompts = [
    {
      id: "house" as const,
      label: "I want to buy a house in the next 5 years",
      Icon: Home,
    },
    { id: "car" as const, label: "I want to buy my dream car", Icon: Car },
    {
      id: "explore" as const,
      label: "Show me what's possible in the next 3 years",
      Icon: Rocket,
    },
  ];

  const handleConfirm = () => {
    // In a future step you can route to a results page or open a side panel.
    console.log({ prompt, goal, duration, target: Number(target || 0) });
  };

  return (
    <div className="mt-15 relative min-h-screen w-full overflow-x-hidden bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(147,51,234,0.15),transparent),radial-gradient(900px_500px_at_20%_10%,rgba(59,130,246,0.15),transparent)]">
      {/* Subtle grid background */}
      <Navigation />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06]"
      />

      {/* Content */}
      <main className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 pb-24 pt-14 sm:pt-20">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-balance bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl">
            Choose a goal, a timeframe, and stick to it.
          </h1>
          <div className="flex justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          </div>
        </div>

        {/* Top Prompt Cards */}
        <section className="mt-[2%] grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickPrompts.map(({ id, label, Icon }) => (
            <div key={id} className="group relative">
              {/* Gradient border wrapper */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100",
                  prompt === id
                    ? "from-purple-400 via-pink-400 to-blue-400 opacity-75"
                    : "from-purple-400/50 via-pink-400/50 to-blue-400/50"
                )}
              />
              
              {/* Animated gradient border */}
              <div
                className=""
              >
                <button
                  onClick={() => setPrompt(id)}
                  className={cn(
                    "relative h-full w-full rounded-2xl bg-gradient-to-b p-6 text-left transition-all duration-300",
                    "from-white/8 to-white/2 group-hover:from-white/12 group-hover:to-white/4",
                    "backdrop-blur-sm",
                    prompt === id && "from-white/15 to-white/5 shadow-[0_20px_60px_-12px_rgba(147,51,234,0.4)]"
                  )}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <div className="relative flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                        "bg-gradient-to-br shadow-lg",
                        prompt === id
                          ? "from-purple-500/20 to-blue-500/20 ring-2 ring-white/30 shadow-purple-500/20"
                          : "from-white/10 to-white/5 ring-1 ring-white/20 group-hover:from-purple-500/10 group-hover:to-blue-500/10 group-hover:ring-white/30"
                      )}
                    >
                      <Icon 
                        className={cn(
                          "h-6 w-6 transition-all duration-300",
                          prompt === id 
                            ? "text-white drop-shadow-sm" 
                            : "text-white/80 group-hover:text-white group-hover:scale-110"
                        )} 
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <p className={cn(
                        "font-semibold leading-snug transition-all duration-300",
                        prompt === id 
                          ? "text-white text-base" 
                          : "text-white/90 text-sm group-hover:text-white group-hover:text-base"
                      )}>
                        {label}
                      </p>
                      <div className={cn(
                        "h-0.5 w-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-500",
                        prompt === id ? "w-full" : "group-hover:w-3/4"
                      )} />
                    </div>
                  </div>
                  
                  {/* Click indicator */}
                  <div className={cn(
                    "absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300",
                    "bg-white/10 opacity-0 group-hover:opacity-100",
                    prompt === id && "bg-purple-500/30 opacity-100"
                  )}>
                    <ChevronDown className="h-3 w-3 rotate-[-90deg] text-white/80" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Middle Compact Control Bar */}
        <Card className="mt-[6%] w-full max-w-4xl rounded-2xl border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-30px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
              {/* Goal */}
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-white/60">Goal</label>
                <div className="relative">
                  <Home className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                  <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="Choose a goal" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectGroup>
                        <SelectItem value="house">I want to save for a house</SelectItem>
                        <SelectItem value="purchase">I want to splurge on a big purchase</SelectItem>
                        <SelectItem value="explore">I want to see what's possible</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration */}
              <div className="w-full md:w-48">
                <label className="mb-1.5 block text-xs font-medium text-white/60">Duration</label>
                <div className="relative">
                  <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                  <Select value={String(duration)} onValueChange={setDuration}>
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="10">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Target */}
              <div className="w-full md:w-64">
                <label className="mb-1.5 block text-xs font-medium text-white/60">Target amount</label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Amount ($)"
                    className="pl-10"
                    value={prettyTarget}
                    onChange={(e) => setTarget(e.target.value)}
                    onFocus={(e) => {
                      // strip formatting on focus for easier typing
                      const raw = e.currentTarget.value.replace(/[^0-9]/g, "");
                      setTarget(raw);
                      // place caret at end on next tick
                      requestAnimationFrame(() => {
                        const el = e.currentTarget;
                        el.selectionStart = el.selectionEnd = el.value.length;
                      });
                    }}
                    onBlur={(e) => {
                      setTarget(e.currentTarget.value.replace(/[^0-9]/g, ""));
                    }}
                  />
                </div>
              </div>

              {/* Confirm */}
              <div className="w-full md:w-auto">
                <label className="mb-1.5 block text-xs font-medium text-transparent select-none">confirm</label>
                <Button className="w-full md:w-auto" onClick={handleConfirm}>
                  Confirm
                </Button>
              </div>
            </div>

            <p className="text-xs text-white/60">
              Tip: Set an amount that feels ambitious yet achievable for your timeframe.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
