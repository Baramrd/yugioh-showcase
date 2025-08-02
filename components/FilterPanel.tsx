'use client';

import { X, RotateCcw } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface FilterPanelProps {
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
  isOpen: boolean;
  onClose: () => void;
}

const CARD_TYPES = [
  'Normal Monster', 'Normal Tuner Monster', 'Effect Monster', 'Tuner Monster', 'Flip Monster', 'Flip Effect Monster', 'Spirit Monster', 'Union Effect Monster', 'Gemini Monster', 'Toon Monster', 'Ritual Monster', 'Ritual Effect Monster',
  'Pendulum Monster', 'Pendulum Normal Monster', 'Pendulum Effect Monster', 'Pendulum Effect Ritual Monster', 'Pendulum Tuner Effect Monster', 'Pendulum Flip Effect Monster', 'Pendulum Effect Fusion Monster', 
  'Fusion Monster', 'Synchro Monster', 'Synchro Tuner Monster',
  'Synchro Pendulum Effect Monster', 'XYZ Monster', 'XYZ Pendulum Effect Monster', 'Link Monster', 'Spell Card', 'Trap Card', 'Skill Card', 'Token'
];

const ATTRIBUTES = [
  'DARK', 'EARTH', 'FIRE', 'LIGHT', 'WATER', 'WIND', 'DIVINE'
];

const RACES = [
  'Aqua', 'Beast', 'Beast-Warrior', 'Creator God', 'Cyberse', 'Dinosaur',
  'Divine-Beast', 'Dragon', 'Fairy', 'Fiend', 'Fish', 'Illusion', 'Insect', 'Machine', 'Plant', 
  'Psychic','Pyro', 'Reptile', 'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'
];

export default function FilterPanel({ 
  onFiltersChange, 
  filters = {},
  isOpen, 
  onClose 
}: FilterPanelProps) {

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-6 mt-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Search Filters
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            {CARD_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Attribute */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attribute
          </label>
          <select
            value={filters.attribute || ''}
            onChange={(e) => updateFilter('attribute', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Attributes</option>
            {ATTRIBUTES.map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
        </div>

        {/* Race/Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Race/Type
          </label>
          <select
            value={filters.race || ''}
            onChange={(e) => updateFilter('race', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Races</option>
            {RACES.map(race => (
              <option key={race} value={race}>{race}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Level
          </label>
          <select
            value={filters.level || ''}
            onChange={(e) => updateFilter('level', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Any Level</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Archetype */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Archetype
        </label>
        <input
          type="text"
          value={filters.archetype || ''}
          onChange={(e) => updateFilter('archetype', e.target.value)}
          placeholder="e.g., Blue-Eyes, Dark Magician, Elemental HERO"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
            Active Filters:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                >
                  {key}: {value}
                  <button
                    onClick={() => updateFilter(key as keyof SearchFilters, undefined)}
                    className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}