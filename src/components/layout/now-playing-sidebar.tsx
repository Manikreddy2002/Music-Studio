
'use client';

import { usePlayer } from '@/hooks/use-player';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

export default function NowPlayingSidebar() {
  const { activeSong } = usePlayer();

  if (!activeSong) {
    return (
        <div className="bg-zinc-900 rounded-lg text-white p-4 h-full flex flex-col justify-center items-center text-center">
            <Music size={48} className="text-zinc-500 mb-4" />
            <h3 className="font-bold text-lg">Nothing playing</h3>
            <p className="text-sm text-zinc-400">The song you are playing will appear here.</p>
        </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg text-white p-4 h-full flex flex-col gap-y-4 overflow-y-auto no-scrollbar">
      <div className="relative w-full aspect-square mt-2 shadow-lg">
        <Image
          src={activeSong.image}
          alt={activeSong.title}
          fill
          sizes="(min-width: 1280px) 350px, 0px"
          className="rounded-md object-cover"
          data-ai-hint="album cover"
        />
      </div>
      <div className="flex justify-between items-start mt-2">
        <div>
            <h3 className="text-xl font-bold">{activeSong.title}</h3>
            <p className="text-sm text-zinc-400">{activeSong.artist}</p>
        </div>
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg mt-2">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold">Credits</h4>
          <Button variant="link" size="sm" className="text-zinc-400 hover:text-white p-0 h-auto text-xs font-bold hover:no-underline">Show all</Button>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <div className="relative w-12 h-12">
                    <Image
                        src={activeSong.image} // Using song image for artist, as API doesn't provide it separately.
                        alt={activeSong.artist}
                        fill
                        sizes="48px"
                        className="rounded-full object-cover"
                        data-ai-hint="artist portrait"
                    />
                 </div>
                 <div>
                    <p className="font-semibold text-white">{activeSong.artist}</p>
                    <p className="text-xs text-zinc-400">Main Artist</p>
                </div>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent border-white/80 text-white hover:bg-zinc-700 hover:text-white px-4 h-8 text-xs font-semibold">
                Follow
            </Button>
        </div>
      </div>
    </div>
  );
}
