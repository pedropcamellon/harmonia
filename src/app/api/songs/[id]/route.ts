import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { detectKey } from "@/lib/key-detection";
import { extractChordsFromSong } from "@/lib/chord-parser";
import { eq } from "drizzle-orm";
import { parseRawContent } from "@/lib/chord-parser";
import { songs } from "@/db/schema";

const updateSongSchema = z.object({
  title: z.string().optional(),
  artist: z.string().optional(),
  key: z.string().optional(),
  rawContent: z.string().optional(),
});

// GET /api/songs/[id] - Get a single song
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const [song] = await db.select().from(songs).where(eq(songs.id, id));

    if (!song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json(
      { error: "Failed to fetch song" },
      { status: 500 }
    );
  }
}

// PUT /api/songs/[id] - Update a song
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    const input = updateSongSchema.parse(body);

    const updateData: any = { updatedAt: new Date() };

    if (input.title) updateData.title = input.title;
    if (input.artist) updateData.artist = input.artist;
    if (input.key) updateData.key = input.key;

    if (input.rawContent) {
      updateData.rawContent = input.rawContent;
      const structuredContent = parseRawContent(input.rawContent);
      updateData.structuredContent = structuredContent;

      if (!input.key) {
        const chords = extractChordsFromSong(structuredContent);
        updateData.key = detectKey(chords).key;
      }
    }

    const [updatedSong] = await db
      .update(songs)
      .set(updateData)
      .where(eq(songs.id, id))
      .returning();

    if (!updatedSong) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    revalidatePath('/');
    revalidatePath(`/song/${id}`);

    return NextResponse.json(updatedSong);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Error updating song:", error);
    return NextResponse.json(
      { error: "Failed to update song" },
      { status: 500 }
    );
  }
}

// DELETE /api/songs/[id] - Delete a song
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    await db.delete(songs).where(eq(songs.id, id));

    revalidatePath('/');

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
}
