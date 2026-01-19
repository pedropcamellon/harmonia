/**
 * Simple Frequency-Based Key Detection
 * 
 * Algorithm:
 * 1. Extract all chords from the song and normalize them:
 *    - Remove slash notation (e.g., G/B → G)
 *    - Strip extensions and numbers (e.g., Am7 → Am, Dsus4 → Dsus)
 * 
 * 2. Count the frequency of each base chord throughout the song
 * 
 * 3. Remember the first chord encountered (songs often start on the tonic)
 * 
 * 4. Determine the key using these heuristics:
 *    - If the first chord is among the top 2 most frequent → return it as the key
 *    - Otherwise → return the most frequent chord
 *    - Fallback → return 'C' if no chords are found
 * 
 * Strengths:
 * - Fast and simple
 * - No external dependencies
 * - Works well for straightforward songs where the tonic is frequently used
 * - First chord heuristic is musically sensible
 * 
 * Limitations:
 * - Purely statistical—doesn't understand music theory
 * - Cannot distinguish between relative major/minor keys (e.g., C major vs A minor)
 * - No confidence scoring
 * - Doesn't consider chord relationships or harmonic function
 * - May fail with modal or jazz progressions
 */

import { type SongLine } from "@/db/schema";

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
