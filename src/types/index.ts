export type RatingLevel = 'disliked' | 'below_average' | 'average' | 'liked' | 'amazing';

export interface RatingEvaluation {
  level: RatingLevel;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradient: string;
  ringColor: string;
  hex: string;
  iconName: string;
}

export interface TastingCriteria {
  flavor: number; // 0 to 10
  texture: number; // 0 to 10
  value: number; // 0 to 10
  packaging: number; // 0 to 10
}

export interface CommunityVotes {
  count: number;
  totalScore: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  imageUrl: string;
  imageAlt?: string;
  barcode?: string;
  market: string;
  price?: number;
  weight?: string;
  tastingDate: string; // YYYY-MM-DD
  rating: number; // 0 to 10, step 0.5
  review: string;
  pros?: string[];
  cons?: string[];
  criteria?: TastingCriteria;
  wouldBuyAgain?: 'yes' | 'maybe' | 'no';
  tags?: string[];
  calories?: string;
  tiktokUrl?: string;
  communityVotes?: CommunityVotes;
  isDemo?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  itemCount?: number;
}

export interface AppSettings {
  siteTitle: string;
  siteTagline: string;
  tiktokUrl: string;
  tiktokHandle: string;
  creatorName: string;
  aboutText: string;
  adminPin?: string;
}

export type SortOption =
  | 'highest_rating'
  | 'lowest_rating'
  | 'newest'
  | 'oldest'
  | 'alphabetical_asc'
  | 'alphabetical_desc';

export interface ProductFilterState {
  searchQuery: string;
  category: string;
  market: string;
  brand: string;
  minRating: number;
  maxRating: number;
  sortBy: SortOption;
  onlyRecommended?: boolean;
}
