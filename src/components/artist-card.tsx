
'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Artist } from '@/lib/data';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/search?q=${encodeURIComponent(artist.name)}`);
  };

  return (
    <div onClick={handleClick} className="w-36 flex-shrink-0 cursor-pointer group flex flex-col items-center gap-2 text-center">
      <div className="w-32 h-32 relative">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          sizes="128px"
          className="rounded-full object-cover group-hover:opacity-80 transition"
          data-ai-hint={artist.hint || "artist portrait"}
        />
      </div>
      <p className="text-sm font-semibold text-white mt-2 truncate w-full">{artist.name}</p>
      <p className="text-xs text-zinc-400">Artist</p>
    </div>
  );
}
