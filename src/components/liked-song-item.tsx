'use client';

import { usePlayer } from '@/hooks/use-player';
import type { Song } from '@/lib/data';
import { formatTime } from '@/lib/utils';
import { Heart, Play } from 'lucide-react';
import Image from 'next/image';

interface LikedSongItemProps {
  song: Song;
  index: number;
  onClick: (id: string) => void;
}

export default function LikedSongItem({ song, index, onClick }: LikedSongItemProps) {
    const { activeSong, toggleLikeSong } = usePlayer();

    return (
        <div
            onClick={() => onClick(song.id)}
            className="group grid grid-cols-[1fr_auto] md:grid-cols-[40px_1fr_1fr_auto] items-center gap-x-4 p-2 rounded-md hover:bg-neutral-800/50 cursor-pointer"
        >
            <div className="flex items-center gap-x-3">
                <div className="w-10 text-neutral-400 relative flex items-center justify-center">
                    <span className="group-hover:hidden">{index + 1}</span>
                    <button className="hidden group-hover:flex absolute items-center justify-center">
                        <Play size={20} className="text-white fill-white" />
                    </button>
                </div>
                 <Image
                    src={song.image}
                    alt={song.title}
                    width={40}
                    height={40}
                    className="object-cover rounded-sm"
                    data-ai-hint="song cover"
                />
            </div>
            <div className="min-w-0">
                <p className={`truncate ${activeSong?.id === song.id ? 'text-primary' : 'text-white'}`}>
                    {song.title}
                </p>
                <p className="truncate text-sm text-neutral-400 md:hidden">
                    {song.artist}
                </p>
            </div>
            <p className="hidden md:block truncate text-neutral-400">{song.artist}</p>
            <div className="flex items-center gap-x-4">
                <button onClick={(e) => {e.stopPropagation(); toggleLikeSong(song)}} className="text-neutral-400 hover:text-white">
                    <Heart size={20} className="text-primary fill-primary" />
                </button>
                <p className="text-neutral-400 text-sm w-12 text-right">{formatTime(song.duration)}</p>
            </div>
        </div>
    );
}
