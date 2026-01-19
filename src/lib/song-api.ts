// Client-side API calls for song operations
import type { Song } from "@/db/schema";

export type CreateSongInput = {
  title: string;
  artist: string;
  key: string;
  rawContent: string;
};

export type UpdateSongInput = Partial<CreateSongInput>;

export async function createSong(input: CreateSongInput): Promise<Song> {
  const response = await fetch("/api/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create song");
  }

  return response.json();
}

export async function updateSong(id: number, input: UpdateSongInput): Promise<Song> {
  const response = await fetch(`/api/songs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update song");
  }

  return response.json();
}

export async function deleteSong(id: number): Promise<void> {
  const response = await fetch(`/api/songs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete song");
  }
}
