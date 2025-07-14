
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AuthProvider } from '@/components/layout/auth-provider';
import { usePlayer } from '@/hooks/use-player';
import Sidebar from '@/components/layout/sidebar';
import Player from '@/components/layout/player';
import MobileNav from '@/components/layout/mobile-nav';
import { getCurrentUser } from '@/app/actions/auth';
import { getUserData } from '@/app/actions/user';
import NowPlayingSidebar from './now-playing-sidebar';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const { setLikedSongs, setRecentSongs, setPlaylists } = usePlayer();

  // Effect to check for an existing session on initial load
  useEffect(() => {
    const checkUser = async () => {
      // Don't run if user is already set (e.g., by login page)
      if (user) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to check for current user:", error);
        // If there's an error (e.g., DB connection, missing env vars),
        // we'll assume the user is not logged in.
        setUser(null);
      } finally {
        // CRITICAL: Always set loading to false to prevent getting stuck.
        setIsLoading(false);
      }
    };
    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to fetch user-specific data when user object changes (login/logout)
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { likedSongs, recentSongs, playlists } = await getUserData();
        setLikedSongs(likedSongs);
        setRecentSongs(recentSongs);
        setPlaylists(playlists);
      } else {
        // Clear data on logout
        setLikedSongs([]);
        setRecentSongs([]);
        setPlaylists([]);
      }
    };
    fetchUserData();
  }, [user, setLikedSongs, setRecentSongs, setPlaylists]);


  // Effect for route protection
  useEffect(() => {
    const authRoutes = ['/login', '/signup'];
    if (!isLoading && !user && !authRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);


  if (isLoading) {
    // You can replace this with a proper loading spinner component
    return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;
  }

  const authRoutes = ['/login', '/signup'];
  if (!user || authRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <aside className="hidden md:flex md:w-72 md:flex-shrink-0 p-2">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-y-auto md:py-2 md:pr-2 xl:pr-0 pb-[136px] md:pb-[90px]">
        <div className="h-full w-full rounded-lg bg-zinc-900">
            {children}
        </div>
      </main>
      <aside className="hidden xl:flex w-[350px] flex-shrink-0 p-2">
          <NowPlayingSidebar />
      </aside>
      <Player />
      <MobileNav />
    </div>
  );
}


export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
