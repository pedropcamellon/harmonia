# Harmonia Copilot Instructions

Next.js 15 App Router, TypeScript, PostgreSQL/Drizzle ORM, Tailwind CSS 4. Chord management/songbook app.

## File Naming

- Utils: kebab-case (`chord-parser.ts`, `key-detection.ts`)
- Components: PascalCase (`SongView.tsx`)
- Prefer enums over booleans (`EditorMode = 'create' | 'edit'`)

## Data Flow

Raw text → `chord-parser.ts` → structured JSON with chord positions → `key-detection.ts` → detected key

## Database

- PostgreSQL with SSL via `prod-ca-2021.crt` in root
- Use `pnpm db:push` / `pnpm db:studio` (uses `NODE_EXTRA_CA_CERTS`)
- Never use `NODE_TLS_REJECT_UNAUTHORIZED=0`
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