
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import AppShell from '@/components/layout/app-shell';

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Music Player',
  description: 'A YouTube music player with a Spotify-like interface.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-black font-sans antialiased',
          font.className
        )}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
