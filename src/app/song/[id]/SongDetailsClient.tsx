"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SongView } from "@/components/SongView";
import { ArrowLeft, Minus, Plus, Music, Globe, Calendar, Clock, Printer, Edit2, Trash2 } from "lucide-react";
import { transposeChord } from "@/lib/chord-utils";
import { format } from "date-fns";
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

          <div className="flex items-center gap-3 no-print">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <Link href={`/song/${song.id}/edit`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors">
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </Link>
            
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-20 z-40 bg-card border border-border shadow-lg shadow-black/5 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm bg-opacity-95 no-print">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
              <Music className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">Original Key: {song.key || "C"}</span>
            </div>
            {transpose !== 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg border border-accent/20">
                <Music className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600">Current Key: {currentKey}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 bg-secondary/30 p-1.5 rounded-xl border border-border/50">
          <span className="text-xs font-bold uppercase text-muted-foreground px-2">Transpose</span>
          <div className="flex items-center bg-card rounded-lg border border-border shadow-sm">
            <button 
              onClick={() => setTranspose(t => t - 1)}
              className="p-2 hover:bg-secondary text-foreground transition-colors rounded-l-lg border-r border-border"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-12 text-center font-mono font-bold text-lg leading-none">
              {transpose > 0 ? `+${transpose}` : transpose}
            </div>
            <button 
              onClick={() => setTranspose(t => t + 1)}
              className="p-2 hover:bg-secondary text-foreground transition-colors rounded-r-lg border-l border-border"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Song Content */}
      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-sm border border-border min-h-[500px]">
        <SongView 
          lines={song.structuredContent} 
          transpose={transpose} 
        />
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Delete this song?</h3>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. This will permanently delete "{song.title}" from your library.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
