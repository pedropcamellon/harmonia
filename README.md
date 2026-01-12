# Harmonia - Chord Management App

A modern chord management and songbook application built with Next.js 15, featuring chord parsing, transposition, and key detection.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
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
- PostgreSQL database
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

3. Set up environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your database connection:

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/harmonia
   ```

4. Push database schema:

   ```bash
   pnpm db:push
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Other Platforms

Ensure your hosting platform supports:

- Node.js 18+
- PostgreSQL database
- Environment variables

## Contributing

Contributions are welcome! Please open issues and pull requests for improvements and bug fixes.

## License

MIT
