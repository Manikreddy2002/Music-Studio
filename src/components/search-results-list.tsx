
'use client';

import type { Song } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import SearchSongListItem from './search-song-list-item';

interface SearchResultsListProps {
    songs: Song[];
    query: string;
    error?: string;
}

export default function SearchResultsList({ songs, query, error }: SearchResultsListProps) {
    if (error) {
        return (
            <div className="mt-8">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>API Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!query) {
         return (
            <div className="text-center mt-16">
                <h2 className="text-2xl font-bold">Find what you want to listen to</h2>
                <p className="text-zinc-400 mt-2">Search for artists, songs, podcasts, and more.</p>
            </div>
        );
    }

    if (songs.length === 0) {
        return <p className="text-zinc-400 text-center mt-16">No results found for "{query}".</p>
    }

    return (
        <div className="space-y-4 mt-4">
            <h2 className="text-2xl font-bold">Songs</h2>
            <div className="flex flex-col">
                {songs.map(song => (
                    <SearchSongListItem key={song.id} song={song} queue={songs} />
                ))}
            </div>
        </div>
    );
}
