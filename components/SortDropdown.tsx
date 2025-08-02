'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ options, value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = options.find(opt => opt.value === value)?.label || 'Sort by...';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        <span>
          <span className="text-gray-500 dark:text-gray-400">Sort by: </span>
          {currentLabel}
        </span>
        <ChevronDown 
          size={16} 
          className={`ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600 z-10 animate-fadeIn">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  option.value === value
                    ? 'font-semibold text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700'
                    : 'text-gray-700 dark:text-gray-300'
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}