import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { evaluateRating, formatDate, formatScore, formatCurrency } from '../utils/tadimmetre';
import { Store, Calendar, ArrowRight, Video, Heart, Check, Users } from 'lucide-react';
import { getFavoriteProductIds, toggleFavoriteProductId } from '../services/db';

interface ProductCardProps {
  product: Product;
  onClick: (slug: string) => void;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  featured = false,
}) => {
  const evalData = evaluateRating(product.rating);
  const formattedScore = formatScore(product.rating);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = getFavoriteProductIds();
    setIsFavorite(favs.includes(product.id));
  }, [product.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavoriteProductId(product.id);
    setIsFavorite(updated);
  };

  // Market color accents
  const getMarketBadgeStyle = (marketName: string) => {
    const m = marketName.toLowerCase();
    if (m.includes('bim')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (m.includes('a101')) return 'bg-cyan-50 text-cyan-800 border-cyan-200';
    if (m.includes('sok') || m.includes('şok')) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (m.includes('migros')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (m.includes('carrefour')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-stone-50 text-stone-700 border-stone-200';
  };

  // Community rating
  const communityAvg =
    product.communityVotes && product.communityVotes.count > 0
      ? (product.communityVotes.totalScore / product.communityVotes.count).toFixed(1)
      : null;

  return (
    <article
      onClick={() => onClick(product.slug)}
      className={`group relative bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer ${
        featured ? 'ring-2 ring-[#FF5A1F]/30' : ''
      }`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.imageUrl || '/logo.jpeg'}
          alt={product.imageAlt || product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Favorite Button (Top Left) */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all text-stone-600 hover:text-rose-600 focus:outline-hidden"
          aria-label={isFavorite ? 'Deneneceklerden çıkar' : 'Deneneceklere ekle'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
            }`}
          />
        </button>

        {/* Floating Tadımmetre Score Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md backdrop-blur-md border font-black text-xs ${evalData.badgeBg} ${evalData.badgeText} ${evalData.badgeBorder}`}
          >
            <span className="text-sm font-extrabold">{formattedScore}</span>
            <span className="text-[10px] opacity-70">/10</span>
            <span className="text-[10px] font-bold uppercase tracking-wider pl-0.5">
              {evalData.label}
            </span>
          </div>
        </div>

        {/* Tags Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center gap-1.5">
          {product.tags && product.tags[0] && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-stone-900/80 text-white backdrop-blur-xs">
              {product.tags[0]}
            </span>
          )}
          {product.tiktokUrl && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#171717]/85 text-white backdrop-blur-xs">
              <Video className="w-3 h-3 text-[#00f2fe]" />
              <span>İnceleme</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category, Brand & Weight */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-extrabold text-[#FF5A1F] uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-700 font-bold bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">
                {product.brand}
              </span>
              {product.weight && (
                <span className="text-stone-400 font-medium text-[11px]">
                  {product.weight}
                </span>
              )}
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-black text-[#171717] text-base line-clamp-2 leading-snug group-hover:text-[#FF5A1F] transition-colors">
            {product.title}
          </h3>

          {/* Review Quote */}
          {product.review && (
            <p className="mt-2 text-stone-600 text-xs line-clamp-2 leading-relaxed font-normal">
              "{product.review}"
            </p>
          )}
        </div>

        {/* Footer Meta (Market, Community, Price) */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            {/* Market badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[11px] ${getMarketBadgeStyle(
                product.market
              )}`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{product.market}</span>
            </div>

            {/* Price */}
            {product.price !== undefined && (
              <span className="font-black text-stone-900 text-sm">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Sub-meta: Date & Community vote */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium pt-0.5">
            <span>{formatDate(product.tastingDate)}</span>
            {communityAvg ? (
              <span className="inline-flex items-center gap-1 text-stone-500 font-semibold">
                <Users className="w-3 h-3 text-[#FF5A1F]" />
                <span>Topluluk: <strong>{communityAvg}</strong> ({product.communityVotes?.count})</span>
              </span>
            ) : (
              <span className="text-stone-400">İlk oyu sen ver</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
