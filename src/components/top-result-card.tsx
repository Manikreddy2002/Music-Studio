
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { usePlayer } from '@/hooks/use-player';
import type { Song } from '@/lib/data';

interface TopResultCardProps {
  song: Song;
  queue: Song[];
}

export default function TopResultCard({ song, queue }: TopResultCardProps) {
  const { setSong } = usePlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSong(song, queue);
  };

  return (
    <div
      onClick={handlePlay}
      className="bg-zinc-800/50 hover:bg-zinc-700/80 transition p-4 rounded-lg group cursor-pointer relative"
    >
        <div className="flex flex-col gap-y-4">
            <div className="relative w-24 h-24">
                <Image
                    src={song.image}
                    alt={song.title}
                    fill
                    sizes="96px"
                    className="rounded-md object-cover"
                    data-ai-hint="song cover"
                />
            </div>
            <div>
                <h2 className="text-3xl font-bold truncate">{song.title}</h2>
                <p className="text-sm text-zinc-400 mt-2">
                    Song &bull; {song.artist}
                </p>
            </div>
        </div>
        <Button
            onClick={handlePlay}
            variant="default"
            size="icon"
            className="absolute bottom-6 right-6 bg-primary rounded-full h-14 w-14 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg"
        >
            <Play className="h-7 w-7 fill-black text-black ml-1" />
        </Button>
    </div>
  );
}
