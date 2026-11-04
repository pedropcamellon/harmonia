import { notFound } from "next/navigation";

import { Navigation } from "@/components/Navigation";
import { SongDetailsClient } from "@/components/SongDetailsClient";
import { getSong } from "@/lib/song-store";

export default async function SongDetailsPage({
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
      <div className="no-print">
        <Navigation />
      </div>

      <SongDetailsClient song={song} />
    </div>
  );
}
