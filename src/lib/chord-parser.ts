import { type SongLine, type ChordBlock } from "@/db/schema";

// Regex for common chords
const chordRegex = /^[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|M)?(?:[0-9]|1[0-3])?(?:(?:add|no|sus)[0-9]+)?(?:[-+][0-9])?(?:\/[A-G](?:#|b)?)?$/;

export function detectKey(structured: SongLine[]): string {
    const chordCounts: Record<string, number> = {};
    let firstChord: string | null = null;

    for (const line of structured) {
        for (const cb of line.chords) {
            // Normalize chord for key detection (e.g., Am7 -> Am, G/B -> G)
            const baseChord = cb.chord.split('/')[0].replace(/[0-9]/g, '');
            if (!firstChord) firstChord = baseChord;
            chordCounts[baseChord] = (chordCounts[baseChord] || 0) + 1;
        }
    }

    const sorted = Object.entries(chordCounts).sort((a, b) => b[1] - a[1]);

    // Heuristic: If first chord is among the top 2 most frequent, it's likely the key
    if (firstChord && sorted.length > 0) {
        const topChords = sorted.slice(0, 2).map(e => e[0]);
        if (topChords.includes(firstChord)) return firstChord;
    }

    return sorted.length > 0 ? sorted[0][0] : 'C';
}

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
