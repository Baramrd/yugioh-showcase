'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Heart, Star, Zap } from 'lucide-react';
import { YugiohCard } from '@/lib/types';
import { favorites } from '@/lib/storage';

interface CardItemProps {
  card: YugiohCard;
  viewMode?: 'grid' | 'list';
  isPriority?: boolean;
}

export default function CardItem({ 
  card, 
  viewMode = 'grid',
  isPriority = false
}: CardItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const favs = favorites.get();
    setIsFavorite(favs.includes(card.id));
  }, [card.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favorites.toggle(card.id);
    setIsFavorite(!isFavorite);
  };

  const getTypeColor = (type: string) => {
    if (type.includes('Monster')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    if (type.includes('Spell')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (type.includes('Trap')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getAttributeIcon = (attribute?: string) => {
    switch (attribute?.toLowerCase()) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'fire': return '🔥';
      case 'water': return '💧';
      case 'earth': return '🌍';
      case 'wind': return '💨';
      case 'divine': return '✨';
      default: return null;
    }
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/card/${card.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
          <div className="flex space-x-4">
            {/* Card Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-28 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                {!imageError ? (
                  <Image
                    src={card.card_images[0]?.image_url_small || '/placeholder-card.png'}
                    alt={card.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    priority={isPriority}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {card.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(card.type)}`}>
                      {card.type}
                    </span>
                    {card.attribute && (
                      <span className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>{getAttributeIcon(card.attribute)}</span>
                        <span>{card.attribute}</span>
                      </span>
                    )}
                  </div>

                  {card.level && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Level {card.level}
                      </span>
                    </div>
                  )}

                  {(card.atk !== undefined || card.def !== undefined) && (
                    <div className="flex items-center space-x-4 mt-1">
                      {card.atk !== undefined && (
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          ATK: {card.atk}
                        </span>
                      )}
                      {card.def !== undefined && (
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          DEF: {card.def}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {card.desc}
                  </p>
                </div>

                <button
                  onClick={toggleFavorite}
                  className={`ml-2 p-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/card/${card.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
        {/* Card Image */}
        <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-700">
          {!imageError ? (
            <Image
              src={card.card_images[0]?.image_url_small || '/placeholder-card.png'}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              priority={isPriority}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>No Image</span>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite 
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Type Badge */}
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${getTypeColor(card.type)}`}>
              {card.type.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm">
            {card.name}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span className="truncate">{card.race}</span>
            {card.attribute && (
              <span className="flex items-center space-x-1">
                <span>{getAttributeIcon(card.attribute)}</span>
                <span>{card.attribute}</span>
              </span>
            )}
          </div>

          {card.level && (
            <div className="flex items-center space-x-1 mb-2">
              <Star size={12} className="text-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Lv.{card.level}
              </span>
            </div>
          )}

          {(card.atk !== undefined || card.def !== undefined) && (
            <div className="flex justify-between text-xs font-medium">
              {card.atk !== undefined && (
                <span className="text-red-600 dark:text-red-400">ATK: {card.atk}</span>
              )}
              {card.def !== undefined && (
                <span className="text-blue-600 dark:text-blue-400">DEF: {card.def}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}