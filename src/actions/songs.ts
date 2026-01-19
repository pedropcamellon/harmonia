"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { detectKey } from "@/lib/key-detection";
import { extractChordsFromSong } from "@/lib/chord-parser";
import { parseRawContent } from "@/lib/chord-parser";
import { songs } from "@/db/schema";

export async function createSong(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const key = formData.get("key") as string;
    const rawContent = formData.get("rawContent") as string;

    const input = { title, artist, key, rawContent };
    const structuredContent = parseRawContent(input.rawContent);
    const chords = extractChordsFromSong(structuredContent);
    const detectedKey = input.key || detectKey(chords).key;

    const [newSong] = await db.insert(songs).values({
      title: input.title,
      artist: input.artist,
      key: detectedKey,
      rawContent: input.rawContent,
      structuredContent,
      updatedAt: new Date(),
    }).returning();

    revalidatePath('/');
    revalidatePath('/new');

    return newSong;
  } catch (error) {
    console.error("Error creating song:", error);
    throw error;
  }
}

export async function updateSong(id: number, data: {
  title?: string;
  artist?: string;
  key?: string;
  rawContent?: string;
}) {
  const updateData: any = { updatedAt: new Date() };

  if (data.title) updateData.title = data.title;
  if (data.artist) updateData.artist = data.artist;
  if (data.key) updateData.key = data.key;

  if (data.rawContent) {
    updateData.rawContent = data.rawContent;
    const structuredContent = parseRawContent(data.rawContent);
    updateData.structuredContent = structuredContent;

    // Auto-detect key if not explicitly provided
    if (!data.key) {
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
    throw new Error("Song not found");
  }

  revalidatePath("/");
  revalidatePath(`/song/${id}`);

  return updatedSong;
}

export async function deleteSong(id: number): Promise<void> {
  await db.delete(songs).where(eq(songs.id, id));
  revalidatePath("/");
}
