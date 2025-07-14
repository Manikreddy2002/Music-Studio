import { getTrendingMusic } from '@/lib/ytmusic';
import RadioCard from './radio-card';
import type { Song } from '@/lib/data';

const bgGradients = [
    'bg-gradient-to-t from-yellow-700/80 to-transparent',
    'bg-gradient-to-t from-sky-700/80 to-transparent',
    'bg-gradient-to-t from-rose-700/80 to-transparent',
    'bg-gradient-to-t from-purple-700/80 to-transparent',
    'bg-gradient-to-t from-lime-700/80 to-transparent',
    'bg-gradient-to-t from-orange-700/80 to-transparent',
];

// Helper to get unique artists from a list of songs
const getUniqueArtists = (songs: Song[]) => {
    const artists: { name: string, image: string }[] = [];
    const artistNames = new Set<string>();

    for (const song of songs) {
        if (!artistNames.has(song.artist)) {
            artistNames.add(song.artist);
            artists.push({ name: song.artist, image: song.image });
        }
    }
    return artists;
}

// Helper to create a descriptive string of related artists
const getRelatedArtistsString = (mainArtistName: string, allArtists: {name: string}[]) => {
    const otherArtists = allArtists
        .filter(a => a.name !== mainArtistName)
        .map(a => a.name.replace(/VEVO|- Topic/gi, '').trim())
        .filter(name => name.length > 0)
        .slice(0, 2);
    
    if (otherArtists.length > 0) {
        return `With ${otherArtists.join(', ')} & more`;
    }
    return `The best of ${mainArtistName.replace(/VEVO|- Topic/gi, '').trim()}`;
}

export default async function PopularRadioSection() {
    const { songs, error } = await getTrendingMusic();

    if (error || !songs || songs.length === 0) {
        return null;
    }
    
    const uniqueArtists = getUniqueArtists(songs);
    const artistsForRadio = uniqueArtists.slice(0, 6);

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Popular radio</h2>
                <a href="#" className="text-sm font-semibold text-zinc-400 hover:underline">Show all</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
                {artistsForRadio.map((artist, index) => (
                    <RadioCard 
                        key={artist.name} 
                        artist={{
                            name: artist.name.replace(/VEVO|- Topic/gi, '').trim(),
                            image: artist.image,
                            related: getRelatedArtistsString(artist.name, uniqueArtists)
                        }}
                        bgColor={bgGradients[index % bgGradients.length]}
                    />
                ))}
            </div>
        </div>
    );
}
