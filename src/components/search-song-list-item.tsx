
'use client';

import type { Song } from '@/lib/data';
import { usePlayer } from '@/hooks/use-player';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';

interface SearchSongListItemProps {
  song: Song;
  queue: Song[];
}

export default function SearchSongListItem({ song, queue }: SearchSongListItemProps) {
  const { setSong, activeSong } = usePlayer();
  const isPlaying = activeSong?.id === song.id;

  const handleClick = () => {
    setSong(song, queue);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center justify-between p-2 rounded-md hover:bg-zinc-800/50 w-full cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src={song.image}
            alt={song.title}
            fill
            sizes="40px"
            className="rounded-sm object-cover"
            data-ai-hint="song cover"
          />
          <div className="absolute inset-0 bg-black/50 items-center justify-center hidden group-hover:flex">
             <Play size={20} className="text-white fill-white" />
          </div>
        </div>
        <div className="min-w-0">
          <p className={cn("truncate font-semibold", isPlaying ? 'text-primary' : 'text-white')}>{song.title}</p>
          <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
        </div>
      </div>
      <p className="text-sm text-zinc-400 pl-4">{formatTime(song.duration)}</p>
    </div>
  );
}
