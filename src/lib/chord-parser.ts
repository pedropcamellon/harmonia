/**
 * Chord and Lyrics Parser
 * 
 * Parses raw song text into a structured format that separates chords from lyrics.
 * 
 * Algorithm:
 * 
 * 1. Chord Line Detection:
 *    - Uses regex to identify lines that contain chord symbols
 *    - A line is considered a "chord line" if >50% of its tokens match the chord pattern
 *    - Excludes section headers (lines starting with '[' or ending with ':')
 * 
 * 2. Chord Pattern Matching:
 *    - Recognizes: Root notes (A-G), accidentals (#/b), qualities (m/maj/min/dim/aug/sus)
 *    - Supports: Extensions (7, 9, 11, 13), additions (add9, sus4), slash chords (C/G)
 *    - Examples: C, Am7, Dsus4, Gmaj7, F#m, C/G
 * 
 * 3. Content Structuring:
 *    - Merges chord lines with their corresponding lyric lines below
 *    - Preserves exact character positions for chord alignment
 *    - Identifies section headers (e.g., [Verse], [Chorus])
 *    - Maintains empty lines for formatting
 * 
 * 4. Output Format:
 *    Each line becomes a SongLine object with:
 *    - type: 'lyric' | 'heading' | 'empty'
 *    - content: The lyric text or heading
 *    - chords: Array of {chord: string, position: number} for alignment
 * 
 * Example Input:
 * ```
 * [Verse 1]
 * Em                G
 * Today is gonna be the day
 * ```
 * 
 * Example Output:
 * ```
 * [
 *   { type: 'heading', content: '[Verse 1]', chords: [] },
 *   { type: 'lyric', content: 'Today is gonna be the day', 
 *     chords: [{ chord: 'Em', position: 0 }, { chord: 'G', position: 18 }] }
 * ]
 * ```
 */

// Types
import { type SongLine, type ChordBlock } from "@/db/schema";

// Regex for common chords
const chordRegex = /^[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|M)?(?:[0-9]|1[0-3])?(?:(?:add|no|sus)[0-9]+)?(?:[-+][0-9])?(?:\/[A-G](?:#|b)?)?$/;

// Simple parser logic
export function isChordLine(line: string): boolean {
    if (!line.trim()) return false;
    // Common header identifiers or non-chord lines
    if (line.trim().startsWith('[') || line.trim().endsWith(':')) return false;

    const tokens = line.split(/\s+/).filter(t => t);
    if (tokens.length === 0) return false;

    const chordCount = tokens.filter(t => chordRegex.test(t)).length;
    // If more than 50% of tokens look like chords, it's likely a chord line
    return chordCount >= tokens.length / 2;
}

function extractChords(line: string): ChordBlock[] {
    const chords: ChordBlock[] = [];
    const regex = /[^\s]+/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
        chords.push({
            chord: match[0],
            position: match.index
        });
    }
    return chords;
}

export function parseRawContent(raw: string): SongLine[] {
    const lines = raw.split('\n');
    const structured: SongLine[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (isChordLine(line)) {
            const nextLine = lines[i + 1];
            // Check if next line is a lyric line (exists and is NOT a chord line)
            if (nextLine !== undefined && !isChordLine(nextLine) && !nextLine.trim().startsWith('[')) {
                // Merge chord line with next lyric line
                structured.push({
                    type: 'lyric',
                    content: nextLine,
                    chords: extractChords(line)
                });
                i++; // Skip next line since we consumed it
            } else {
                // Chord line with no lyrics underneath (or end of file, or next is another chord line)
                structured.push({
                    type: 'lyric',
                    content: '', // Empty lyrics
                    chords: extractChords(line)
                });
            }
        } else {
            // Not a chord line
            if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                structured.push({ type: 'heading', content: line.trim(), chords: [] });
            } else if (line.trim() === '') {
                structured.push({ type: 'empty', content: '', chords: [] });
            } else {
                structured.push({ type: 'lyric', content: line, chords: [] });
            }
        }
    }
    return structured;
}
