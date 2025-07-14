'use client';

import { usePlayer } from '@/hooks/use-player';
import { Heart, Clock } from 'lucide-react';
import LikedSongItem from '@/components/liked-song-item';

export default function LikedPage() {
  const { likedSongs, setSong } = usePlayer();

  if (likedSongs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full p-6 text-white items-center justify-center h-full">
        <div className="text-center">
            <h1 className="text-3xl font-bold">Songs you like will appear here</h1>
            <p className="text-neutral-400 mt-2">Save songs by tapping the heart icon.</p>
        </div>
      </div>
    );
  }
  
  const onPlay = (id: string) => {
    const song = likedSongs.find(s => s.id === id);
    if(song) {
      setSong(song, likedSongs);
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-indigo-800 via-zinc-900 to-black text-white p-6">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-x-5">
        <div className="relative h-32 w-32 lg:h-44 lg:w-44 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center rounded-md">
                <Heart className="text-white h-12 w-12" fill="white" />
            </div>
        </div>
        <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
          <p className="hidden md:block font-semibold text-sm">Playlist</p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
            Liked Songs
          </h1>
          <p className="text-neutral-400 text-sm mt-2">{likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 mt-8">
        <div className="px-4 py-2 grid grid-cols-[1fr_auto] md:grid-cols-[40px_1fr_1fr_auto] gap-x-4 items-center text-neutral-400 border-b border-neutral-700">
            <div className="hidden md:block">#</div>
            <div className="pl-12 md:pl-0">Title</div>
            <div className="hidden md:block">Artist</div>
            <div className="pr-12"><Clock size={20} /></div>
        </div>
        {likedSongs.map((song, i) => (
          <LikedSongItem key={song.id} song={song} index={i} onClick={onPlay} />
        ))}
      </div>
    </div>
  );
}
