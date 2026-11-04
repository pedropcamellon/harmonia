"use client";

import { useMemo } from 'react';
import { type SongLine } from '@/lib/song-schema';
import { transposeChord } from '@/lib/chord-utils';
import { cn } from '@/lib/utils';

interface SongViewProps {
  lines: SongLine[];
  transpose: number;
  className?: string;
}

export function SongView({ lines, transpose, className }: SongViewProps) {
  return (
    <div className={cn("space-y-1 font-mono text-sm md:text-lg w-full", className)}>
      {lines.map((line, lineIndex) => (
        <LineRenderer 
          key={lineIndex} 
          line={line} 
          transpose={transpose} 
          index={lineIndex}
        />
      ))}
    </div>
  );
}

function LineRenderer({ line, transpose, index }: { line: SongLine; transpose: number, index: number }) {
  const renderedContent = useMemo(() => {
    if (line.type === 'heading') {
      return (
        <div 
          className="pt-4 pb-1 font-bold text-2xl text-primary"
        >
          {line.content}
        </div>
      );
    }

    if (line.type === 'empty') {
      return <div className="h-2" />;
    }

    const sortedChords = [...line.chords].sort((a, b) => a.position - b.position);
    
    if (sortedChords.length === 0) {
      return (
        <div 
          className="text-foreground/80 leading-snug whitespace-pre-wrap break-words"
        >
          {line.content || " "}
        </div>
      );
    }
    
    return (
      <div 
        className="relative pt-6 pb-1 group"
      >
        {/* Lyrics Line */}
        <div className="text-foreground/90 whitespace-pre-wrap leading-snug font-medium break-words">
          {line.content || "\u00A0"}
        </div>
        
        {/* Chords Overlay */}
        {sortedChords.map((chordBlock, i) => {
            const transposedChord = transposeChord(chordBlock.chord, transpose);
            return (
              <span 
                key={i}
                className="absolute top-0 text-blue-600 dark:text-blue-400 font-bold text-base transition-colors duration-300"
                style={{ left: `${chordBlock.position}ch` }}
              >
                {transposedChord}
              </span>
            );
        })}
      </div>
    );
  }, [line, transpose, index]);

  return <>{renderedContent}</>;
}
