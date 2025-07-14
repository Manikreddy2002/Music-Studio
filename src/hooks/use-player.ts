
'use client';

import { create } from 'zustand';
import type { Song, Playlist } from '@/lib/data';
import type { YouTubePlayer } from 'react-youtube';
import { addRecentSongToDB, toggleLikeSongInDB, createPlaylist as createPlaylistInDB } from '@/app/actions/user';

const shuffleArray = (array: Song[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface PlayerStore {
  activeSong?: Song;
  player?: YouTubePlayer; // This will be undefined on initial hydration
  isPlaying: boolean;
  recentSongs: Song[];
  likedSongs: Song[];
  playlists: Playlist[];
  queue: Song[];
  originalQueue: Song[];
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  progress: number;
  currentTime: number;
  setSong: (song?: Song, queue?: Song[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (progress: number) => void;
  setPlayer: (player: YouTubePlayer) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (currentTime: number) => void;
  isLiked: (songId: string) => boolean;
  toggleLikeSong: (song: Song) => void;
  setLikedSongs: (songs: Song[]) => void;
  setRecentSongs: (songs: Song[]) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  createPlaylist: (name: string) => Promise<{ success?: boolean; error?: string; playlists?: Playlist[] }>;
}

export const usePlayer = create<PlayerStore>()((set, get) => ({
  activeSong: undefined,
  player: undefined,
  isPlaying: false,
  recentSongs: [],
  likedSongs: [],
  playlists: [],
  queue: [],
  originalQueue: [],
  isShuffled: false,
  repeatMode: 'none',
  progress: 0,
  currentTime: 0,
  
  setLikedSongs: (songs) => set({ likedSongs: songs }),
  setRecentSongs: (songs) => set({ recentSongs: songs }),
  setPlaylists: (playlists) => set({ playlists }),

  createPlaylist: async (name) => {
    const result = await createPlaylistInDB(name);
    if (result.success && result.playlists) {
        set({ playlists: result.playlists });
    }
    return result;
  },

  setSong: (song, newQueue) => {
    if (!song) {
      set({ activeSong: undefined, isPlaying: false });
      return;
    }

    addRecentSongToDB(song).then(result => {
        if (result.success && result.recentSongs) {
            set({ recentSongs: result.recentSongs });
        }
    });

    const state = get();

    const queueToUse = newQueue || state.originalQueue;
    let finalQueue = queueToUse;

    if (state.isShuffled) {
      const otherSongs = queueToUse.filter((s) => s.id !== song.id);
      finalQueue = [song, ...shuffleArray(otherSongs)];
    }

    set({
      activeSong: song,
      isPlaying: true,
      originalQueue: queueToUse,
      queue: finalQueue,
      progress: 0,
      currentTime: 0,
    });
  },

  playNext: () => {
    const { activeSong, queue, setSong, repeatMode } = get();
    if (queue.length === 0) return;

    const currentIndex = activeSong
      ? queue.findIndex((s) => s.id === activeSong.id)
      : -1;

    if (currentIndex === -1) {
      setSong(queue[0], queue);
      return;
    }

    const isLastSong = currentIndex === queue.length - 1;
    if (isLastSong) {
      if (repeatMode === 'all') {
        setSong(queue[0], queue); // Loop to start
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    setSong(queue[nextIndex], queue);
  },

  playPrevious: () => {
    const { activeSong, queue, setSong, currentTime, seek } = get();

    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (!activeSong || queue.length === 0) return;

    const currentIndex = queue.findIndex((s) => s.id === activeSong.id);

    if (currentIndex <= 0) {
      seek(0);
      return;
    }

    const prevIndex = currentIndex - 1;
    setSong(queue[prevIndex], queue);
  },

  seek: (newProgress) => {
    const { player, activeSong } = get();
    if (player && activeSong && activeSong.duration > 0) {
      const newTime = (newProgress / 100) * activeSong.duration;
      player.seekTo(newTime, true);
      // Optimistically update state
      set({ progress: newProgress, currentTime: newTime });
    }
  },

  toggleShuffle: () => {
    set((state) => {
      const { isShuffled, activeSong, originalQueue } = state;
      const newIsShuffled = !isShuffled;

      if (newIsShuffled) {
        if (!activeSong) return { isShuffled: true, queue: shuffleArray(originalQueue) };
        const otherSongs = originalQueue.filter((s) => s.id !== activeSong.id);
        const shuffledQueue = [activeSong, ...shuffleArray(otherSongs)];
        return { isShuffled: true, queue: shuffledQueue };
      } else {
        return { isShuffled: false, queue: originalQueue };
      }
    });
  },

  cycleRepeatMode: () => {
    set((state) => {
      if (state.repeatMode === 'none') return { repeatMode: 'all' };
      if (state.repeatMode === 'all') return { repeatMode: 'one' };
      return { repeatMode: 'none' };
    });
  },

  isLiked: (songId) => {
    const { likedSongs } = get();
    return likedSongs.some((s) => s.id === songId);
  },

  toggleLikeSong: (song) => {
    // Optimistic UI update
    const isAlreadyLiked = get().likedSongs.some((s) => s.id === song.id);
    if (isAlreadyLiked) {
      set((state) => ({
        likedSongs: state.likedSongs.filter((s) => s.id !== song.id),
      }));
    } else {
      set((state) => ({ likedSongs: [song, ...state.likedSongs] }));
    }

    // Call server action to persist change
    toggleLikeSongInDB(song).then(result => {
        if (result.success && result.likedSongs) {
            set({ likedSongs: result.likedSongs });
        } else {
            // Revert optimistic update on failure
            console.error("Failed to toggle like status in DB");
            const { likedSongs } = get();
            const currentLiked = likedSongs.some(s => s.id === song.id);
            if (currentLiked) {
                set({ likedSongs: likedSongs.filter(s => s.id !== song.id) });
            } else {
                set({ likedSongs: [song, ...likedSongs] });
            }
        }
    });
  },

  setPlayer: (player) => set({ player }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (currentTime) => set({ currentTime }),
}));
