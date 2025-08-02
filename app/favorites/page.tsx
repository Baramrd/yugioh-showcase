'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, Trash2 } from 'lucide-react';
import { YugiohCard } from '@/lib/types';
import { api } from '@/lib/api';
import { favorites } from '@/lib/storage';
import CardGrid from '@/components/CardGrid';

export default function FavoritesPage() {
  const [favoriteCards, setFavoriteCards] = useState<YugiohCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const favIds = favorites.get();
      setFavoriteIds(favIds);

      if (favIds.length === 0) {
        setFavoriteCards([]);
        return;
      }

      const cards = await api.getCardsByIds(favIds);
      
      // Sort cards to match the order of favorite IDs (most recently added first)
      const sortedCards = favIds
        .map(id => cards.find(card => card.id === id))
        .filter((card): card is YugiohCard => card !== undefined);

      setFavoriteCards(sortedCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
      setFavoriteCards([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
      favorites.clear();
      setFavoriteCards([]);
      setFavoriteIds([]);
    }
  };

  const exportFavorites = () => {
    if (favoriteCards.length === 0) return;

    const data = favoriteCards.map(card => ({
      id: card.id,
      name: card.name,
      type: card.type,
      race: card.race,
      attribute: card.attribute,
      level: card.level,
      atk: card.atk,
      def: card.def,
      archetype: card.archetype
    }));

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `yugioh-favorites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Heart className="text-red-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Favorite Cards
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {favoriteIds.length > 0 
            ? `You have ${favoriteIds.length} favorite card${favoriteIds.length !== 1 ? 's' : ''} saved`
            : 'Start building your collection by adding cards to favorites'
          }
        </p>
      </div>

      {/* Action Bar */}
      {favoriteIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Heart size={16} className="text-red-500" />
            <span>{favoriteIds.length} favorite card{favoriteIds.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportFavorites}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Export List
            </button>
            <button
              onClick={clearAllFavorites}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-1"
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      )}

      {/* Favorite Cards Grid */}
      <CardGrid
        cards={favoriteCards}
        loading={loading}
        error={error}
        showViewToggle={true}
        emptyMessage="No favorite cards yet"
      />

      {/* Empty State */}
      {favoriteIds.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Heart size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring and click the heart icon on cards you like to add them to your favorites.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Search size={18} className="mr-2" />
              Start Exploring Cards
            </Link>
          </div>
        </div>
      )}

      {/* Tips for managing favorites */}
      {favoriteIds.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Managing Your Favorites
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Click the heart icon on any card to add or remove it from favorites</li>
            <li>• Your favorites are saved locally in your browser session</li>
            <li>• Export your list to save it permanently or share with others</li>
            <li>• Use the view toggle to switch between grid and list layouts</li>
          </ul>
        </div>
      )}
    </div>
  );
}