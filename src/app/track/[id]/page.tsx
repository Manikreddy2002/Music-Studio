import HomeHeader from '@/components/home-header';
import RecentSongsSection from '@/components/recent-songs-section';
import SongCard from '@/components/song-card';
import { getTrendingMusic } from '@/lib/ytmusic';
import type { Song } from '@/lib/data';
import LikedSongsCard from '@/components/liked-songs-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import PopularRadioSection from '@/components/popular-radio-section';
import { Button } from '@/components/ui/button';
import ArtistSection from '@/components/artist-section';


export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  let trendingSongs: Song[] = [];
  let error: string | undefined;

  try {
    const result = await getTrendingMusic();
    trendingSongs = result.songs;
    error = result.error;
  } catch (e: any) {
    console.error('Failed to fetch trending music in HomePage:', e);
    error = 'An unexpected error occurred while fetching data. Please check the server logs and your API configuration.';
  }


  return (
    <div className="bg-gradient-to-b from-emerald-800 via-zinc-900 to-black text-white h-full overflow-y-auto rounded-lg">
      <div className="p-4 md:p-6">
        <HomeHeader />
        <div className="mb-8 flex items-center gap-2">
            <Button className="rounded-full bg-white text-black hover:bg-white/90 px-4 py-1 h-auto text-sm">All</Button>
            <Button variant="ghost" className="rounded-full bg-zinc-700 hover:bg-zinc-600 px-4 py-1 h-auto text-sm text-white">Music</Button>
            <Button variant="ghost" className="rounded-full bg-zinc-700 hover:bg-zinc-600 px-4 py-1 h-auto text-sm text-white">Podcasts</Button>
        </div>

        <ArtistSection />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Good Afternoon</h1>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <LikedSongsCard />
          </div>
        </div>
        
        <RecentSongsSection />

        <PopularRadioSection />

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Throwback</h2>
              <a href="#" className="text-sm font-semibold text-zinc-400 hover:underline">Show all</a>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>API Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingSongs.slice(0, 5).map((song) => (
              <SongCard key={song.id} song={song} queue={trendingSongs} />
            ))}
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">India's Best</h2>
              <a href="#" className="text-sm font-semibold text-zinc-400 hover:underline">Show all</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingSongs.slice(5, 10).map((song) => (
              <SongCard key={song.id} song={song} queue={trendingSongs} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
