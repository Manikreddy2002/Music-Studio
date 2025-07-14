'use client';

import type { Song } from '@/lib/data';
import { usePlayer } from '@/hooks/use-player';
import Image from 'next/image';

interface SidebarSongItemProps {
  song: Song;
  queue: Song[];
}

export default function SidebarSongItem({ song, queue }: SidebarSongItemProps) {
  const { setSong } = usePlayer();

  return (
    <div
      onClick={() => setSong(song, queue)}
      className="group flex items-center gap-3 p-2 text-sm font-medium rounded-md hover:bg-zinc-800 cursor-pointer"
    >
      <div className="relative w-12 h-12 bg-zinc-800 rounded-md shrink-0">
        <Image
          src={song.image || 'https://placehold.co/48x48.png'}
          alt={song.title}
          fill
          className="object-cover rounded-md"
          data-ai-hint="song cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-white truncate">{song.title}</p>
        <p className="text-xs truncate">Song &middot; {song.artist}</p>
      </div>
    </div>
  );
}
