'use client';

import { Home, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mobileRoutes = [
  {
    icon: Home,
    label: 'Home',
    href: '/',
  },
  {
    icon: Search,
    label: 'Search',
    href: '/search',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-20 h-16">
      <nav className="flex justify-around items-center h-full">
        {mobileRoutes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-xs font-medium transition text-zinc-400 hover:text-white w-full h-full',
              pathname === route.href && 'text-white'
            )}
          >
            <route.icon size={24} />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
