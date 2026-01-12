// Utility for music theory and chord transposition

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Map to normalize chord roots to standard index (0-11)
const NOTE_TO_INDEX: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11
};

export function transposeChord(chord: string, semitones: number): string {
  if (!chord || chord.trim() === '') return chord;

  // Regex to split chord into Root + Suffix (e.g., "C#m7" -> "C#" + "m7")
  // Matches A-G, optional # or b, then the rest
  const match = chord.match(/^([A-G][#b]?)(.*)$/);

  if (!match) return chord; // Return original if not recognized as a chord

  const root = match[1];
  const suffix = match[2];

  const rootIndex = NOTE_TO_INDEX[root];
  if (rootIndex === undefined) return chord;

  // Calculate new index wrapping around 12
  let newIndex = (rootIndex + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  // Decide whether to use Sharps or Flats
  // This is a simplified heuristic. Ideally, we'd know the key signature.
  // For now, if the original used flat, try to stick to flats, else sharps.
  const useFlats = root.includes('b') || (semitones < 0 && !root.includes('#'));

  const scale = useFlats ? NOTES_FLAT : NOTES_SHARP;
  const newRoot = scale[newIndex];

  return newRoot + suffix;
}

export function formatKey(key: string): string {
  if (!key) return 'C';
  return key.charAt(0).toUpperCase() + key.slice(1);
}
