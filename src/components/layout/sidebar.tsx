
'use client';

import { Home, Search, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Library from './recent-songs-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';

const mainRoutes = [
  {
    icon: Home,
    label: 'Home',
    active: (pathname: string) => pathname === '/',
    href: '/',
  },
  {
    icon: Search,
    label: 'Search',
    active: (pathname: string) => pathname === '/search',
    href: '/search',
  },
  {
    icon: Settings,
    label: 'Settings',
    active: (pathname: string) => pathname === '/settings',
    href: '/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full w-full gap-y-2">
      <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
        {mainRoutes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={cn(
              'flex items-center gap-x-4 text-sm font-medium cursor-pointer hover:text-white transition text-zinc-400',
              route.active(pathname) && 'text-white'
            )}
          >
            <route.icon size={24} />
            {route.label}
          </Link>
        ))}
         <Button onClick={handleLogout} variant="ghost" className="w-full justify-start p-0 h-auto text-zinc-400 hover:text-white font-medium">
            <div className="flex items-center gap-x-4">
                <LogOut size={24} />
                Logout
            </div>
        </Button>
        <div className="text-xs text-zinc-500 truncate pt-2 border-t border-zinc-800">
            Logged in as: {user?.name}
        </div>
      </div>
      <Library />
    </div>
  );
}
