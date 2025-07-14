
'use client';

import { Shuffle, SkipBack, Play, SkipForward, Repeat, Mic2, LayoutList, Bluetooth, Volume1, Volume2, VolumeX, Maximize2, Pause, Repeat1, Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import YouTube, { type YouTubePlayer } from 'react-youtube';
import { usePlayer } from '@/hooks/use-player';
import { useEffect, useState } from 'react';
import { cn, formatTime } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BluetoothMenu from '../bluetooth-menu';


export default function Player() {
  const pathname = usePathname();
  const router = useRouter();
  const isTrackPage = pathname.startsWith('/track/');

  const { 
    activeSong, player, setPlayer, isPlaying, setIsPlaying, 
    playNext, playPrevious, isShuffled, toggleShuffle,
    repeatMode, cycleRepeatMode, recentSongs, setSong,
    progress, currentTime, setProgress, setCurrentTime,
    isLiked, toggleLikeSong, seek
  } = usePlayer();

  const [volume, setVolume] = useState(50);
  const [isClient, setIsClient] = useState(false);
  const [isBluetoothMenuOpen, setIsBluetoothMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>('OPPO Enco Buds');
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const songToDisplay = activeSong || recentSongs[0];
  const isDisplayingRecent = !activeSong && recentSongs.length > 0;

  const handlePlayPause = () => {
    if (isDisplayingRecent && songToDisplay) {
      setSong(songToDisplay, recentSongs);
      return;
    }

    if (isPlaying) {
      player?.pauseVideo();
    } else {
      player?.playVideo();
    }
  };

  const handleEnd = () => {
    if (repeatMode === 'one') {
      player?.seekTo(0);
      player?.playVideo();
    } else {
      playNext();
    }
  }
  
  const handleMaximize = () => {
    if (songToDisplay) {
      router.push(`/track/${songToDisplay.id}`);
    }
  };

  useEffect(() => {
    if (player) {
      player.setVolume(volume);
    }
  }, [volume, player]);

  useEffect(() => {
    // Reset progress when song changes
    if (activeSong) {
      setCurrentTime(0);
      setProgress(0);
    }
  }, [activeSong, setCurrentTime, setProgress]);

  useEffect(() => {
    if (!isPlaying || !player) return;

    const interval = setInterval(() => {
      const time = player.getCurrentTime();
      setCurrentTime(time);
      if (activeSong && activeSong.duration > 0) {
        setProgress((time / activeSong.duration) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, player, activeSong, setCurrentTime, setProgress]);
  
  const handleReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  const handleSliderChange = (value: number[]) => {
    if (activeSong) {
      seek(value[0]);
    }
  };
  
  const handleBluetoothConnect = async () => {
    setBluetoothError(null);
    setConnectedDevice(null);
    setIsConnecting(true);

    if (!navigator.bluetooth) {
      setBluetoothError('Bluetooth not available on this browser.');
      setIsConnecting(false);
      return;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      
      setConnectedDevice(device.name || device.id);

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotFoundError') {
          // User cancelled the pairing prompt, not an actual error state.
          setBluetoothError(null);
        } else if (error.name === 'NotAllowedError') {
          console.error('Bluetooth permission denied:', error);
          setBluetoothError('Permission denied by user.');
        } else {
          console.error('Bluetooth connection failed:', error);
          setBluetoothError('Connection failed. Is device on?');
        }
      } else {
        console.error('An unknown Bluetooth error occurred:', error);
        setBluetoothError('An unknown error occurred.');
      }
    } finally {
        setIsConnecting(false);
    }
  };

  const VolumeIcon = ({ size = 20 }: { size?: number }) => {
    if (volume === 0) return <VolumeX size={size} />;
    if (volume < 50) return <Volume1 size={size} />;
    return <Volume2 size={size} />;
  };

  return (
    <div className={cn(
        "fixed left-0 right-0 bg-black text-white border-t border-zinc-800 h-[72px] lg:h-[90px] z-30",
        "bottom-16 md:bottom-0",
        isTrackPage && "hidden lg:block"
      )}>
      
      {/* Desktop Player */}
      <div className="hidden lg:grid lg:grid-cols-3 p-4 h-full">
        <div className="flex items-center gap-3 min-w-0">
          {songToDisplay ? (
            <>
              <Link href={`/track/${songToDisplay.id}`} className="flex items-center gap-3 group min-w-0 flex-1">
                <Image 
                  src={songToDisplay.image || 'https://placehold.co/56x56.png'} 
                  data-ai-hint="album cover" 
                  alt="Album cover" 
                  width={56} 
                  height={56} 
                  className="rounded flex-shrink-0" 
                />
                <div className="min-w-0">
                  <p className="font-semibold truncate group-hover:underline">{songToDisplay.title}</p>
                  <p className="text-xs text-zinc-400 truncate">{songToDisplay.artist}</p>
                </div>
              </Link>
              <button 
                onClick={() => toggleLikeSong(songToDisplay)} 
                className="text-zinc-400 hover:text-white disabled:opacity-50"
                disabled={!songToDisplay}
              >
                <Heart 
                    size={20} 
                    className={cn('transition', { 'fill-primary text-primary': isLiked(songToDisplay.id) })}
                />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-[56px] h-[56px] bg-zinc-800 rounded"></div>
               <div>
                <p className="font-semibold">No song selected</p>
                <p className="text-xs text-zinc-400">...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleShuffle} 
              className={cn('text-zinc-400 hover:text-white', { 'text-primary hover:text-primary/80': isShuffled })}
            >
              <Shuffle size={20} />
            </button>
            <button onClick={playPrevious} className="text-zinc-400 hover:text-white"><SkipBack size={20} /></button>
            <button onClick={handlePlayPause} disabled={!songToDisplay} className="bg-white text-black rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black" />}
            </button>
            <button onClick={playNext} className="text-zinc-400 hover:text-white"><SkipForward size={20} /></button>
            <button 
              onClick={cycleRepeatMode} 
              className={cn('text-zinc-400 hover:text-white', { 'text-primary hover:text-primary/80': repeatMode !== 'none' })}
            >
              {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full mt-2">
            <span className="text-xs text-zinc-400">{formatTime(isDisplayingRecent ? 0 : currentTime)}</span>
            <Slider 
              value={[isDisplayingRecent ? 0 : progress]}
              onValueChange={handleSliderChange}
              max={100} 
              step={1} 
              className="w-full" 
              disabled={!activeSong} 
            />
            <span className="text-xs text-zinc-400">
              {songToDisplay ? formatTime(songToDisplay.duration) : '0:00'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Popover open={isBluetoothMenuOpen} onOpenChange={setIsBluetoothMenuOpen}>
              <PopoverTrigger asChild>
                  <button className={cn('text-zinc-400 hover:text-white', { 'text-primary': connectedDevice, 'text-destructive': bluetoothError })}>
                      <Bluetooth size={20} />
                  </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none bg-transparent mb-2" side="top" align="end">
                  <BluetoothMenu 
                      onConnect={handleBluetoothConnect}
                      onClose={() => setIsBluetoothMenuOpen(false)}
                      connectedDeviceName={connectedDevice}
                      error={bluetoothError}
                      isLoading={isConnecting}
                  />
              </PopoverContent>
          </Popover>
          <button className="text-zinc-400 hover:text-white"><Mic2 size={20} /></button>
          <button className="text-zinc-400 hover:text-white"><LayoutList size={20} /></button>
          <div className="flex items-center gap-2 w-[120px]">
            <button className="text-zinc-400 hover:text-white" onClick={() => setVolume(volume > 0 ? 0 : 50)}>
                <VolumeIcon size={20}/>
            </button>
            <Slider value={[volume]} onValueChange={([value]) => setVolume(value)} max={100} step={1} className="w-full" />
          </div>
          <button onClick={handleMaximize} className="text-zinc-400 hover:text-white"><Maximize2 size={20} /></button>
        </div>
      </div>

      {/* Mobile Player */}
      <div className="lg:hidden h-full flex flex-col justify-center px-2 py-1">
        <div className="flex items-center">
            {songToDisplay ? (
              <Link href={`/track/${songToDisplay.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Image 
                  src={songToDisplay.image || 'https://placehold.co/48x48.png'} 
                  data-ai-hint="album cover" 
                  alt="Album cover" 
                  width={48} 
                  height={48} 
                  className="rounded" 
                />
                <div className="min-w-0">
                  <p className="font-semibold truncate text-sm">{songToDisplay.title}</p>
                  <p className="text-xs text-zinc-400 truncate">{songToDisplay.artist}</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-[48px] h-[48px] bg-zinc-800 rounded"></div>
                <div>
                  <p className="font-semibold text-sm">No song selected</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pl-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="text-white p-1">
                            <VolumeIcon size={24} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 bg-zinc-800 border-zinc-700 text-white mb-2" side="top" align="center">
                        <Slider value={[volume]} onValueChange={([value]) => setVolume(value)} max={100} step={1} />
                    </PopoverContent>
                </Popover>
                {songToDisplay && (
                    <button onClick={() => toggleLikeSong(songToDisplay)} className="text-white p-1">
                        <Heart size={24} className={cn('transition', { 'fill-primary text-primary': isLiked(songToDisplay.id) })} />
                    </button>
                )}
               <button onClick={handlePlayPause} disabled={!songToDisplay} className="text-white p-1 disabled:opacity-50">
                 {isPlaying ? <Pause size={28} className="fill-white" /> : <Play size={28} className="fill-white" />}
               </button>
            </div>
        </div>
         <div className="w-full px-1 mt-1">
           <Slider 
              value={[isDisplayingRecent ? 0 : progress]}
              onValueChange={handleSliderChange}
              max={100} 
              step={1} 
              disabled={!activeSong} 
            />
        </div>
      </div>

      {isClient && <YouTube
        videoId={activeSong?.id}
        opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }}
        onReady={handleReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnd={handleEnd}
        className="absolute -z-10 opacity-0"
      />}
    </div>
  );
}
