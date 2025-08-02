'use client';

import { useState, useEffect } from 'react';
import { Grid, List, Loader } from 'lucide-react';
import { YugiohCard } from '@/lib/types';
import { preferences } from '@/lib/storage';
import CardItem from './CardItem';

interface CardGridProps {
  cards: YugiohCard[];
  loading?: boolean;
  error?: string | null;
  showViewToggle?: boolean;
  emptyMessage?: string;
}

export default function CardGrid({ 
  cards, 
  loading = false, 
  error = null, 
  showViewToggle = true,
  emptyMessage = "No cards found"
}: CardGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const prefs = preferences.get();
    setViewMode(prefs.viewMode);
  }, []);

  const toggleViewMode = () => {
    const newMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newMode);
    preferences.set({ viewMode: newMode });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Loader className="animate-spin" size={20} />
          <span>Loading cards...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Card not found
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            {emptyMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      {showViewToggle && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {cards.length} card{cards.length !== 1 ? 's' : ''} found
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleViewMode}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={toggleViewMode}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
          : 'space-y-4'
      }>
        {cards.map((card, index) => (
          <CardItem 
            key={card.id} 
            card={card} 
            viewMode={viewMode}
            isPriority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}