
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  duration: number;
}

export interface Playlist {
  _id: string;
  name: string;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  hint?: string;
}
