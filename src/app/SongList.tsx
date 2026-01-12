"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Song } from "@/db/schema";

interface SongListProps {
  initialSongs: Song[];
}

export function SongList({ initialSongs }: SongListProps) {
  const [search, setSearch] = useState("");

  const filteredSongs = initialSongs.filter(song => 
    song.title.toLowerCase().includes(search.toLowerCase()) || 
    song.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="relative w-full md:w-96 group mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
        <input 
          type="text"
          placeholder="Search songs or artists..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
          <p className="text-muted-foreground">No matches for your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <Link key={song.id} href={`/song/${song.id}`}>
              <div
                className="group cursor-pointer h-full"
              >
                <div className={cn(
                  "h-full p-6 rounded-2xl bg-card border border-border shadow-sm",
                  "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 hover:-translate-y-1",
                  "transition-all duration-300 flex flex-col justify-between"
                )}>
                  <div>
                    <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-muted-foreground font-medium mt-1">{song.artist}</p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                        Key {song.key || "C"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
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
