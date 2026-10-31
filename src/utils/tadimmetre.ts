import { Product, ProductFilterState, RatingEvaluation, RatingLevel } from '../types';

/**
 * Evaluates a score on Tadımmetre (0 to 10) according to user specifications:
 * - 0–3: Beğenilmedi
 * - 3.5–5: Ortalama altı
 * - 5.5–7: Ortalama
 * - 7.5–8.5: Beğenildi
 * - 9–10: Muhteşem
 */
export function evaluateRating(score: number): RatingEvaluation {
  const rounded = Math.round(score * 2) / 2; // enforce 0.5 step

  if (rounded <= 3.0) {
    return {
      level: 'disliked',
      label: 'Beğenilmedi',
      badgeBg: 'bg-red-50',
      badgeText: 'text-red-700',
      badgeBorder: 'border-red-200',
      gradient: 'from-red-500 to-rose-600',
      ringColor: 'stroke-red-500',
      hex: '#EF4444',
      iconName: 'ThumbsDown',
    };
  }

  if (rounded <= 5.0) {
    return {
      level: 'below_average',
      label: 'Ortalama Altı',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-700',
      badgeBorder: 'border-orange-200',
      gradient: 'from-orange-500 to-amber-600',
      ringColor: 'stroke-orange-500',
      hex: '#F97316',
      iconName: 'Frown',
    };
  }

  if (rounded <= 7.0) {
    return {
      level: 'average',
      label: 'Ortalama',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-750 text-amber-800',
      badgeBorder: 'border-amber-200',
      gradient: 'from-amber-400 to-yellow-500',
      ringColor: 'stroke-amber-500',
      hex: '#EAB308',
      iconName: 'Meh',
    };
  }

  if (rounded <= 8.5) {
    return {
      level: 'liked',
      label: 'Beğenildi',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      gradient: 'from-emerald-500 to-teal-600',
      ringColor: 'stroke-emerald-500',
      hex: '#10B981',
      iconName: 'ThumbsUp',
    };
  }

  return {
    level: 'amazing',
    label: 'Muhteşem',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-800 font-extrabold',
    badgeBorder: 'border-green-300',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    ringColor: 'stroke-green-500',
    hex: '#22C55E',
    iconName: 'Sparkles',
  };
}

/**
 * Format score cleanly (e.g. 8.0 -> "8", 8.5 -> "8.5")
 */
export function formatScore(score: number): string {
  const rounded = Math.round(score * 2) / 2;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

/**
 * Generate SEO-friendly URL slug
 */
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: 'c', Ç: 'c',
    ğ: 'g', Ğ: 'g',
    ı: 'i', I: 'i', İ: 'i',
    ö: 'o', Ö: 'o',
    ş: 's', Ş: 's',
    ü: 'u', Ü: 'u',
  };

  const replaced = text.split('').map(char => trMap[char] || char).join('');
  return replaced
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Filter & sort products
 */
export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilterState
): Product[] {
  const searchLower = filters.searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    // Search query matches title or brand or market
    if (searchLower) {
      const matchTitle = product.title.toLowerCase().includes(searchLower);
      const matchBrand = product.brand.toLowerCase().includes(searchLower);
      const matchMarket = product.market.toLowerCase().includes(searchLower);
      if (!matchTitle && !matchBrand && !matchMarket) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (product.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // Market filter
    if (filters.market && filters.market !== 'all') {
      if (product.market.toLowerCase() !== filters.market.toLowerCase()) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand && filters.brand !== 'all') {
      if (product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
    }

    // Rating range filter
    if (product.rating < filters.minRating || product.rating > filters.maxRating) {
      return false;
    }

    return true;
  });

  // Sorting
  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'highest_rating':
        return b.rating - a.rating || b.createdAt - a.createdAt;
      case 'lowest_rating':
        return a.rating - b.rating || b.createdAt - a.createdAt;
      case 'newest':
        return new Date(b.tastingDate).getTime() - new Date(a.tastingDate).getTime() || b.createdAt - a.createdAt;
      case 'oldest':
        return new Date(a.tastingDate).getTime() - new Date(b.tastingDate).getTime() || a.createdAt - b.createdAt;
      case 'alphabetical_asc':
        return a.title.localeCompare(b.title, 'tr');
      case 'alphabetical_desc':
        return b.title.localeCompare(a.title, 'tr');
      default:
        return b.createdAt - a.createdAt;
    }
  });
}

/**
 * Get rankings helpers
 */
export function getTopRated(products: Product[], limit = 10): Product[] {
  return [...products]
    .sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function getLowestRated(products: Product[], limit = 10): Product[] {
  return [...products]
    .sort((a, b) => a.rating - b.rating || b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function getNewestProducts(products: Product[], limit = 10): Product[] {
  return [...products]
    .sort((a, b) => new Date(b.tastingDate).getTime() - new Date(a.tastingDate).getTime() || b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function getTopByCategory(products: Product[]): Record<string, Product[]> {
  const result: Record<string, Product[]> = {};
  for (const product of products) {
    if (!result[product.category]) {
      result[product.category] = [];
    }
    result[product.category].push(product);
  }

  for (const cat in result) {
    result[cat].sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt);
  }

  return result;
}

export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}
