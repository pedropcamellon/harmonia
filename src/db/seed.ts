import { db } from './index';
import { songs } from './schema';

async function seed() {
  console.log('Seeding database...');

  // Add sample songs
  const sampleSongs = [
    {
      title: 'Wonderwall',
      artist: 'Oasis',
      key: 'Em',
      rawContent: `[Intro]
Em7  G  Dsus4  A7sus4

[Verse 1]
Em7              G
Today is gonna be the day
         Dsus4                    A7sus4
That they're gonna throw it back to you
Em7              G
By now you should've somehow
  Dsus4                 A7sus4
Realized what you gotta do`,
      structuredContent: [],
    },
  ];

  for (const song of sampleSongs) {
    const structuredContent = [
      { type: 'heading' as const, content: '[Intro]', chords: [] },
      { 
        type: 'lyric' as const, 
        content: '', 
        chords: [
          { chord: 'Em7', position: 0 },
          { chord: 'G', position: 5 },
          { chord: 'Dsus4', position: 8 },
          { chord: 'A7sus4', position: 15 }
        ] 
      },
    ];

    await db.insert(songs).values({
      ...song,
      structuredContent,
    });
  }

  console.log('Seeding completed!');
}

seed()
  .catch((err) => {
    console.error('Seed failed!', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
