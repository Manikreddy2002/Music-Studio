
'use client';

import { usePlayer } from '@/hooks/use-player';
import SidebarSongItem from '../trending-song-item';
import { useEffect, useState } from 'react';
import { Library, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import PlaylistSidebarItem from '../playlist-sidebar-item';

export default function LibraryComponent() {
  const { user } = useAuth();
  const { recentSongs, playlists, createPlaylist } = usePlayer();
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
        setError("Playlist name cannot be empty.");
        return;
    }
    setIsLoading(true);
    setError(null);
    const result = await createPlaylist(newPlaylistName);
    if (result.error) {
        setError(result.error);
    } else {
        setNewPlaylistName('');
        setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  
  const openModal = () => {
    setError(null);
    setNewPlaylistName('');
    setIsModalOpen(true);
  }

  return (
    <div className="bg-zinc-900 rounded-lg flex-grow flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-semibold text-white">
          <Library />
          Your Library
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={openModal}>
            <Plus />
        </Button>
      </div>

      <div className="overflow-y-auto px-2 space-y-2">
        {isClient && playlists.length > 0 && (
            <nav className="space-y-1">
                {playlists.map((playlist) => (
                    <PlaylistSidebarItem key={playlist._id} playlist={playlist} />
                ))}
            </nav>
        )}

        {isClient && playlists.length === 0 && user && (
             <>
                <div className="bg-zinc-800 rounded-lg p-4 m-2 text-center">
                    <h3 className="font-bold text-white">Create your first playlist</h3>
                    <p className="text-sm text-zinc-400 mt-1">It's easy, we'll help you</p>
                    <Button className="mt-4 rounded-full" onClick={openModal}>Create playlist</Button>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4 m-2 text-center">
                    <h3 className="font-bold text-white">Let's find some podcasts to follow</h3>
                    <p className="text-sm text-zinc-400 mt-1">We'll keep you updated on new episodes</p>
                    <Button variant="outline" className="mt-4 rounded-full bg-transparent border-white/80 text-white hover:bg-zinc-700 hover:text-white">Browse podcasts</Button>
                </div>
            </>
        )}

        {isClient && recentSongs.length > 0 && (
          <div>
            <div className="mt-4 px-2 text-sm font-semibold text-zinc-400">
                Recently Played
            </div>
            <nav className="space-y-1 mt-2">
                {recentSongs.map((song) => (
                <SidebarSongItem key={song.id} song={song} queue={recentSongs} />
                ))}
            </nav>
          </div>
        )}
      </div>

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Create playlist</DialogTitle>
            <DialogDescription>
              Give your new playlist a name.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleCreatePlaylist(); }}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Name
                </Label>
                <Input
                    id="name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="col-span-3 bg-zinc-800 border-zinc-700"
                    placeholder="My Awesome Playlist"
                />
                </div>
                {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
