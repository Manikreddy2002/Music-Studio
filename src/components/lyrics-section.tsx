
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getSongLyrics, type LyricsOutput } from '@/ai/flows/get-lyrics-flow';
import type { Song } from '@/lib/data';
import { Loader2 } from 'lucide-react';

interface LyricsSectionProps {
  song: Song;
}

export default function LyricsSection({ song }: LyricsSectionProps) {
  const [lyricsResult, setLyricsResult] = useState<LyricsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasOpened, setWasOpened] = useState(false);

  const handleAccordionToggle = async (value: string) => {
    if (value === 'lyrics' && !wasOpened) {
      setWasOpened(true);
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSongLyrics({ title: song.title, artist: song.artist });
        setLyricsResult(result);
      } catch (e) {
        console.error('Failed to fetch lyrics', e);
        setError('Could not load lyrics at this time.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="mt-8 bg-zinc-800/50 rounded-lg">
        <Accordion type="single" collapsible onValueChange={handleAccordionToggle}>
        <AccordionItem value="lyrics" className="border-none">
            <AccordionTrigger className="p-4 text-white font-bold hover:no-underline">
                Lyrics
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                </div>
            )}
            {error && <p className="text-destructive text-center">{error}</p>}
            {lyricsResult && (
                lyricsResult.plainLyrics ? (
                <pre className="text-zinc-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {lyricsResult.plainLyrics}
                </pre>
                ) : (
                <p className="text-zinc-400 text-center">No lyrics found for this song.</p>
                )
            )}
            </AccordionContent>
        </AccordionItem>
        </Accordion>
    </div>
  );
}
