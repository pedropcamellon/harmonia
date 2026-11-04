import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { detectKey } from "@/lib/key-detection";
import { extractChordsFromSong } from "@/lib/chord-parser";
import { parseRawContent } from "@/lib/chord-parser";
import { insertSongSchema } from "@/lib/song-schema";
import { createSong, listSongs } from "@/lib/song-store";

// GET /api/songs - List all songs
export async function GET() {
  try {
    const allSongs = await listSongs();
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
    const chords = extractChordsFromSong(structuredContent);
    const detectedKey = input.key ? input.key : detectKey(chords).key;

    const newSong = await createSong({
      title: input.title,
      artist: input.artist,
      key: detectedKey,
      detectedKey,
      keyConfidence: null,
      rawContent: input.rawContent,
      structuredContent,
      language: null,
    });

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
