import { pgTable, text, serial, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Structured representation of a song line
export type ChordBlock = {
    chord: string;
    position: number; // 0-based index in the lyrics string where the chord starts
};

export type SongLine = {
    type: 'lyric' | 'heading' | 'empty';
    content: string; // The lyrics text
    chords: ChordBlock[];
};

export const songs = pgTable("songs", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    artist: text("artist").notNull(),
    key: text("key").default('C'),
    detectedKey: text("detected_key"),
    keyConfidence: integer("key_confidence"),
    rawContent: text("raw_content").notNull(), // The original text input
    structuredContent: jsonb("structured_content").$type<SongLine[]>().notNull(), // The parsed JSON
    language: text("language"), // Detected language
    updatedAt: timestamp("updated_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const insertSongSchema = createInsertSchema(songs).pick({
    title: true,
    artist: true,
    key: true,
    rawContent: true
});

export type Song = typeof songs.$inferSelect;
export type InsertSong = z.infer<typeof insertSongSchema>;
