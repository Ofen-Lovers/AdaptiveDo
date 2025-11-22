"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-surface-container-high rounded-[32px] p-6 text-center border border-outline-variant/50 shadow-sm">
      <h3 className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-4">Focus Timer</h3>
      <div className="text-6xl font-mono font-bold text-primary mb-6 tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "p-4 rounded-full transition-all shadow-md active:scale-95",
            isActive 
              ? "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-highest/80" 
              : "bg-primary text-on-primary hover:bg-primary/90"
          )}
        >
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        <button
          onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
          className="p-4 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-highest/80 transition-all active:scale-95"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}
