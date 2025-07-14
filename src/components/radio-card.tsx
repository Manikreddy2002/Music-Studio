'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Music, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface RadioCardProps {
  artist: {
    name: string;
    image: string;
    related: string;
  };
  bgColor: string; // This will now be a gradient class
}

export default function RadioCard({ artist, bgColor }: RadioCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/search?q=${encodeURIComponent(artist.name)}`);
  };
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(artist.name)}`);
  };

  return (
    <div onClick={handleClick} className="w-40 flex-shrink-0 cursor-pointer group">
      <Card className="border-none w-full aspect-square rounded-lg overflow-hidden relative">
        <Image
          src={artist.image || 'https://placehold.co/160x160.png'}
          alt={artist.name}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          data-ai-hint="artist portrait"
        />
        <div className={cn("absolute inset-0", bgColor)}></div>
        <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
                <Music size={20} className="opacity-70" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Radio</span>
            </div>
            <h3 className="font-bold text-xl truncate">{artist.name}</h3>
        </div>
         <Button 
            onClick={handlePlay}
            variant="default"
            size="icon"
            className="absolute bottom-3 right-3 bg-primary rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
           >
            <Play className="h-5 w-5 fill-black text-black" />
          </Button>
      </Card>
      <p className="text-sm text-zinc-400 mt-2 truncate">{artist.related}</p>
    </div>
  );
}
