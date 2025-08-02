'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, Home, Settings } from 'lucide-react';
import { preferences } from '@/lib/storage';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefs = preferences.get();
    setTheme(prefs.theme);
    document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    preferences.set({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">YG</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Yu-Gi-Oh! Showcase
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home size={16} />
              <span>Home</span>
            </Link>

            <Link
              href="/search"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/search') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Search size={16} />
              <span>Search</span>
            </Link>

            <Link
              href="/favorites"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/favorites') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart size={16} />
              <span>Favorites</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <div className="w-5 h-5 bg-gray-800 rounded-full"></div>
              ) : (
                <div className="w-5 h-5 bg-yellow-400 rounded-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}