"use client";

import { ChevronDown, Music } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  currentKey,
}: SongControlsProps) {
  return (
    <div className="mb-2 no-print">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="soft" size="sm" aria-label={`Key: ${currentKey}. Open transpose controls`}>
            Key: {currentKey}
            {transpose !== 0 && (
              <span className="text-muted-foreground">
                ({transpose > 0 ? "+" : ""}{transpose})
              </span>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-label="Transpose controls" className="w-64 bg-background text-foreground no-print">
          <SettingsSection>
            <SettingsHeader
              title="Transpose"
              icon={<Music className="h-4 w-4" />}
              action={transpose !== 0 && (
                <button
                  onClick={() => onTransposeChange(0)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            />
            <p className="text-xs text-muted-foreground">Original key: {originalKey}</p>
            <NumberStepper
              value={transpose}
              onValueChange={onTransposeChange}
              formatValue={(value) => value > 0 ? `+${value}` : value.toString()}
              min={-11}
              max={11}
            />
          </SettingsSection>
        </PopoverContent>
      </Popover>
    </div>
  );
}
