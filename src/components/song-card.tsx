'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { Song } from '@/lib/data';
import Image from 'next/image';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import { usePlayer } from '@/hooks/use-player';

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export default function SongCard({ song, queue }: SongCardProps) {
  const { setSong } = usePlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSong(song, queue);
  };

  return (
    <Card className="bg-zinc-900 border-none hover:bg-zinc-800 transition-colors group relative">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="w-full aspect-square mb-4 relative">
          <Image
            src={song.image || 'https://placehold.co/500x500.png'}
            alt={`Cover of ${song.title}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="rounded-md shadow-lg object-cover"
            data-ai-hint="song cover"
          />
           <Button 
            onClick={handlePlay}
            variant="default"
            size="icon"
            className="absolute bottom-2 right-2 bg-primary rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
           >
            <Play className="h-6 w-6 fill-black text-black" />
          </Button>
        </div>
        <h3 className="font-semibold text-white truncate w-full">{song.title}</h3>
        <p className="text-sm text-zinc-400 mt-1 truncate w-full">{song.artist}</p>
      </CardContent>
    </Card>
  );
}
