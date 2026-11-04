import { notFound } from "next/navigation";
import { getSong } from "@/lib/song-store";
import { Navigation } from "@/components/Navigation";
import { SongEditorForm } from "@/app/new/SongEditorForm";

export default async function EditSongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const song = await getSong(id);

  if (!song) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Edit Song
          </h1>
        </div>

        <SongEditorForm song={song} />
      </main>
    </div>
  );
}
