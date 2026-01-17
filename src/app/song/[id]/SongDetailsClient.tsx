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
      <div className="mb-8">
        <Link href="/">
          <div className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 cursor-pointer transition-colors no-print">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Library
          </div>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {song.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              <p className="text-xl font-medium">
                by {song.artist}
              </p>
              {song.language && (
                <div className="flex items-center gap-1.5 text-sm bg-secondary px-2.5 py-1 rounded-full capitalize">
                  <Globe className="w-3.5 h-3.5" />
                  {song.language}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Added {format(new Date(song.createdAt || Date.now()), 'MMM d, yyyy')}
              </div>
              {song.updatedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {format(new Date(song.updatedAt), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>

          <SongActions
            songId={song.id}
            onDelete={() => setShowDeleteDialog(true)}
          />
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
