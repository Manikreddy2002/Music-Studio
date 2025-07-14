
'use client';

import type { Playlist } from '@/lib/data';
import { ListMusic } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PlaylistSidebarItemProps {
  playlist: Playlist;
}

export default function PlaylistSidebarItem({ playlist }: PlaylistSidebarItemProps) {
  const router = useRouter();

  const handleClick = () => {
    // TODO: Navigate to a future playlist page
    // router.push(`/playlist/${playlist._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center gap-3 p-2 text-sm font-medium rounded-md hover:bg-zinc-800 cursor-pointer"
    >
      <div className="relative w-12 h-12 bg-zinc-800 rounded-md shrink-0 flex items-center justify-center">
        <ListMusic className="text-zinc-400" />
      </div>
      <div className="min-w-0">
        <p className="text-white truncate">{playlist.name}</p>
        <p className="text-xs truncate text-zinc-400">Playlist &middot; {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</p>
      </div>
    </div>
  );
}
