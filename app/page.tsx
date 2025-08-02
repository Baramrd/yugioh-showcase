'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { YugiohCard } from '@/lib/types';
import { api } from '@/lib/api';
import { preferences, favorites } from '@/lib/storage';
import CardGrid from '@/components/CardGrid';

export default function HomePage() {
  const [featuredCards, setFeaturedCards] = useState<YugiohCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [favoriteCount, setFavoriteCount] = useState(0);

const allMonsterRaces = [
  'Aqua',
  'Beast',
  'Beast-Warrior',
  'Creator God',
  'Cyberse',
  'Dinosaur',
  'Divine-Beast',
  'Dragon',
  'Fairy',
  'Fiend',
  'Fish',
  'Illusion',
  'Insect',
  'Machine',
  'Plant',
  'Psychic',
  'Pyro',
  'Reptile',
  'Rock',
  'Sea Serpent',
  'Spellcaster',
  'Thunder',
  'Warrior',
  'Winged Beast',
  'Wyrm',
  'Zombie'
];

  const monsterQueryString = `race=${encodeURIComponent(allMonsterRaces.join(','))}`;

  useEffect(() => {
    const prefs = preferences.get();
    setShowWelcome(prefs.showWelcome);
    
    // Update favorite count
    const favs = favorites.get();
    setFavoriteCount(favs.length);

    // Load featured cards
    loadFeaturedCards();
  }, []);

  const loadFeaturedCards = async () => {
    try {
      setLoading(true);
      const cards = await api.getRandomCards(12);
      setFeaturedCards(cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    preferences.set({ showWelcome: false });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-primary text-white rounded-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome to Yu-Gi-Oh! Showcase
                </h1>
                <p className="text-lg opacity-90 mb-4">
                  Discover, explore, and collect your favorite Yu-Gi-Oh! trading cards
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/search"
                    className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Search size={18} className="mr-2" />
                    Start Searching
                  </Link>
                  <Link
                    href="/favorites"
                    className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Heart size={18} className="mr-2" />
                    My Favorites ({favoriteCount})
                  </Link>
                </div>
              </div>
              <button
                onClick={dismissWelcome}
                className="text-white/70 hover:text-white text-2xl leading-none"
                title="Dismiss welcome message"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="w-full h-full bg-white rounded-full transform translate-x-20 -translate-y-20"></div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/explore" className="block">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full 
                       transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-500 
                       hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Search className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Explore Cards
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Search through thousands of Yu-Gi-Oh! cards
                </p>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <Heart className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Save Favorites
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep track of your favorite cards ({favoriteCount})
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Discover New
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Find new cards and expand your collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cards Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Cards
            </h2>
          </div>
          <button
            onClick={loadFeaturedCards}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <CardGrid
          cards={featuredCards}
          loading={loading}
          error={error}
          showViewToggle={true}
          emptyMessage="No featured cards available"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/search"
            className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <Search className="text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Search Cards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find specific cards</p>
          </Link>

          <Link
            href={`/search?${monsterQueryString}`}
            className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors"
          >
            <div className="w-6 h-6 bg-orange-500 rounded mb-2 group-hover:scale-110 transition-transform"></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Monster Cards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Browse monsters</p>
          </Link>

          <Link
            href="/search?type=Spell Card"
            className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors"
          >
            <div className="w-6 h-6 bg-green-500 rounded mb-2 group-hover:scale-110 transition-transform"></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Spell Cards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Browse spells</p>
          </Link>

          <Link
            href="/search?type=Trap Card"
            className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
          >
            <div className="w-6 h-6 bg-purple-500 rounded mb-2 group-hover:scale-110 transition-transform"></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Trap Cards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Browse traps</p>
          </Link>
        </div>
      </div>
    </div>
  );
}