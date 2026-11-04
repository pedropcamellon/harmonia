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

Run the production container with persistent storage:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Docker Compose stores songs in the `harmonia_data` named volume. To remove the container and its song data, run `docker compose down --volumes`.

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Remove any manually configured `NODE_ENV` variable; Vercel sets it automatically
4. Deploy

On Vercel, songs are stored in temporary files under `/tmp/harmonia/data/songs/`.
They can disappear at any time and are not shared across function instances or deployments.
This mode is only for temporary personal testing, not a durable song library.
Docker and local development continue to use persistent `data/` storage.
`HARMONIA_DATA_DIR` can override the storage directory in either environment.

### Other Platforms

Ensure your hosting platform supports Node.js 18+ and persistent writable storage at `data/`. The JSON store is intended for a single application instance; use a shared database for multi-instance deployments.

## License

MIT
