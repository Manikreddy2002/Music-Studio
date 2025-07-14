
'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function HomeHeader() {
  const router = useRouter();
  return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="bg-black/40 rounded-full">
            <ChevronLeft />
          </Button>
          <Button onClick={() => router.forward()} variant="ghost" size="icon" className="bg-black/40 rounded-full">
            <ChevronRight />
          </Button>
        </div>
        <div>
          {/* Future user options here */}
        </div>
      </div>
  )
}
