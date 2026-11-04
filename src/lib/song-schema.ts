import { z } from "zod";

export type ChordBlock = {
    chord: string;
    position: number;
};

export type SongLine = {
    type: 'lyric' | 'heading' | 'empty';
    content: string;
    chords: ChordBlock[];
};

export type Song = {
    id: number;
    title: string;
    artist: string;
    key: string | null;
    detectedKey: string | null;
    keyConfidence: number | null;
    rawContent: string;
    structuredContent: SongLine[];
    language: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
};

export const insertSongSchema = z.object({
    title: z.string(),
    artist: z.string(),
    key: z.string().optional(),
    rawContent: z.string(),
});

export type InsertSong = z.infer<typeof insertSongSchema>;
