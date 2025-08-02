'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { YugiohCard, SearchFilters } from '@/lib/types';
import { api } from '@/lib/api';
import { preferences } from '@/lib/storage';
import FilterPanel from '@/components/FilterPanel';
import CardGrid from '@/components/CardGrid';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';
import { Filter } from 'lucide-react';

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'atk', label: 'ATK (Low to High)' },
  { value: 'def', label: 'DEF (Low to High)' },
  { value: 'new', label: 'Release Date (Newest)' },
];

const monsterSortKeys = ['atk', 'def'];

const allMonsterRaces = [
  'Aqua', 'Beast', 'Beast-Warrior', 'Creator God', 'Cyberse', 'Dinosaur',
  'Divine-Beast', 'Dragon', 'Fairy', 'Fiend', 'Fish', 'Illusion', 'Insect', 'Machine', 'Plant', 
  'Psychic','Pyro', 'Reptile', 'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'
].join(',');

export default function ExploreView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [currentSort, setCurrentSort] = useState('name');
  const [cardsPerPage, setCardsPerPage] = useState(20);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentSort !== 'name') params.set('sort', currentSort);
    if (currentPage > 1) params.set('page', currentPage.toString());
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    router.replace(`/explore?${params.toString()}`, { scroll: false });

    const fetchData = async () => {
      setLoading(true);
      try {
        setError(null);
        
        const effectiveFilters: SearchFilters = { ...currentFilters };

        if (monsterSortKeys.includes(currentSort) && !effectiveFilters.race && !effectiveFilters.type) {
          effectiveFilters.race = allMonsterRaces;
        }
        
        if (currentSort === 'atk') effectiveFilters.atk = 'gte0';
        if (currentSort === 'def') effectiveFilters.def = 'gte0';
        
        const result = await api.searchCards(
          effectiveFilters,
          currentPage,
          cardsPerPage,
          currentSort
        );
        
        setCards(result.cards);
        setTotalCards(result.total);
        setTotalPages(Math.max(1, Math.ceil(result.total / cardsPerPage)));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, currentFilters, currentSort, cardsPerPage, router]);

  useEffect(() => {
    const prefs = preferences.get();
    setCardsPerPage(prefs.cardsPerPage);

    const urlSort = searchParams.get('sort') || 'name';
    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlFilters: SearchFilters = {};
    if (searchParams.get('type')) urlFilters.type = searchParams.get('type')!;
    if (searchParams.get('race')) urlFilters.race = searchParams.get('race')!;
    if (searchParams.get('attribute')) urlFilters.attribute = searchParams.get('attribute')!;
    if (searchParams.get('level')) urlFilters.level = parseInt(searchParams.get('level')!);
    if (searchParams.get('archetype')) urlFilters.archetype = searchParams.get('archetype')!;
    
    setCurrentSort(urlSort);
    setCurrentPage(urlPage);
    setCurrentFilters(urlFilters);
  }, []);

  const handleSortChange = (newSort: string) => {
    setCurrentPage(1); // Reset page on sort change
    setCurrentSort(newSort);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setCurrentPage(1); // Reset page on filter change
    setCurrentFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Explore All Cards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse, filter, and sort through the entire collection of Yu-Gi-Oh! cards.
        </p>
      </div>

      <FilterPanel
        onFiltersChange={handleFiltersChange}
        filters={currentFilters}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter size={16} />
          <span>{Object.values(currentFilters).filter(v => v).length > 0 ? 'Edit Filters' : 'Apply Filters'}</span>
        </button>
        
        <SortDropdown 
          options={sortOptions}
          value={currentSort}
          onChange={handleSortChange}
        />
      </div>

      <CardGrid
        cards={cards}
        loading={loading}
        error={error}
        emptyMessage="No cards match your filters."
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
    </div>
  );
}