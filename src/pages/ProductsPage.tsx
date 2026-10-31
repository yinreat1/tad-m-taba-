import React, { useState, useMemo, useEffect } from 'react';
import { Category, Product, ProductFilterState, SortOption } from '../types';
import { filterAndSortProducts } from '../utils/tadimmetre';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  X,
  Store,
  Tag,
  ArrowUpDown,
  RotateCcw,
  Layers,
  Heart,
  Sparkles,
  Award,
} from 'lucide-react';
import { getFavoriteProductIds, subscribeToDBChanges } from '../services/db';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  routeKey?: string;
  onSelectProduct: (slug: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  initialCategory = 'all',
  routeKey = '',
  onSelectProduct,
}) => {
  const [filters, setFilters] = useState<ProductFilterState>({
    searchQuery: '',
    category: initialCategory,
    market: 'all',
    brand: 'all',
    minRating: 0,
    maxRating: 10,
    sortBy: 'newest',
  });

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    // Keep the favorites shortcut in sync when navigation changes without remounting.
    const query = routeKey.includes('?') ? routeKey.slice(routeKey.indexOf('?') + 1) : window.location.search.slice(1);
    const params = new URLSearchParams(query);
    const legacyHashHasFavorites = window.location.hash.includes('filter=favorites');
    setShowOnlyFavorites(params.get('filter') === 'favorites' || legacyHashHasFavorites);
  }, [routeKey]);

  useEffect(() => {
    const updateFavs = () => {
      setFavoriteIds(getFavoriteProductIds());
    };
    updateFavs();
    const unsub = subscribeToDBChanges(updateFavs);
    return () => unsub();
  }, []);

  useEffect(() => {
    setFilters((current) => ({ ...current, category: initialCategory || 'all' }));
  }, [initialCategory]);

  // Extract unique markets and brands
  const markets = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.market) set.add(p.market);
    });
    return Array.from(set).sort();
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = filterAndSortProducts(products, filters);
    if (showOnlyFavorites) {
      list = list.filter((p) => favoriteIds.includes(p.id));
    }
    return list;
  }, [products, filters, showOnlyFavorites, favoriteIds]);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.market !== 'all' ||
    filters.brand !== 'all' ||
    filters.minRating > 0 ||
    filters.sortBy !== 'newest' ||
    showOnlyFavorites;

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      market: 'all',
      brand: 'all',
      minRating: 0,
      maxRating: 10,
      sortBy: 'newest',
    });
    setShowOnlyFavorites(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF5A1F] mb-1">
            <Layers className="w-4 h-4" />
            <span>Tadım Veritabanı</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            {showOnlyFavorites ? 'Denenecekler Listem' : 'Tüm Denenen Ürünler'}
          </h1>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Toplam <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> ürün listeleniyor
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Ürün adı, marka veya market ara..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              aria-label="Aramayı Temizle"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setShowOnlyFavorites(false);
            setFilters({ ...filters, category: 'all' });
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            !showOnlyFavorites && filters.category === 'all'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
          }`}
        >
          Tüm Kategoriler ({products.length})
        </button>

        {/* Favorites Filter Tab */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            showOnlyFavorites
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
          <span>Denenecekler ({favoriteIds.length})</span>
        </button>

        {categories.map((cat) => {
          const active = !showOnlyFavorites && (filters.category.toLowerCase() === cat.name.toLowerCase() || filters.category === cat.slug);
          const count = products.filter(
            (p) => p.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setShowOnlyFavorites(false);
                setFilters({ ...filters, category: cat.name });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar (Market, Brand, Sort, Reset) */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Market Select */}
          <div className="flex items-center gap-1.5 text-xs">
            <Store className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filters.market}
              onChange={(e) => setFilters({ ...filters, market: e.target.value })}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-bold text-stone-700 focus:outline-hidden focus:border-[#FF5A1F]"
              aria-label="Market Filtresi"
            >
              <option value="all">Tüm Marketler</option>
              {markets.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Select */}
          <div className="flex items-center gap-1.5 text-xs">
            <Tag className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-bold text-stone-700 focus:outline-hidden focus:border-[#FF5A1F]"
              aria-label="Marka Filtresi"
            >
              <option value="all">Tüm Markalar</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-stone-500">Tadımmetre:</span>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-bold text-stone-700 focus:outline-hidden"
              aria-label="Minimum Puan"
            >
              <option value="0">Tüm Puanlar (0-10)</option>
              <option value="7.5">Sadece Beğenilenler (7.5+)</option>
              <option value="9">Zirve Lezzetler (9.0+)</option>
            </select>
          </div>
        </div>

        {/* Right side: Sort Selector & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SortOption })}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-bold text-stone-700 focus:outline-hidden focus:border-[#FF5A1F]"
              aria-label="Sıralama Ölçütü"
            >
              <option value="newest">En Yeni İncelemeler</option>
              <option value="highest_rating">En Yüksek Puan (10 → 0)</option>
              <option value="lowest_rating">En Düşük Puan (0 → 10)</option>
              <option value="alphabetical_asc">İsim (A-Z)</option>
              <option value="alphabetical_desc">İsim (Z-A)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
              title="Filtreleri Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-[#171717]">
            {showOnlyFavorites ? 'Henüz Denenecekler Listeniz Boş' : products.length === 0 ? 'Henüz ürün incelemesi eklenmedi' : 'Ürün Bulunamadı'}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {showOnlyFavorites
              ? 'Beğendiğiniz veya denemek istediğiniz ürünlerin üzerindeki kalp butonuna tıklayarak listenize ekleyebilirsiniz.'
              : products.length === 0
                ? 'Bu arşivde yalnızca gerçekten denenmiş ürünler yer alır. İlk tadım eklendiğinde ürün fotoğrafı, market bilgisi ve Tadımmetre puanı burada yayınlanacak.'
                : 'Arama kriterlerinize veya seçtiğiniz filtrelere uygun ürün bulunamadı. Lütfen filtreleri sıfırlayarak tekrar deneyin.'}
          </p>
          {products.length > 0 && <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-extrabold hover:bg-[#e04a14] transition-colors cursor-pointer"
          >
            Filtreleri Temizle
          </button>}
        </div>
      )}
    </div>
  );
};
