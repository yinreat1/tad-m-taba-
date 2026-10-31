import React, { useState } from 'react';
import { Category, Product } from '../types';
import {
  getTopRated,
  getLowestRated,
  getNewestProducts,
  getTopByCategory,
  formatScore,
  evaluateRating,
} from '../utils/tadimmetre';
import {
  Trophy,
  ThumbsDown,
  Clock,
  Layers,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RankingsPageProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

type TabKey = 'top10' | 'worst10' | 'newest10' | 'byCategory';

export const RankingsPage: React.FC<RankingsPageProps> = ({
  products,
  categories,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('top10');
  const [selectedCategory, setSelectedCategory] = useState<string>('Çikolata');

  const top10 = getTopRated(products, 10);
  const worst10 = getLowestRated(products, 10);
  const newest10 = getNewestProducts(products, 10);
  const categoryMap = getTopByCategory(products);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-900 font-black text-sm flex items-center justify-center shadow-md">
          1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-400 to-stone-200 text-stone-800 font-black text-sm flex items-center justify-center shadow-md">
          2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-md">
          3
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 font-bold text-xs flex items-center justify-center">
        {index + 1}
      </span>
    );
  };

  const renderRankingList = (list: Product[], emptyLabel: string) => {
    if (list.length === 0) {
      return (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <p className="text-stone-500 font-medium">{emptyLabel}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {list.map((product, index) => {
          const evalData = evaluateRating(product.rating);
          const score = formatScore(product.rating);

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product.slug)}
              className="group bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-[#FF5A1F] hover:shadow-lg transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer"
            >
              {/* Left: Rank + Thumbnail + Title/Brand */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0 flex items-center justify-center">
                  {getRankBadge(index)}
                </div>

                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                  <img
                    src={product.imageUrl || '/logo.jpeg'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] mb-0.5">
                    <span className="font-extrabold text-[#FF5A1F] uppercase">{product.category}</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-semibold text-stone-500">{product.brand}</span>
                    <span className="text-stone-300 hidden sm:inline">•</span>
                    <span className="text-stone-500 hidden sm:inline font-medium">{product.market}</span>
                  </div>

                  <h3 className="font-extrabold text-stone-900 text-sm sm:text-base truncate group-hover:text-[#FF5A1F] transition-colors">
                    {product.title}
                  </h3>

                  {product.review && (
                    <p className="text-xs text-stone-500 truncate hidden md:block max-w-xl">
                      {product.review}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Score Badge & Arrow */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div
                  className={`flex flex-col items-end px-3 py-1.5 rounded-xl border ${evalData.badgeBg} ${evalData.badgeText} ${evalData.badgeBorder}`}
                >
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base sm:text-lg font-black">{score}</span>
                    <span className="text-[10px] font-bold opacity-70">/10</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">
                    {evalData.label}
                  </span>
                </div>

                <div className="hidden sm:flex items-center text-stone-300 group-hover:text-[#FF5A1F] group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black uppercase tracking-wider">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Liderlik Tablosu</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
          Tadımmetre Sıralamaları
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Gerçek tadım kayıtlarında verilen puanlara göre otomatik hesaplanan sıralamalar. En yüksek puanlar, en düşük puanlar ve kategori liderleri!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-stone-100 rounded-2xl max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTab('top10')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'top10'
              ? 'bg-white text-[#171717] shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>En İyi 10 Ürün</span>
        </button>

        <button
          onClick={() => setActiveTab('worst10')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'worst10'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ThumbsDown className="w-4 h-4 text-red-500" />
          <span>En Düşük 10 Ürün</span>
        </button>

        <button
          onClick={() => setActiveTab('newest10')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'newest10'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Clock className="w-4 h-4 text-[#FF5A1F]" />
          <span>Son Eklenen 10</span>
        </button>

        <button
          onClick={() => setActiveTab('byCategory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'byCategory'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Kategoriye Göre</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'top10' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-black text-[#171717] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Tüm Zamanların En Yüksek Puanlı 10 Ürünü</span>
              </h2>
              <span className="text-xs font-bold text-stone-500">Tadımmetre Zirvesi</span>
            </div>
            {renderRankingList(top10, 'Henüz yeterli ürün eklenmedi.')}
          </div>
        )}

        {activeTab === 'worst10' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-black text-red-600 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5" />
                <span>En Düşük Puanlı 10 Ürün (Uzak Durulması Gerekenler)</span>
              </h2>
              <span className="text-xs font-bold text-stone-500">Dürüst Eleştiri</span>
            </div>
            {renderRankingList(worst10, 'Düşük puanlı ürün bulunamadı.')}
          </div>
        )}

        {activeTab === 'newest10' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-black text-[#171717] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF5A1F]" />
                <span>En Son Tadımı Yapılan 10 Ürün</span>
              </h2>
              <span className="text-xs font-bold text-stone-500">En Taze İncelemeler</span>
            </div>
            {renderRankingList(newest10, 'Henüz ürün bulunmuyor.')}
          </div>
        )}

        {activeTab === 'byCategory' && (
          <div className="space-y-6">
            {/* Category Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-[#FF5A1F] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-black text-[#171717]">
                "{selectedCategory}" Kategorisindeki En İyiler
              </h2>
              <button
                onClick={() => onSelectCategory(selectedCategory)}
                className="text-xs font-bold text-[#FF5A1F] hover:underline"
              >
                Tüm {selectedCategory} Ürünleri
              </button>
            </div>

            {renderRankingList(
              categoryMap[selectedCategory] || [],
              `Bu kategoride henüz incelenen ürün bulunmuyor.`
            )}
          </div>
        )}
      </div>
    </div>
  );
};
