
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
       <div className="md:hidden flex flex-col bg-gradient-to-b from-emerald-800 via-zinc-900 to-black text-white h-screen">
        
        <header className="relative z-10 flex items-center justify-between p-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronDown />
          </Button>
          <div className="text-center">
            <p className="text-xs text-zinc-400">PLAYING FROM ALBUM</p>
            <p className="font-bold text-sm truncate max-w-48">{song.album}</p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical />
          </Button>
        </header>
        
        <main className="flex-grow z-10 p-4 flex flex-col justify-between">
          <div className="relative w-full aspect-square shadow-2xl">
            <Image
              src={song.image || 'https://placehold.co/500x500.png'}
              alt={`Cover for ${song.title}`}
              fill
              sizes="100vw"
              className="object-cover rounded-md"
              data-ai-hint="song cover"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <div className="min-w-0">
                  <h2 className="text-2xl font-bold truncate">{song.title}</h2>
                  <p className="text-zinc-300 truncate">{song.artist}</p>
              </div>
              <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => toggleLikeSong(song)}
                  disabled={!song.id}
              >
                  <Heart 
                      size={28} 
                      className={cn('transition', { 'fill-primary text-primary': isLiked(song.id) })}
                  />
              </Button>
            </div>


            <div className="mt-4">
              <Slider
                value={[isCurrentlyPlayingSong ? progress : 0]}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                disabled={!activeSong}
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-2">
                  <span>{formatTime(isCurrentlyPlayingSong ? currentTime : 0)}</span>
                  <span>{formatTime(song.duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-white">
              <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn('text-zinc-300 hover:text-white', { 'text-primary': isShuffled })}>
                  <Shuffle size={24}/>
              </Button>
              <Button variant="ghost" size="icon" onClick={playPrevious} className="text-zinc-300 hover:text-white">
                  <SkipBack size={32} fill="currentColor"/>
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePlayPause} className="h-20 w-20 bg-white text-black rounded-full hover:bg-white/90">
                  {isCurrentlyPlayingSong && isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext} className="text-zinc-300 hover:text-white">
                  <SkipForward size={32} fill="currentColor"/>
              </Button>
              <Button variant="ghost" size="icon" onClick={cycleRepeatMode} className={cn('text-zinc-300 hover:text-white', { 'text-primary': repeatMode !== 'none' })}>
                  {repeatMode === 'one' ? <Repeat1 size={24} /> : <Repeat size={24} />}
              </Button>
            </div>
          </div>
        </main>
        
        <footer className="relative z-10 p-4 shrink-0">
          <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                <Share2 size={24} />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                <PlusCircle size={24} />
              </Button>
          </div>
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
