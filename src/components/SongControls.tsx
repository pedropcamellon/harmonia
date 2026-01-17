"use client";

import { useState } from "react";
import { Music, ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsSection, SettingsHeader, NumberStepper } from "@/components/settings/settings-ui";

interface SongControlsProps {
  transpose: number;
  onTransposeChange: (value: number) => void;
  originalKey: string;
  currentKey: string;
}

export function SongControls({
  transpose,
  onTransposeChange,
  originalKey,
  currentKey
}: SongControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "bg-card border border-border shadow-md rounded-xl mb-4 overflow-hidden transition-all duration-200 ease-in-out no-print",
      isExpanded ? "shadow-lg ring-1 ring-ring/10" : ""
    )}>
      {/* Header - Summary View (Always Visible) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            {isExpanded ? <Settings2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
          </div>

          <div className="flex flex-col items-start truncate">
            <span className="text-sm font-semibold truncate leading-none mb-1">
              {transpose !== 0 ? `Key: ${currentKey}` : `Key: ${originalKey}`}
            </span>
            <span className="text-xs text-muted-foreground truncate leading-none">
              {transpose !== 0
                ? `Original: ${originalKey} (${transpose > 0 ? '+' : ''}${transpose})`
                : "Original Key"}
            </span>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded Body - Scrollable Settings List */}
      <div className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-in-out",
        isExpanded ? "grid-rows-[1fr] border-t border-border" : "grid-rows-[0fr]"
      )}>
        <div className="overflow-hidden">
          <div className="p-4 space-y-6 bg-muted/10">

            {/* Setting: Key / Transpose */}
            <SettingsSection>
              <SettingsHeader
                title="Transpose"
                icon={<Music className="w-4 h-4" />}
                action={transpose !== 0 && (
                  <button
                    onClick={() => onTransposeChange(0)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Reset
                  </button>
                )}
              />

              <NumberStepper
                value={transpose}
                onValueChange={onTransposeChange}
                formatValue={(v) => v > 0 ? `+${v}` : v.toString()}
                min={-11}
                max={11}
              />
            </SettingsSection>

            {/* Placeholder for Future Settings (e.g. Autoscroll) */}
            {/* 
            <div className="space-y-3 opacity-50 pointer-events-none">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ArrowDownCircle className="w-4 h-4 text-muted-foreground" />
                  Autoscroll
                </label>
                <Switch checked={false} />
              </div>
              <Slider defaultValue={[0]} max={100} step={1} />
            </div> 
            */}

          </div>
        </div>
      </div>
    </div>
  );
}
