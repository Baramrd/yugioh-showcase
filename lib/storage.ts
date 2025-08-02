import { UserPreferences, SearchHistory } from './types';

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  cardsPerPage: 20,
  viewMode: 'grid',
  showWelcome: true,
};

// localStorage functions (persistent data)
export const preferences = {
  get: (): UserPreferences => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const stored = localStorage.getItem('yugioh-preferences');
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  set: (prefs: Partial<UserPreferences>) => {
    if (typeof window === 'undefined') return;
    try {
      const current = preferences.get();
      const updated = { ...current, ...prefs };
      localStorage.setItem('yugioh-preferences', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  },

  reset: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('yugioh-preferences');
  }
};

// sessionStorage functions (per-session data)
export const favorites = {
  get: (): number[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = sessionStorage.getItem('yugioh-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  add: (cardId: number) => {
    if (typeof window === 'undefined') return;
    try {
      const current = favorites.get();
      if (!current.includes(cardId)) {
        const updated = [...current, cardId];
        sessionStorage.setItem('yugioh-favorites', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  },

  remove: (cardId: number) => {
    if (typeof window === 'undefined') return;
    try {
      const current = favorites.get();
      const updated = current.filter(id => id !== cardId);
      sessionStorage.setItem('yugioh-favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },

  toggle: (cardId: number) => {
    const current = favorites.get();
    if (current.includes(cardId)) {
      favorites.remove(cardId);
    } else {
      favorites.add(cardId);
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('yugioh-favorites');
  }
};

export const searchHistory = {
  get: (): SearchHistory[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = sessionStorage.getItem('yugioh-search-history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  add: (query: string, filters: any = {}) => {
    if (typeof window === 'undefined') return;
    try {
      const current = searchHistory.get();
      const newEntry: SearchHistory = {
        query,
        filters,
        timestamp: Date.now()
      };
      
      // Remove duplicate queries and keep only last 10
      const filtered = current.filter(item => item.query !== query);
      const updated = [newEntry, ...filtered].slice(0, 10);
      
      sessionStorage.setItem('yugioh-search-history', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add search history:', error);
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('yugioh-search-history');
  }
};

export const cache = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = sessionStorage.getItem(`yugioh-cache-${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (parsed.expiry && Date.now() > parsed.expiry) {
        sessionStorage.removeItem(`yugioh-cache-${key}`);
        return null;
      }
      
      return parsed.data;
    } catch {
      return null;
    }
  },

  set: (key: string, data: any, ttl = 5 * 60 * 1000) => { // 5 minutes default
    if (typeof window === 'undefined') return;
    try {
      const item = {
        data,
        expiry: Date.now() + ttl
      };
      sessionStorage.setItem(`yugioh-cache-${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(sessionStorage).filter(key => key.startsWith('yugioh-cache-'));
    keys.forEach(key => sessionStorage.removeItem(key));
  }
};