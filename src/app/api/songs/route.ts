import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { detectKey } from "@/lib/key-detection";
import { parseRawContent } from "@/lib/chord-parser";
import { songs, insertSongSchema } from "@/db/schema";

// GET /api/songs - List all songs
export async function GET() {
  try {
    const allSongs = await db.select().from(songs).orderBy(songs.updatedAt);
    return NextResponse.json(allSongs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

// POST /api/songs - Create a new song
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = insertSongSchema.parse(body);

    const structuredContent = parseRawContent(input.rawContent);
    const detectedKey = input.key ? input.key : detectKey(structuredContent);

    const [newSong] = await db.insert(songs).values({
      title: input.title,
      artist: input.artist,
      key: detectedKey,
      rawContent: input.rawContent,
      structuredContent,
      updatedAt: new Date(),
    }).returning();

    revalidatePath('/');

    return NextResponse.json(newSong, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating song:", error);
    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    );
  }
}
