"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

import { SongView } from "@/components/SongView";
import { AutoScroll } from "@/components/AutoScroll";
import { transposeChord } from "@/lib/chord-utils";
import { SongControls } from "@/components/SongControls";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SongActions } from "@/components/SongActions";
import { Button } from "@/components/ui/button";
import { deleteSong } from "@/lib/song-api";

// Types
import type { Song } from "@/lib/song-schema";

interface SongDetailsClientProps {
  song: Song;
}

export function SongDetailsClient({ song }: SongDetailsClientProps) {
  const router = useRouter();
  const [transpose, setTranspose] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const currentKey = useMemo(() => {
    if (!song?.key) return "C";
    if (transpose === 0) return song.key;
    return transposeChord(song.key, transpose);
  }, [song?.key, transpose]);

  const handleDelete = async () => {
    try {
      await deleteSong(song.id);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <main className="container mx-auto px-4 pt-3 md:pt-8 pb-24 max-w-4xl">
      {/* Header Section */}
      <div className="mb-3 md:mb-6">
        <div className="mb-2 md:mb-4 flex items-center justify-between gap-2 no-print">
          <Button
          variant="link"
          size="none"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Library
          </Link>
          </Button>
          <SongActions
            songId={song.id}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-2 md:gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <h1 className="text-2xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              {song.title}
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs md:text-sm text-muted-foreground/80">
              <p className="text-base md:text-2xl font-medium text-muted-foreground truncate">
                by {song.artist}
              </p>
              <span className="inline-flex items-center gap-1 whitespace-nowrap" title="Added">
                <Calendar className="w-3.5 h-3.5" />
                Added {format(new Date(song.createdAt || Date.now()), 'MMM d, yyyy')}
              </span>
              {song.updatedAt && (
                <span className="inline-flex items-center gap-1 whitespace-nowrap" title="Updated">
                  <Clock className="w-3.5 h-3.5" />
                  Updated {format(new Date(song.updatedAt), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Song Controls */}
      <SongControls
        transpose={transpose}
        onTransposeChange={setTranspose}
        originalKey={song.key || "C"}
        currentKey={currentKey}
      />

      {/* Song Content */}
      <div className="w-full overflow-hidden min-h-[300px]">
        <SongView
          lines={song.structuredContent}
          transpose={transpose}
        />
      </div>

      {/* Delete Dialog */}
      <AutoScroll key={song.id} />
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete this song?"
        description={`This action cannot be undone. This will permanently delete "${song.title}" from your library.`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </main>
  );
}
