import { db } from "@/db";
import { songs, type Song } from "@/db/schema";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { Music2 } from "lucide-react";
import { SongList } from "@/components/SongList";

export default async function Home() {
  let allSongs: Song[] = [];

  try {
    allSongs = await db.select().from(songs).orderBy(songs.updatedAt);
  } catch (error) {
    console.error('Database connection failed:', error);
    // Return empty array - UI will show "No songs yet" message
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Song Library</h1>
            <p className="text-muted-foreground text-lg">Manage your repertoire and practice sessions.</p>
          </div>
        </div>

        {allSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
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
          <SongList initialSongs={allSongs} />
        )}
      </main>
    </div>
  );
}
