"use client";

import Link from "next/link";
import { Printer, Edit2, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SongActionsProps {
  songId: number;
  onDelete: () => void;
  className?: string;
}

export function SongActions({ songId, onDelete, className }: SongActionsProps) {
  return (
    <div className={cn("flex items-center gap-3 no-print", className)}>
      <Button
        variant="soft"
        onClick={() => window.print()}
        className="shadow-sm"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>

      <Button variant="soft" asChild>
        <Link href={`/song/${songId}/edit`}>
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </Link>
      </Button>

      <Button
        variant="soft-destructive"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Delete</span>
      </Button>
    </div>
  );
}
