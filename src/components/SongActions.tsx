"use client";

import Link from "next/link";
import { Printer, Edit2, EllipsisVertical, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SongActionsProps {
  songId: number;
  onDelete: () => void;
  className?: string;
}

export function SongActions({ songId, onDelete, className }: SongActionsProps) {
  return (
    <div className={cn("no-print", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Song actions"
            className="transition-colors hover:bg-primary/10 active:bg-primary/20 data-[state=open]:bg-primary/10"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background text-foreground no-print">
          <DropdownMenuItem onSelect={() => window.print()}>
            <Printer />
            Print
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/song/${songId}/edit`}>
              <Edit2 />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
