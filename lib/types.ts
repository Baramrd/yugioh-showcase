export interface YugiohCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race: string;
  attribute?: string;
  archetype?: string;
  card_images: CardImage[];
  card_prices: CardPrice[];
  card_sets?: CardSet[];
}

export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface CardPrice {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

export interface SearchFilters {
  name?: string;
  type?: string;
  race?: string;
  attribute?: string;
  level?: number | string;
  atk?: number | string;
  def?: number | string;
  archetype?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  cardsPerPage: number;
  viewMode: 'grid' | 'list';
  showWelcome: boolean;
}

export interface SearchHistory {
  query: string;
  timestamp: number;
  filters: SearchFilters;
}