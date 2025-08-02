'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ArrowLeft, 
  Star, 
  Shield, 
  Sword, 
  Info, 
  Tag, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { YugiohCard } from '@/lib/types';
import { api } from '@/lib/api';
import { favorites } from '@/lib/storage';

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = parseInt(params.id as string);

  const [card, setCard] = useState<YugiohCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!cardId || isNaN(cardId)) {
      setError('Invalid card ID');
      setLoading(false);
      return;
    }

    loadCard();
    checkFavoriteStatus();
  }, [cardId]);

  const loadCard = async () => {
    try {
      setLoading(true);
      setError(null);
      const cardData = await api.getCardById(cardId);
      
      if (!cardData) {
        setError('Card not found');
        return;
      }

      setCard(cardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load card');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = () => {
    const favs = favorites.get();
    setIsFavorite(favs.includes(cardId));
  };

  const toggleFavorite = () => {
    favorites.toggle(cardId);
    setIsFavorite(!isFavorite);
  };

  const copyCardId = async () => {
    try {
      await navigator.clipboard.writeText(cardId.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy card ID');
    }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Card not found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The card you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyCardId}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>ID: {card.id}</span>
          </button>
          
          <button
            onClick={toggleFavorite}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {!imageError ? (
              <Image
                src={card.card_images[selectedImageIndex]?.image_url || '/placeholder-card.png'}
                alt={card.name}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">🃏</div>
                  <p>Image not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Multiple Images */}
          {card.card_images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {card.card_images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-20 relative rounded border-2 overflow-hidden transition-colors ${
                    selectedImageIndex === index
                      ? 'border-blue-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Image
                    src={image.image_url_small}
                    alt={`${card.name} variant ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {card.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(card.type)}`}>
                {card.type}
              </span>
              
              {card.race && (
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                  {card.race}
                </span>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {card.attribute && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-2xl">{getAttributeIcon(card.attribute)}</span>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Attribute</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{card.attribute}</div>
                </div>
              </div>
            )}

            {card.level && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Star className="text-yellow-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Level</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{card.level}</div>
                </div>
              </div>
            )}

            {card.atk !== undefined && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Sword className="text-red-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ATK</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{card.atk}</div>
                </div>
              </div>
            )}

            {card.def !== undefined && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="text-blue-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">DEF</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{card.def}</div>
                </div>
              </div>
            )}
          </div>

          {/* Archetype */}
          {card.archetype && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="text-blue-600 dark:text-blue-400" size={16} />
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Archetype</h3>
              </div>
              <p className="text-blue-800 dark:text-blue-400">{card.archetype}</p>
            </div>
          )}

          {/* Description */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="text-gray-600 dark:text-gray-400" size={16} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Description</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {card.desc}
            </p>
          </div>

          {/* Prices */}
          {card.card_prices[0] && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                Market Prices (USD)
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {card.card_prices[0].cardmarket_price && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Cardmarket:</span>
                    <span className="ml-2 font-medium text-green-700 dark:text-green-400">
                      ${card.card_prices[0].cardmarket_price}
                    </span>
                  </div>
                )}
                {card.card_prices[0].tcgplayer_price && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">TCGPlayer:</span>
                    <span className="ml-2 font-medium text-green-700 dark:text-green-400">
                      ${card.card_prices[0].tcgplayer_price}
                    </span>
                  </div>
                )}
                {card.card_prices[0].ebay_price && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">eBay:</span>
                    <span className="ml-2 font-medium text-green-700 dark:text-green-400">
                      ${card.card_prices[0].ebay_price}
                    </span>
                  </div>
                )}
                {card.card_prices[0].amazon_price && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Amazon:</span>
                    <span className="ml-2 font-medium text-green-700 dark:text-green-400">
                      ${card.card_prices[0].amazon_price}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Sets */}
      {card.card_sets && card.card_sets.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Available in Sets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {card.card_sets.slice(0, 6).map((set, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {set.set_name}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Code: {set.set_code}</div>
                  <div>Rarity: {set.set_rarity}</div>
                  {set.set_price && <div>Price: ${set.set_price}</div>}
                </div>
              </div>
            ))}
          </div>
          {card.card_sets.length > 6 && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              And {card.card_sets.length - 6} more sets...
            </p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          {card.archetype && (
            <Link
              href={`/search?archetype=${encodeURIComponent(card.archetype)}`}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <Tag size={16} />
              <span>More {card.archetype} cards</span>
            </Link>
          )}
          
          <Link
            href={`/search?type=${encodeURIComponent(card.type)}`}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span>More {card.type}s</span>
          </Link>

          {card.race && (
            <Link
              href={`/search?race=${encodeURIComponent(card.race)}`}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span>More {card.race} cards</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}