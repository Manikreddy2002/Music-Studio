
'use client';

import { ChevronDown, MoreVertical, Play, Pause, Heart, PlusCircle, Shuffle, SkipBack, SkipForward, Repeat, Repeat1, Share2 } from 'lucide-react';
import Image from 'next/image';
import type { Song } from '@/lib/data';
import { usePlayer } from '@/hooks/use-player';
import { useRouter } from 'next/navigation';
import { cn, formatTime } from '@/lib/utils';
import { useLayoutEffect }from 'react';
import { Button } from '@/components/ui/button';
import LyricsSection from './lyrics-section';
import { Slider } from './ui/slider';

interface TrackViewProps {
  trackDetails: Song;
}

export default function TrackView({ trackDetails }: TrackViewProps) {
  const router = useRouter();
  const { 
    activeSong, player, isPlaying, setSong,
    isLiked, toggleLikeSong, progress, currentTime,
    seek, playNext, playPrevious, toggleShuffle,
    cycleRepeatMode, isShuffled, repeatMode
  } = usePlayer();
  
  const song = trackDetails;
  const isCurrentlyPlayingSong = activeSong?.id === song.id;

  // Prevent scrolling on the body when the mobile player is open
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
        document.body.style.overflow = originalStyle;
    }
  }, []);

  const handlePlayPause = () => {
    if (isCurrentlyPlayingSong) {
        if (isPlaying) {
            player?.pauseVideo();
        } else {
            player?.playVideo();
        }
    } else {
        setSong(song, [song]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (isCurrentlyPlayingSong) {
        seek(value[0]);
    }
  };


  return (
    <>
      {/* Mobile Full-Screen Player View */}
       <div className="md:hidden relative flex flex-col bg-gradient-to-b from-emerald-800 via-zinc-900 to-black text-white h-screen">
        {/* Optional: Blurred background using album art */}
        <div className="absolute inset-0 -z-10 opacity-30 blur-xl" style={{backgroundImage: `url('${song.image || 'https://placehold.co/500x500.png'}')`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
        <header className="relative z-10 flex items-center justify-between px-2 py-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white">
            <ChevronDown size={24} />
          </Button>
          <div className="text-center flex-1">
            <p className="text-xs text-zinc-300 truncate">{song.album}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreVertical size={24} />
          </Button>
        </header>
        <main className="flex-grow z-10 flex flex-col items-center justify-between px-4 pb-2">
          <div className="w-full flex flex-col items-center mt-2">
            <div className="relative w-3/4 max-w-xs aspect-square shadow-2xl rounded-xl overflow-hidden">
              <Image
                src={song.image || 'https://placehold.co/500x500.png'}
                alt={`Cover for ${song.title}`}
                fill
                sizes="100vw"
                className="object-cover rounded-xl shadow-lg"
                data-ai-hint="song cover"
              />
            </div>
            <div className="w-full flex items-center justify-between mt-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold truncate">{song.title}</h2>
                <p className="text-zinc-300 truncate text-sm">{song.artist}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0 ml-2"
                onClick={() => toggleLikeSong(song)}
                disabled={!song.id}
              >
                <Heart 
                  size={26} 
                  className={cn('transition', { 'fill-primary text-primary': isLiked(song.id) })}
                />
              </Button>
            </div>
          </div>
          <div className="w-full mt-2">
            <Slider
              value={[isCurrentlyPlayingSong ? progress : 0]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              disabled={!activeSong}
              className="h-2"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>{formatTime(isCurrentlyPlayingSong ? currentTime : 0)}</span>
              <span>{formatTime(song.duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full mt-2 mb-2 px-2">
            <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn('text-zinc-300 hover:text-white', { 'text-primary': isShuffled })}>
              <Shuffle size={22}/>
            </Button>
            <Button variant="ghost" size="icon" onClick={playPrevious} className="text-zinc-300 hover:text-white">
              <SkipBack size={28} fill="currentColor"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="h-16 w-16 bg-white text-black rounded-full hover:bg-white/90 flex items-center justify-center shadow-lg">
              {isCurrentlyPlayingSong && isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext} className="text-zinc-300 hover:text-white">
              <SkipForward size={28} fill="currentColor"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={cycleRepeatMode} className={cn('text-zinc-300 hover:text-white', { 'text-primary': repeatMode !== 'none' })}>
              {repeatMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
            </Button>
          </div>
        </main>
        <footer className="relative z-10 px-2 pb-3 pt-1 shrink-0">
          <LyricsSection song={song} />
        </footer>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex bg-gradient-to-b from-emerald-800 via-zinc-900 to-black p-6 h-full flex-col items-center justify-center">
        <div className="w-full max-w-sm flex-shrink-0 text-center">
          <Image
            src={trackDetails.image || 'https://placehold.co/500x500.png'}
            alt={`Cover for ${trackDetails.title}`}
            width={500}
            height={500}
            className="rounded-lg shadow-lg w-full"
            data-ai-hint="song cover"
          />
          <h1 className="text-3xl font-bold mt-4">{trackDetails.title}</h1>
          <p className="text-zinc-400 text-lg">{trackDetails.artist}</p>
          <p className="text-zinc-500 text-sm">{trackDetails.album}</p>
          <div className="flex gap-x-2">
            <Button onClick={() => setSong(trackDetails, [trackDetails])} className="mt-4 w-full">
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
             <Button 
                variant="outline" 
                size="icon" 
                className="mt-4" 
                onClick={() => toggleLikeSong(trackDetails)}
            >
                <Heart 
                    size={20} 
                    className={cn('transition', { 'fill-primary text-primary': isLiked(trackDetails.id) })}
                />
            </Button>
          </div>
           <div className="mt-4 w-full">
            <LyricsSection song={trackDetails} />
          </div>
        </div>
      </div>
    </>
  );
}
