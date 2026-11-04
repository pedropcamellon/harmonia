"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Song } from "@/lib/song-schema";

interface SongListProps {
  initialSongs: Song[];
  search?: string;
}

export function SongList({ initialSongs, search = "" }: SongListProps) {
  const filteredSongs = initialSongs.filter(song => 
    song.title.toLowerCase().includes(search.toLowerCase()) || 
    song.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {search && (
        <div className="mb-3 flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>Results for &ldquo;{search}&rdquo;</p>
          <Link href="/" className="shrink-0 underline">Clear search</Link>
        </div>
      )}

      {filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/50 rounded-3xl bg-card/50">
          <p className="text-muted-foreground">No matches for your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {filteredSongs.map((song) => (
            <Link key={song.id} href={`/song/${song.id}`}>
              <div
                className="group cursor-pointer h-full"
              >
                <div className={cn(
                  "h-full px-3 py-3 md:p-5 rounded-xl bg-card border border-border/50 shadow-sm",
                  "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 hover:-translate-y-1",
                  "transition-all duration-300 flex flex-row md:flex-col items-center md:items-stretch justify-between gap-3"
                )}>
                  <div className="min-w-0 flex flex-wrap md:block items-baseline gap-x-2 gap-y-0.5">
                    <h3 className="min-w-0 text-base md:text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {song.title}
                    </h3>
                    <p className="min-w-0 truncate text-sm md:text-base text-muted-foreground font-medium md:mt-1">{song.artist}</p>
                  </div>
                  
                  <div className="shrink-0 md:mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                        Key {song.key || "C"}
                      </span>
                    </div>
                    <span className="hidden md:inline text-xs text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                      View Song →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
