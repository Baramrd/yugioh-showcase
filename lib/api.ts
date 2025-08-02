import { YugiohCard, SearchFilters } from './types';
import { cache } from './storage';

const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const buildQueryParams = (filters: SearchFilters & { offset?: number; num?: number; sort?: string }) => {
  const params = new URLSearchParams();

  if (filters.name) params.append('fname', filters.name);
  if (filters.type) params.append('type', filters.type);
  if (filters.race) params.append('race', filters.race);
  if (filters.attribute) params.append('attribute', filters.attribute);
  if (filters.level) params.append('level', filters.level.toString());
  if (filters.archetype) params.append('archetype', filters.archetype);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.level) params.append('level', String(filters.level));
  if (filters.atk) params.append('atk', String(filters.atk));
  if (filters.def) params.append('def', String(filters.def));

  // This check is more robust and ensures both params are valid numbers.
  if (typeof filters.offset === 'number' && typeof filters.num === 'number') {
    params.append('offset', filters.offset.toString());
    params.append('num', filters.num.toString());
  }

  return params.toString();
};

export const api = {
  async searchCards(
    filters: SearchFilters, 
    page = 1, 
    limit = 20, 
    sort = 'name' // Default sort by name
  ): Promise<{ cards: YugiohCard[]; total: number }> {
    const offset = (page - 1) * limit;
    // Pass the sort parameter when building the query
    const queryParams = buildQueryParams({ ...filters, offset, num: limit, sort });
    const cacheKey = `search-${queryParams}`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const url = queryParams ? `${BASE_URL}?${queryParams}` : BASE_URL;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) return { cards: [], total: 0 };
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      const result = {
        cards: data.data || [],
        total: data.meta?.total_rows || data.data?.length || 0
      };

      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch cards');
    }
  },

  async getCardById(id: number): Promise<YugiohCard | null> {
    const cacheKey = `card-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${BASE_URL}?id=${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      const card = data.data?.[0] || null;

      if (card) cache.set(cacheKey, card);
      return card;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch card');
    }
  },

  async getRandomCards(count = 10): Promise<YugiohCard[]> {
    try {
      const offset = Math.floor(Math.random() * 14000);
      const response = await fetch(`${BASE_URL}?offset=${offset}&num=${count}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch random cards');
    }
  },

  async getCardsByIds(ids: number[]): Promise<YugiohCard[]> {
    if (ids.length === 0) return [];

    const cacheKey = `cards-${ids.sort().join(',')}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const promises = ids.map(id => api.getCardById(id));
      const results = await Promise.allSettled(promises);

      const cards = results
        .filter((result): result is PromiseFulfilledResult<YugiohCard | null> =>
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value as YugiohCard);

      cache.set(cacheKey, cards);
      return cards;
    } catch (error) {
      throw new ApiError('Failed to fetch cards by IDs');
    }
  }
};