"use client";

import { useEffect, useState } from "react";
import { Minus, Pause, Play, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type ScrollMode = "paused" | "playing";

export function AutoScroll() {
  const [mode, setMode] = useState<ScrollMode>("paused");
  const [speed, setSpeed] = useState(30);

  useEffect(() => {
    if (mode !== "playing") return;

    let frame: number;
    let previousTime: number | undefined;
    let position = window.scrollY;
    const pause = () => setMode("paused");
    const onTouchStart = (event: TouchEvent) => {
      if (event.target instanceof Element && event.target.closest('[aria-label="Autoscroll controls"]')) return;
      pause();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(event.key)) {
        pause();
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) pause();
    };
    const scroll = (time: number) => {
      if (previousTime !== undefined) {
        position += speed * Math.min(time - previousTime, 100) / 1000;
        window.scrollTo({ top: position, behavior: "instant" });
      }
      previousTime = time;
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        pause();
        return;
      }
      frame = requestAnimationFrame(scroll);
    };

    frame = requestAnimationFrame(scroll);
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [mode, speed]);

  return (
    <div
      role="group"
      aria-label="Autoscroll controls"
      className="fixed bottom-4 right-3 z-40 flex items-center gap-1 rounded-xl border border-border/50 bg-card p-1 shadow-lg no-print"
    >
      <Button
        variant="soft"
        size="icon"
        aria-label={mode === "playing" ? "Pause autoscroll" : "Start autoscroll"}
        aria-pressed={mode === "playing"}
        onClick={() => setMode(mode === "playing" ? "paused" : "playing")}
      >
        {mode === "playing" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Decrease autoscroll speed"
        disabled={speed <= 10}
        onClick={() => setSpeed((current) => Math.max(10, current - 5))}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span role="status" aria-label="Autoscroll speed" className="min-w-8 text-center text-xs tabular-nums text-muted-foreground">
        {speed}<span className="block text-[10px]">px/s</span>
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Increase autoscroll speed"
        disabled={speed >= 100}
        onClick={() => setSpeed((current) => Math.min(100, current + 5))}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
