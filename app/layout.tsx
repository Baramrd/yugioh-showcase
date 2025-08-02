import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yu-Gi-Oh! Card Showcase',
  description: 'Explore and discover Yu-Gi-Oh! trading cards with our comprehensive showcase platform.',
  keywords: ['Yu-Gi-Oh', 'trading cards', 'TCG', 'card game', 'showcase'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Yu-Gi-Oh! Card Showcase',
    description: 'Explore and discover Yu-Gi-Oh! trading cards',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}