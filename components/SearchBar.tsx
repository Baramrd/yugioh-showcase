'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Filter } from 'lucide-react';
import { SearchFilters } from '@/lib/types';
import { searchHistory } from '@/lib/storage';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onHistorySelect: (query: string, filters: SearchFilters) => void;
  loading?: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersOpen?: boolean;
}

export default function SearchBar({ 
  query,
  
  onQueryChange,
  onSearch,
  onHistorySelect,
  loading = false, 
  showFilters = true,
  onToggleFilters,
  filtersOpen = false
}: SearchBarProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(searchHistory.get());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
    setShowHistory(false);
    setHistory(searchHistory.get());
  };

  const handleHistoryClick = (historyItem: any) => {
    onHistorySelect(historyItem.query, historyItem.filters || {});
    setShowHistory(false);
  };
  
  const handleClearQuery = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    searchHistory.clear();
    setHistory([]);
    setShowHistory(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <input
              ref={inputRef}
              type="text"
              value={query} // Controlled by parent
              onChange={(e) => onQueryChange(e.target.value)} // Reports changes to parent
              onFocus={() => setShowHistory(true)}
              placeholder="Search for Yu-Gi-Oh! cards..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex">
            {showFilters && (
              <button
                type="button"
                onClick={onToggleFilters}
                className={`px-4 py-3 border-t border-b border-gray-300 dark:border-gray-600 transition-colors ${
                  filtersOpen
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-400 dark:hover:bg-gray-500'
                }`}
                title="Toggle filters"
              >
                <Filter size={20} />
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Search History Dropdown */}
      {showHistory && history.length > 0 && (
        <div
          ref={historyRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Recent Searches
            </span>
            <button
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear All
            </button>
          </div>
          
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(item)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 group"
            >
              <Clock size={14} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {item.query}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}