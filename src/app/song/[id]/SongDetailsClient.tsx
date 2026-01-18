"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Calendar, Clock } from "lucide-react";

import { SongView } from "@/components/SongView";
import { transposeChord } from "@/lib/chord-utils";
import { SongControls } from "@/components/SongControls";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SongActions } from "@/components/SongActions";

// Types
import type { Song } from "@/db/schema";

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
      const response = await fetch(`/api/songs/${song.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="mb-6">
        <Link href="/">
          <div className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 cursor-pointer transition-colors no-print">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Library
          </div>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                {song.title}
              </h1>
              <p className="text-xl md:text-2xl font-medium text-muted-foreground truncate">
                by {song.artist}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground/80">
              {song.language && (
                <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-full capitalize text-xs font-medium">
                  <Globe className="w-3 h-3" />
                  {song.language}
                </div>
              )}
              <span className="hidden sm:inline text-muted-foreground/30">•</span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm">
                <span className="flex items-center gap-1.5" title="Added">
                  <Calendar className="w-3.5 h-3.5" />
                  Added {format(new Date(song.createdAt || Date.now()), 'MMM d, yyyy')}
                </span>
                {song.updatedAt && (
                  <>
                    <span className="hidden sm:inline text-muted-foreground/30">•</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground/80" title="Updated">
                      <Clock className="w-3.5 h-3.5" />
                      Updated {format(new Date(song.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 pt-2 md:pt-0">
            <SongActions
              songId={song.id}
              onDelete={() => setShowDeleteDialog(true)}
            />
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
      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-sm border border-border w-full overflow-hidden min-h-[300px]">
        <SongView
          lines={song.structuredContent}
          transpose={transpose}
        />
      </div>

      {/* Delete Dialog */}
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
