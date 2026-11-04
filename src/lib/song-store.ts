import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { randomInt } from "node:crypto";
import path from "node:path";
import { del, get, list, put } from "@vercel/blob";

import type { Song } from "@/lib/song-schema";

const useBlobStorage = process.env.VERCEL === "1" || !!process.env.BLOB_READ_WRITE_TOKEN;
const dataDirectory = process.env.HARMONIA_DATA_DIR || path.join(process.cwd(), "data");
const songsDirectory = path.join(dataDirectory, "songs");
const legacySongsFile = path.join(dataDirectory, "songs.json");
let writeQueue = Promise.resolve();
let legacyMigration: Promise<void> | undefined;

function restoreSong(song: Song): Song {
  return {
    ...song,
    createdAt: song.createdAt ? new Date(song.createdAt) : null,
    updatedAt: song.updatedAt ? new Date(song.updatedAt) : null,
  };
}

function parseSong(contents: string): Song {
  return restoreSong(JSON.parse(contents) as Song);
}

function filenamePart(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "untitled";
}

async function writeSong(song: Song): Promise<void> {
  if (useBlobStorage) {
    const entries = await readBlobSongs(`songs/${song.id}/`);
    const pathname = `songs/${song.id}/${filenamePart(song.artist)}-${filenamePart(song.title)}.json`;
    await put(pathname, JSON.stringify(song, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    const oldPaths = entries.filter((entry) => entry.filename !== pathname).map((entry) => entry.filename);
    if (oldPaths.length) await del(oldPaths);
    return;
  }

  await mkdir(songsDirectory, { recursive: true });
  const entries = await readSongFiles();
  const baseName = `${filenamePart(song.artist)}-${filenamePart(song.title)}`;
  let filename = `${baseName}.json`;
  let suffix = song.id;
  while (entries.some((entry) => entry.filename === filename && entry.song.id !== song.id)) {
    filename = `${baseName}-${suffix++}.json`;
  }
  const songFile = path.join(songsDirectory, filename);
  const temporaryFile = `${songFile}.${process.pid}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(song, null, 2), "utf8");
  await rename(temporaryFile, songFile);
  for (const entry of entries) {
    if (entry.song.id === song.id && entry.filename !== filename) {
      await unlink(path.join(songsDirectory, entry.filename));
    }
  }
}

async function migrateLegacySongs(): Promise<void> {
  let contents: string;
  try {
    contents = await readFile(legacySongsFile, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }

  const songs = JSON.parse(contents) as Song[];
  for (const rawSong of songs) {
    const song = restoreSong(rawSong);
    if (!Number.isSafeInteger(song.id) || song.id < 1) {
      throw new Error(`Invalid song ID in legacy store: ${song.id}`);
    }
    await writeSong(song);
  }
  await unlink(legacySongsFile);
}

function ensureLegacySongsMigrated(): Promise<void> {
  if (useBlobStorage) return Promise.resolve();
  legacyMigration ??= migrateLegacySongs().catch((error: unknown) => {
    legacyMigration = undefined;
    throw error;
  });
  return legacyMigration;
}

async function readBlobSongs(prefix = "songs/"): Promise<{ filename: string; song: Song }[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Connect a private Vercel Blob store and set BLOB_READ_WRITE_TOKEN.");
  }

  const entries: { filename: string; song: Song }[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix, cursor });
    const songs = await Promise.all(result.blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .map(async (blob) => {
        const result = await get(blob.pathname, { access: "private", useCache: false });
        if (!result || result.statusCode !== 200) {
          throw new Error(`Failed to read song blob: ${blob.pathname}`);
        }
        return {
          filename: blob.pathname,
          song: parseSong(await new Response(result.stream).text()),
        };
      }));
    entries.push(...songs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return entries;
}

async function readSongFiles(): Promise<{ filename: string; song: Song }[]> {
  if (useBlobStorage) return readBlobSongs();
  let files: string[];
  try {
    files = await readdir(songsDirectory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  return Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (filename) => ({
        filename,
        song: parseSong(await readFile(path.join(songsDirectory, filename), "utf8")),
      }))
  );
}

async function readSongs(): Promise<Song[]> {
  await ensureLegacySongsMigrated();
  return (await readSongFiles()).map((entry) => entry.song);
}

function updateSongs<T>(update: () => Promise<T>): Promise<T> {
  const operation = writeQueue.then(update);
  writeQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

export async function listSongs(): Promise<Song[]> {
  return (await readSongs()).sort(
    (first, second) => (second.updatedAt?.getTime() ?? 0) - (first.updatedAt?.getTime() ?? 0)
  );
}

export async function getSong(id: number): Promise<Song | undefined> {
  await ensureLegacySongsMigrated();
  if (!Number.isSafeInteger(id) || id < 1) return undefined;

  const entries = useBlobStorage ? await readBlobSongs(`songs/${id}/`) : await readSongFiles();
  return entries.find((entry) => entry.song.id === id)?.song;
}

export function createSong(song: Omit<Song, "id" | "createdAt" | "updatedAt">): Promise<Song> {
  return updateSongs(async () => {
    const songs = useBlobStorage ? [] : await readSongs();
    const now = new Date();
    const newSong: Song = {
      ...song,
      id: useBlobStorage
        ? randomInt(1, 2 ** 48 - 1)
        : songs.reduce((largestId, current) => Math.max(largestId, current.id), 0) + 1,
      createdAt: now,
      updatedAt: now,
    };
    await writeSong(newSong);
    return newSong;
  });
}

export function updateSong(id: number, changes: Partial<Song>): Promise<Song | undefined> {
  return updateSongs(async () => {
    const song = await getSong(id);
    if (!song) return undefined;

    const updatedSong = { ...song, ...changes, id, updatedAt: new Date() };
    await writeSong(updatedSong);
    return updatedSong;
  });
}

export function deleteSong(id: number): Promise<boolean> {
  return updateSongs(async () => {
    await ensureLegacySongsMigrated();
    if (!Number.isSafeInteger(id) || id < 1) return false;

    const files = useBlobStorage ? await readBlobSongs(`songs/${id}/`) : await readSongFiles();
    const entries = files.filter((entry) => entry.song.id === id);
    for (const entry of entries) {
      if (useBlobStorage) await del(entry.filename);
      else await unlink(path.join(songsDirectory, entry.filename));
    }
    return entries.length > 0;
  });
}
