'use client';

import { usePlayer } from '@/hooks/use-player';
import { Heart, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LikedSongsCard() {
    const { likedSongs, setSong } = usePlayer();
    const router = useRouter();

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (likedSongs.length > 0) {
            setSong(likedSongs[0], likedSongs);
        }
    };

    const handleClick = () => {
        router.push('/liked');
    }

    return (
        <div 
            onClick={handleClick}
            className="group relative flex items-center gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4 rounded-md cursor-pointer h-20"
        >
            <div className="relative h-20 w-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center rounded-l-md">
                    <Heart className="text-white h-8 w-8" fill="white" />
                </div>
            </div>
            <div>
                <p className="font-bold">
                    Liked Songs
                </p>
                 <p className="text-sm text-zinc-400 mt-1">
                    {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}
                </p>
            </div>
            {likedSongs.length > 0 && (
                <button 
                    onClick={handlePlay} 
                    className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-primary p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-110"
                >
                    <Play className="text-black fill-black" />
                </button>
            )}
        </div>
    );
}
