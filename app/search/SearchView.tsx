'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { YugiohCard, SearchFilters } from '@/lib/types';
import { api } from '@/lib/api';
import { preferences, searchHistory } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import CardGrid from '@/components/CardGrid';
import Pagination from '@/components/Pagination';

export default function SearchView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [cardsPerPage, setCardsPerPage] = useState(20);

  // Initialize from URL params and preferences
  useEffect(() => {
    const prefs = preferences.get();
    setCardsPerPage(prefs.cardsPerPage);

    const urlQuery = searchParams.get('q') || '';
    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlFilters: SearchFilters = {};
    
    if (searchParams.get('type')) urlFilters.type = searchParams.get('type')!;
    if (searchParams.get('race')) urlFilters.race = searchParams.get('race')!;
    if (searchParams.get('attribute')) urlFilters.attribute = searchParams.get('attribute')!;
    if (searchParams.get('level')) urlFilters.level = parseInt(searchParams.get('level')!);
    if (searchParams.get('archetype')) urlFilters.archetype = searchParams.get('archetype')!;

    setCurrentQuery(urlQuery);
    setCurrentFilters(urlFilters);
    setCurrentPage(urlPage);
    
    if (urlQuery || Object.keys(urlFilters).length > 0) {
      performSearch(urlQuery, urlFilters, urlPage);
    }
  }, [searchParams]);

  const updateURL = useCallback((query: string, filters: SearchFilters, page = 1) => {
    const params = new URLSearchParams();
    
    if (query) params.set('q', query);
    if (filters.type) params.set('type', filters.type);
    if (filters.race) params.set('race', filters.race);
    if (filters.attribute) params.set('attribute', filters.attribute);
    if (filters.level) params.set('level', filters.level.toString());
    if (filters.archetype) params.set('archetype', filters.archetype);
    if (page > 1) params.set('page', page.toString());

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.push(newURL, { scroll: false });
  }, [router]);

  const performSearch = async (query: string, filters: SearchFilters, page = 1) => {
    // Only search if there is a query or if filters are applied
    if (!query.trim() && Object.keys(filters).length === 0) {
        setCards([]);
        setTotalCards(0);
        setTotalPages(1);
        setError(null);
        setLoading(false);
        return;
    }

    try {
      setLoading(true);
      setError(null);
      setCurrentPage(page);

      const searchParams: SearchFilters = { ...filters };
      if (query.trim()) {
        searchParams.name = query.trim();
      }

      const result = await api.searchCards(searchParams, page, cardsPerPage);
      
      setCards(result.cards);
      setTotalCards(result.total);
      setTotalPages(Math.max(1, Math.ceil(result.total / cardsPerPage)));

      if (page === 1 && query.trim()) {
        searchHistory.add(query.trim(), filters);
      }

      if (page === 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setCards([]);
      setTotalCards(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  // Handles real-time input changes from the SearchBar
  const handleQueryChange = (query: string) => {
    setCurrentQuery(query);
  };
  
  // Triggers when the search form is submitted
  const handleSearchSubmit = () => {
    updateURL(currentQuery, currentFilters, 1);
    performSearch(currentQuery, currentFilters, 1);
  };
  
  // Triggers when a filter is changed in the FilterPanel
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setCurrentFilters(newFilters);
    updateURL(currentQuery, newFilters, 1);
    performSearch(currentQuery, newFilters, 1);
  };
  
  // Triggers when an item is selected from search history
  const handleHistorySelect = (query: string, filters: SearchFilters) => {
    setCurrentQuery(query);
    setCurrentFilters(filters);
    updateURL(query, filters, 1);
    performSearch(query, filters, 1);
  };

  const handlePageChange = (page: number) => {
    updateURL(currentQuery, currentFilters, page);
    performSearch(currentQuery, currentFilters, page);
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Search Yu-Gi-Oh! Cards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover cards by name, type, attribute, and more. Use filters to narrow down your search.
        </p>
      </div>

      {/* SearchBar is now a controlled component */}
      <SearchBar
        query={currentQuery}
        onQueryChange={handleQueryChange}
        onSearch={handleSearchSubmit}
        onHistorySelect={handleHistorySelect}
        loading={loading}
        showFilters={true}
        onToggleFilters={toggleFilters}
        filtersOpen={filtersOpen}
      />

      <FilterPanel
        onFiltersChange={handleFiltersChange}
        filters={currentFilters}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      {!loading && totalCards > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Found {totalCards.toLocaleString()} cards
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Cards per page:
            </label>
            <select
              value={cardsPerPage}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setCardsPerPage(newLimit);
                preferences.set({ cardsPerPage: newLimit });
                // Refetch with new page limit, starting from page 1
                updateURL(currentQuery, currentFilters, 1);
                performSearch(currentQuery, currentFilters, 1);
              }}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={12}>12</option>
              <option value={20}>20</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>
      )}

      <CardGrid
        cards={cards}
        loading={loading}
        error={error}
        showViewToggle={true}
        emptyMessage={
          (currentQuery || Object.keys(currentFilters).length > 0) && !loading
            ? "No cards match your search criteria"
            : "Start typing to search for cards"
        }
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showInfo={true}
          totalItems={totalCards}
          itemsPerPage={cardsPerPage}
        />
      )}

      {cards.length === 0 && !loading && !error && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Search Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
            <li>• Try searching for card names like "Blue-Eyes White Dragon"</li>
            <li>• Use filters to narrow your search by type, attribute, or level</li>
            <li>• Search for archetypes like "Dark Magician" or "Elemental HERO"</li>
            <li>• Browse by card types: Monster, Spell, or Trap cards</li>
          </ul>
        </div>
      )}
    </div>
  );
}