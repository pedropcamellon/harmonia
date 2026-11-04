# Harmonia - Chord Management App

A modern chord management and songbook application built with Next.js 15, featuring chord parsing, transposition, and key detection.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Storage:** One local JSON file per song (`data/songs/artist-title.json`)
- **Styling:** Tailwind CSS 4
- **Package Manager:** pnpm

## Features

- 🎵 Chord parsing and visualization
- 🎹 Real-time chord transposition
- 🔑 Automatic key detection
- 📝 Song library management
- 🎨 Modern, responsive UI
- 🖨️ Print-friendly song sheets
- Compact chord/lyric spacing and adjustable autoscroll (10-100 pixels/second)
- Compact mobile song list with inline artist/title information and key badges

On a song page, use the compact bottom-right Autoscroll control to start or pause scrolling.
The minus/plus buttons adjust speed in 5 px/s steps. Print, Edit, and Delete are in the three-dot menu beside Back to Library.
The compact Key button opens transpose controls; song content is displayed without a surrounding card.
Manual wheel/touch scrolling, navigation keys, hiding the tab, or reaching the page bottom pauses it automatically.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd harmonia
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Each song is stored in its own `artist-title.json` file under `data/songs/`. Names are normalized to filesystem-safe slugs; filename collisions receive a numeric suffix. Editing the artist or title renames the file. Existing numeric filenames remain readable. The directory is created automatically, and existing `data/songs.json` data is migrated on first access.

### Docker

Run the development container with hot reload and persistent storage:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Source and public files are bind-mounted, so Next.js watches source edits and hot-reloads automatically. Songs are bind-mounted in the local `data/` directory and survive container recreation or `docker compose down`.

To also rebuild automatically when dependencies or Docker/Next configuration change, run:

```bash
docker compose up --build --watch
```

The Dockerfile's default final target remains the production image; Compose selects the `development` target.

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. In the project's Storage tab, create or connect a **private Vercel Blob store**. Enable its `BLOB_READ_WRITE_TOKEN` environment variable for Production and Preview
4. Remove any manually configured `NODE_ENV` variable; Vercel sets it automatically
5. Redeploy after connecting the store

On Vercel, songs are stored as private JSON blobs at `songs/<id>/artist-title.json`.
The ID directory keeps identically named songs separate and preserves stable links when titles change.
Reads bypass the Blob CDN cache so edits are visible immediately across function instances.
Missing Blob configuration is reported as an error, rather than falling back to temporary storage.
Songs previously saved in `/tmp` cannot be recovered automatically.
Docker and local development use persistent `data/` storage unless `BLOB_READ_WRITE_TOKEN` is set.
`HARMONIA_DATA_DIR` can override the local storage directory. Never expose the Blob token to client code.

### Other Platforms

Ensure your hosting platform supports Node.js 18+ and persistent writable storage at `data/`. The JSON store is intended for a single application instance; use a shared database for multi-instance deployments.

## License

MIT
