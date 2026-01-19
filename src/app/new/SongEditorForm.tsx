"use client";

import { ArrowLeft, Save, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import type { Song } from "@/db/schema";

type EditorMode = 'create' | 'edit';

interface SongEditorFormProps {
  song?: Song;
}

export function SongEditorForm({ song }: SongEditorFormProps) {
  const router = useRouter();
  const editorMode: EditorMode = song ? 'edit' : 'create';

  const [title, setTitle] = useState(song?.title || "");
  const [artist, setArtist] = useState(song?.artist || "");
  const [key, setKey] = useState(song?.key || "C");
  const [rawContent, setRawContent] = useState(song?.rawContent || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }
    if (!artist.trim()) {
      setErrors({ artist: "Artist is required" });
      return;
    }
    if (!rawContent.trim()) {
      setErrors({ rawContent: "Content is required" });
      return;
    }

    setIsSaving(true);

    try {
      const method = editorMode === 'edit' ? "PUT" : "POST";
      const url = editorMode === 'edit' ? `/api/songs/${song.id}` : "/api/songs";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, key, rawContent }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save song");
      }

      const savedSong = await response.json();
      router.push(`/song/${savedSong.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving song:", error);
      setErrors({ submit: error instanceof Error ? error.message : "Failed to save song" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Link href={editorMode === 'edit' ? `/song/${song.id}` : "/"}>
        <div className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 cursor-pointer transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> {editorMode === 'edit' ? "Back to Song" : "Back to Library"}
        </div>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Meta Fields */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="e.g. Wonderwall"
            />
            {errors.title && (
              <p className="text-sm text-destructive font-medium">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider">Artist</label>
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border text-foreground font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="e.g. Oasis"
              />
              {errors.artist && (
                <p className="text-sm text-destructive font-medium">{errors.artist}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider">Key</label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border text-foreground font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="e.g. F#m"
              />
            </div>
          </div>
        </div>

        {/* Help/Info Card */}
        <div className="md:col-span-4">
          <div className="bg-secondary/50 rounded-2xl p-6 border border-border/50 sticky top-24">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Wand2 className="w-5 h-5" />
              <h3 className="font-bold">Format Guide</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-mono bg-background px-1 rounded border border-border h-fit text-xs">Amaj7</span>
                <span>Write chords directly above lyrics.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono bg-background px-1 rounded border border-border h-fit text-xs">[Chorus]</span>
                <span>Use square brackets for section headers.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono bg-background px-1 rounded border border-border h-fit text-xs">Am  G</span>
                <span>Align chords using spaces for best results.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Lyrics & Chords</label>
        <textarea
          value={rawContent}
          onChange={(e) => setRawContent(e.target.value)}
          className="w-full min-h-[400px] px-4 py-4 rounded-2xl bg-card border-2 border-border text-foreground font-mono text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
          placeholder={`[Verse 1]
Em                G
Today is gonna be the day
       D              Em
That they're gonna throw it back to you...`}
        />
        {errors.rawContent && (
          <p className="text-sm text-destructive font-medium">{errors.rawContent}</p>
        )}
      </div>

      {errors.submit && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-xl">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Link href={editorMode === 'edit' ? `/song/${song.id}` : "/"}>
          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {editorMode === 'edit' ? "Update Song" : "Create Song"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
