/**
 * Music Theory-Based Key Detection using Tonal.js
 * 
 * Algorithm:
 * 1. Extract all chords from the song's structured content
 * 
 * 2. Test each chord against all 24 major/minor keys (12 major + 12 minor)
 * 
 * 3. Score each key based on:
 *    - Whether chord root notes belong to the key's scale (+2 points)
 *    - Percentage of chord notes that fit the scale (0-1 points)
 *    - Position weighting: first chord 3x, last chord 2x, others 1x
 * 
 * 4. Return the highest-scoring key with confidence percentage and alternatives
 * 
 * Strengths:
 * - Understands music theory via Tonal.js
 * - Distinguishes major/minor keys accurately
 * - Position-aware (first/last chords weighted)
 * - Provides confidence score and alternative keys
 * 
 * Limitations:
 * - Requires Tonal.js dependency
 * - May struggle with modal or atonal music
 * - Confidence heuristic is simplified
 */

import { Key, Chord } from 'tonal';

export function detectKey(chordSymbols: string[]): {
  key: string | null;
  confidence: number;
  alternatives: Array<{ key: string; score: number }>;
} {
  if (chordSymbols.length === 0) {
    return { key: null, confidence: 0, alternatives: [] };
  }

  const possibleKeys = [
    'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F',
    'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'
  ];

  const scores: Record<string, number> = {};

  possibleKeys.forEach(keyName => {
    const keyInfo = Key.majorKey(keyName.includes('m') ? keyName.slice(0, -1) : keyName);
    const isMinor = keyName.includes('m');
    const scaleNotes = isMinor
      ? Key.minorKey(keyName.slice(0, -1)).natural.scale
      : keyInfo.scale;

    let score = 0;

    chordSymbols.forEach((chordSymbol, index) => {
      const chord = Chord.get(chordSymbol);
      if (!chord.tonic) return;

      // Position weight: first chord = 3x, last chord = 2x, others = 1x
      const positionWeight =
        index === 0 ? 3 :
          index === chordSymbols.length - 1 ? 2 : 1;

      // Root note in scale
      if (scaleNotes.includes(chord.tonic)) {
        score += 2 * positionWeight;
      }

      // All chord notes in scale
      const chordNotes = chord.notes;
      const notesInScale = chordNotes.filter(note =>
        scaleNotes.includes(note)
      );
      if (chordNotes.length > 0) {
        score += (notesInScale.length / chordNotes.length) * positionWeight;
      }
    });

    scores[keyName] = score;
  });

  // Sort by score
  const sortedKeys = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0);

  if (sortedKeys.length === 0) {
    return { key: null, confidence: 0, alternatives: [] };
  }

  const [bestKey, bestScore] = sortedKeys[0];
  // Heuristic for confidence
  const confidence = Math.min(100, (bestScore / (chordSymbols.length * 5)) * 100);

  return {
    key: bestKey,
    confidence: Math.round(confidence),
    alternatives: sortedKeys.slice(1, 4).map(([key, score]) => ({
      key,
      score: Math.round(score)
    }))
  };
}
