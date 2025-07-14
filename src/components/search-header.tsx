
'use client';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SearchHeader({ query }: { query: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => router.back()} variant="ghost" size="icon" className="bg-black/40 rounded-full">
          <ChevronLeft />
        </Button>
        <Button onClick={() => router.forward()} variant="ghost" size="icon" className="bg-black/40 rounded-full">
          <ChevronRight />
        </Button>
      </div>
      <form className="flex-grow">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="What do you want to listen to?"
            className="pl-12 bg-zinc-700 border-none rounded-full h-12 text-sm focus:ring-1 focus:ring-white"
          />
        </div>
      </form>
    </div>
  )
}
