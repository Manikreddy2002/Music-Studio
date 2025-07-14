
import mongoose, { Schema, Document } from 'mongoose';
import { Song as SongInterface } from '@/lib/data';

// Note: Mongoose will automatically add an `_id` field.
// We use the `id` field from the YouTube API as our primary identifier.
const SongSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  image: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: Number, required: true },
});

export default SongSchema;
