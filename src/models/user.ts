
import mongoose, { Schema, Document } from 'mongoose';
import SongSchema from './song';

export interface Playlist {
  name: string;
  songs: any[];
}

const PlaylistSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  songs: [SongSchema],
});

export interface IUser extends Document {
  name: string;
  email: string;
  password: any; // It will be a hash, so it's a string
  likedSongs: any[]; // Array of Song documents
  recentSongs: any[]; // Array of Song documents
  playlists: any[]; // Array of Playlist documents
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedSongs: [SongSchema],
  recentSongs: [SongSchema],
  playlists: [PlaylistSchema],
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
