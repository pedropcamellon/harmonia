import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { Navigation } from "@/components/Navigation";
import { SongDetailsClient } from "@/components/SongDetailsClient";
import { songs } from "@/db/schema";

export default async function SongDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const [song] = await db.select().from(songs).where(eq(songs.id, id));

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
