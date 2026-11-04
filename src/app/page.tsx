import { listSongs } from "@/lib/song-store";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { Music2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongList } from "@/components/SongList";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const allSongs = await listSongs();
  const { q } = await searchParams;
  const search = typeof q === "string" ? q : "";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-5xl">
        <div className="flex items-center justify-between gap-2 mb-3 md:mb-5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">Song Library</h1>
            <p className="hidden md:block text-muted-foreground">Manage your repertoire and practice sessions.</p>
          </div>
          <Button asChild size="sm" className="shrink-0 rounded-full">
            <Link href="/new">
              <Plus className="h-4 w-4" />
              New Song
            </Link>
          </Button>
        </div>

        {allSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/50 rounded-3xl bg-card/50">
            <div className="bg-secondary/50 p-4 rounded-full mb-4">
              <Music2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No songs yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Your library is empty. Add your first song to get started!
            </p>
            <Link href="/new">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                Create Song
              </button>
            </Link>
          </div>
        ) : (
          <SongList initialSongs={allSongs} search={search} />
        )}
      </main>
    </div>
  );
}
