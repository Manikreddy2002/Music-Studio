
'use server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import type { Song, Playlist } from '@/lib/data';
import { getCurrentUser } from './auth';

export async function getUserData() {
  const user = await getCurrentUser();
  if (!user) {
    return { likedSongs: [], recentSongs: [], playlists: [] };
  }

  await dbConnect();
  const dbUser = await User.findById(user.id);

  if (!dbUser) {
    return { likedSongs: [], recentSongs: [], playlists: [] };
  }
  
  // Convert mongoose documents to plain objects to avoid serialization issues
  const likedSongs = JSON.parse(JSON.stringify(dbUser.likedSongs));
  const recentSongs = JSON.parse(JSON.stringify(dbUser.recentSongs));
  const playlists = JSON.parse(JSON.stringify(dbUser.playlists));

  return { likedSongs, recentSongs, playlists };
}

export async function createPlaylist(name: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'User not authenticated' };

    await dbConnect();
    const dbUser = await User.findById(user.id);
    if (!dbUser) return { error: 'User not found' };

    // Check if a playlist with the same name already exists
    const existingPlaylist = dbUser.playlists.find((p: { name: string }) => p.name === name);
    if (existingPlaylist) {
        return { error: 'A playlist with this name already exists.' };
    }

    dbUser.playlists.unshift({ name, songs: [] });
    await dbUser.save();

    return { success: true, playlists: JSON.parse(JSON.stringify(dbUser.playlists)) };
}

export async function toggleLikeSongInDB(song: Song) {
    const user = await getCurrentUser();
    if (!user) return { error: 'User not authenticated' };
    
    await dbConnect();
    const dbUser = await User.findById(user.id);
    if (!dbUser) return { error: 'User not found' };

    const songIndex = dbUser.likedSongs.findIndex((s: Song) => s.id === song.id);

    if (songIndex > -1) {
        // Song is already liked, so unlike it
        dbUser.likedSongs.splice(songIndex, 1);
    } else {
        // Song is not liked, so like it
        dbUser.likedSongs.unshift(song);
    }

    await dbUser.save();
    return { success: true, likedSongs: JSON.parse(JSON.stringify(dbUser.likedSongs)) };
}

export async function addRecentSongToDB(song: Song) {
    const user = await getCurrentUser();
    if (!user) return { error: 'User not authenticated' };

    await dbConnect();
    const dbUser = await User.findById(user.id);
    if (!dbUser) return { error: 'User not found' };

    // Remove if it already exists to move it to the front
    const existingIndex = dbUser.recentSongs.findIndex((s: Song) => s.id === song.id);
    if (existingIndex > -1) {
        dbUser.recentSongs.splice(existingIndex, 1);
    }

    // Add to the front of the array
    dbUser.recentSongs.unshift(song);

    // Keep the list at a max of 10
    dbUser.recentSongs = dbUser.recentSongs.slice(0, 10);

    await dbUser.save();
    return { success: true, recentSongs: JSON.parse(JSON.stringify(dbUser.recentSongs)) };
}
