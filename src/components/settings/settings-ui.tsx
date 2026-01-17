"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Only using standard HTML attributes for div
interface SettingsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SettingsSection({ children, className, ...props }: SettingsSectionProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {children}
    </div>
  );
}

interface SettingsHeaderProps {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export function SettingsHeader({ icon, title, action }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium flex items-center gap-2 text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {title}
      </label>
      {action}
    </div>
  );
}

interface NumberStepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export function NumberStepper({
  value,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onValueChange,
  formatValue = (v) => v.toString(),
  className,
}: NumberStepperProps) {
  const handleDecrease = () => {
    const newValue = value - step;
    if (newValue >= min) onValueChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = value + step;
    if (newValue <= max) onValueChange(newValue);
  };

  return (
    <div className={cn("flex items-center gap-3 bg-card rounded-lg border border-border p-1 shadow-sm select-none", className)}>
      <Button
        variant="ghost"
        onClick={handleDecrease}
        disabled={value <= min}
        className="flex-1 h-auto p-2 hover:bg-accent hover:text-accent-foreground active:scale-95 touch-manipulation"
      >
        <Minus className="w-5 h-5" />
      </Button>

      <div className="min-w-[4rem] text-center">
        <div className="text-lg font-bold font-mono leading-none text-foreground">
          {formatValue(value)}
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={handleIncrease}
        disabled={value >= max}
        className="flex-1 h-auto p-2 hover:bg-accent hover:text-accent-foreground active:scale-95 touch-manipulation"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
}
