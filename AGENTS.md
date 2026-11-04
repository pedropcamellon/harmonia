# Harmonia Agent

Harmonia is a lyrics with chord management app. It helps transpose chords and detect keys.

## Tech Stack

Next.js 15 App Router, TypeScript, JSON file storage, Tailwind CSS 4. Chord management/songbook app.

## File Naming

- Utils: kebab-case (`chord-parser.ts`, `key-detection.ts`)
- Components: PascalCase (`SongView.tsx`)
- Prefer enums over booleans (`EditorMode = 'create' | 'edit'`)

## Data Flow

Raw text → `chord-parser.ts` → structured JSON with chord positions → `key-detection.ts` → detected key

## Storage

- Each song is persisted in `data/songs/artist-title.json` (numeric suffix on collisions); Docker uses a named volume mounted at `/app/data`.
- Vercel uses private Blob storage at `songs/<id>/artist-title.json`, configured with server-only `BLOB_READ_WRITE_TOKEN`.
- Always `revalidatePath()` after mutations

## Patterns

- Server Components for data, Client Components (`"use client"`) for interactions
- API calls in `src/lib/song-api.ts`
- Shadcn/Radix UI with button variants: `soft`, `soft-destructive`, `link`, sizes `none`
- Chord positions are character-based: `position: 18` = 18th character, render with `font-mono` and `left: ${position}ch`

## Refactoring

- Use PowerShell for bulk operations: `Move-Item`, `Remove-Item`, batch renames
- Avoid manual file patching when renaming/moving - use terminal commands
- Example: `Move-Item src/lib/oldName.ts src/lib/new-name.ts` then update imports