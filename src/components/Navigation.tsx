"use client";

import { Music, Search, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Navigation() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg group-hover:bg-accent transition-colors duration-300">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight">Harmonia</span>
        </Link>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label={searchOpen ? "Close search" : "Search songs"}
            aria-expanded={searchOpen}
            aria-controls="library-search"
            onClick={() => setSearchOpen((open) => !open)}
          >
            {searchOpen ? <X /> : <Search />}
          </Button>
          {searchOpen && (
            <form
              id="library-search"
              action="/"
              role="search"
              className="absolute right-0 top-full mt-2 flex w-[min(20rem,calc(100vw-2rem))] gap-1 rounded-xl border border-border/50 bg-card p-2 shadow-lg"
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
            >
              <input
                autoFocus
                type="search"
                name="q"
                aria-label="Search songs or artists"
                placeholder="Search songs or artists..."
                className="min-w-0 flex-1 rounded-md bg-background px-2 py-1 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button type="submit" variant="soft" size="icon" aria-label="Submit search">
                <Search />
              </Button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}