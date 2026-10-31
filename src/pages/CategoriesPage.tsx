import React from 'react';
import { Category, Product } from '../types';
import {
  Layers,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { formatScore } from '../utils/tadimmetre';

interface CategoriesPageProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  products,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] text-xs font-black uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Katalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
          Kategorilere Göre Keşfet
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Tadım Tabağı'nda incelenen bütün ürünleri kategori bazında filtreleyin, damak tadınıza uygun lezzetleri hemen keşfedin.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryProducts = products.filter(
            (p) => p.category.toLowerCase() === cat.name.toLowerCase()
          );
          const count = categoryProducts.length;

          // Find highest rated in this category
          const topProduct = [...categoryProducts].sort((a, b) => b.rating - a.rating)[0];

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug || cat.name)}
              className="group bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:border-[#FF5A1F] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-stone-100 text-stone-700">
                    {count} Ürün
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#171717] group-hover:text-[#FF5A1F] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {cat.description || `${cat.name} kategorisinde yapılan bütün tadım ve incelemeler.`}
                </p>

                {/* Top product preview */}
                {topProduct && (
                  <div className="mt-5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                        <img
                          src={topProduct.imageUrl || '/logo.jpeg'}
                          alt={topProduct.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-stone-400 uppercase block">
                          Zirve Ürün
                        </span>
                        <p className="text-xs font-black text-stone-900 truncate">
                          {topProduct.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg flex-shrink-0">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formatScore(topProduct.rating)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
                <span>Ürünleri İncele</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
