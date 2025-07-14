'use client';

import { usePlayer } from '@/hooks/use-player';
import SongCard from './song-card';
import { useEffect, useState } from 'react';

export default function RecentSongsSection() {
  const { recentSongs } = usePlayer();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avoid hydration mismatch by only rendering on the client
  if (!isClient || recentSongs.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recentSongs.map((song) => (
          <SongCard key={song.id} song={song} queue={recentSongs} />
        ))}
      </div>
    </div>
  );
}
