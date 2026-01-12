import { Navigation } from "@/components/Navigation";
import { SongEditorForm } from "./SongEditorForm";

export default function NewSongPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Create New Song
          </h1>
        </div>

        <SongEditorForm />
      </main>
    </div>
  );
}
