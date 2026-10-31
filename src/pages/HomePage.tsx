import React from 'react';
import { Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { TadimmetreExplainer } from '../components/TadimmetreExplainer';
import { TikTokBanner } from '../components/TikTokBanner';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
  ThumbsDown,
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onNavigate: (path: string) => void;
  onSelectProduct: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  tiktokUrl: string;
  tiktokHandle: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onNavigate,
  onSelectProduct,
  onSelectCategory,
  tiktokUrl,
  tiktokHandle,
}) => {
  // Sort data
  const newestProducts = [...products]
    .sort((a, b) => new Date(b.tastingDate).getTime() - new Date(a.tastingDate).getTime())
    .slice(0, 4);

  const topRatedProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .filter((p) => p.rating >= 7.5)
    .slice(0, 4);

  const lowestRatedProducts = [...products]
    .sort((a, b) => a.rating - b.rating)
    .filter((p) => p.rating <= 5.0)
    .slice(0, 4);

  // Compute stats
  const totalProducts = products.length;
  const avgRating =
    totalProducts > 0
      ? (products.reduce((acc, p) => acc + p.rating, 0) / totalProducts).toFixed(1)
      : '—';

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headings & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>TikTok'un En Samimi Tadım Platformu</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#171717] tracking-tight leading-[1.1]">
                Yeni lezzetler, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] via-[#ff7843] to-[#e04a14]">
                  gerçek deneyimler!
                </span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Merak ettiğin market ürünlerini keşfet,{' '}
                <strong className="text-stone-900 font-bold">Tadımmetre</strong> puanlarımızı incele ve
                yeni lezzetlerin peşine düş!
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/urunler')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FF5A1F] text-white font-extrabold text-base hover:bg-[#e04a14] hover:shadow-lg hover:shadow-[#FF5A1F]/25 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Ürünleri Keşfet</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 font-extrabold text-base hover:bg-stone-50 hover:border-stone-400 hover:shadow-sm transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-[#171717]" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                  <span>TikTok'ta Bizi İzle</span>
                </a>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-center sm:text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#171717]">{totalProducts}</p>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                    Denenen Ürün
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#FF5A1F]">{avgRating}</p>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                    Ort. Tadımmetre
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">0.5</p>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                    Puan Hassasiyeti
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Mascot Card with 3D Depth */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Decorative warm aura */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5A1F]/30 via-amber-300/30 to-orange-500/20 rounded-full blur-2xl opacity-60" />

                <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 flex flex-col items-center text-center">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-lg border-4 border-white mb-6">
                    <img
                      src="/logo.jpeg"
                      alt="Tadım Tabağı Resmi Maskotu"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">
                      Ürün Tadım Arşivi
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#171717]">Tadım Tabağı</h3>
                    <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                      Denenen ürünler, gerçek fotoğraflar ve kişisel Tadımmetre değerlendirmeleri tek yerde.
                    </p>
                  </div>

                  {/* Micro badge float */}
                  <div className="mt-5 w-full bg-stone-50 rounded-2xl p-3 border border-stone-200 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Award className="w-4 h-4 text-[#FF5A1F]" />
                      <span>Tadımmetre İle Puanlandı</span>
                    </div>
                    <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-extrabold">
                      0.5 Hassasiyet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Popüler Kategoriler
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
              Sevdiğiniz kategorideki ürünleri hemen inceleyin
            </p>
          </div>
          <button
            onClick={() => onNavigate('/kategoriler')}
            className="text-xs sm:text-sm font-bold text-[#FF5A1F] hover:text-[#e04a14] flex items-center gap-1 cursor-pointer"
          >
            <span>Tüm Kategoriler</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => {
            const count = products.filter(
              (p) => p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#FF5A1F] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#171717] group-hover:text-[#FF5A1F] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 font-medium">{count} Ürün</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* REAL PRODUCT SECTIONS: hidden until the owner adds the first real review */}
      {products.length > 0 ? <>
      {/* 1. SON EKLENEN ÜRÜNLER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
                Son Eklenen Ürünler
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">
                En son denediğimiz ve Tadımmetre puanını verdiğimiz lezzetler
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/urunler')}
            className="text-xs sm:text-sm font-bold text-[#FF5A1F] hover:text-[#e04a14] flex items-center gap-1 cursor-pointer"
          >
            <span>Tümünü Gör</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newestProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 2. EN YÜKSEK PUAN ALANLAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
                En Yüksek Puan Alanlar
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">
                Tadımmetre'den geçer not alan, kaçırılmaması gereken lezzet zirveleri
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/siralamalar')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Top 10 Listesi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onSelectProduct}
              featured={true}
            />
          ))}
        </div>
      </section>

      {/* 3. EN DÜŞÜK PUAN ALANLAR (Dürüstlük vitrini) */}
      {lowestRatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <ThumbsDown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
                  En Düşük Puan Alanlar
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">
                  Damak tadımıza uymayan, hayal kırıklığı yaratan dürüst incelemeler
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/siralamalar')}
              className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Tümünü İncele</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lowestRatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      </> : (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5A1F]">
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#FF5A1F]">Gerçek tadımlar burada</p>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">İlk ürün incelemesi yakında</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500">Tadım Tabağı'nda yalnızca gerçekten denenmiş ürünler yayınlanır. İlk ürün incelemesi eklendiğinde fotoğrafı, market bilgisi, yorumu ve Tadımmetre puanı burada görünecek.</p>
            <button onClick={() => onNavigate('/urunler')} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-stone-200 px-5 py-3 text-sm font-bold text-stone-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F]">Ürün arşivini görüntüle <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      )}

      {/* 5. TADIMMETRE NEDİR? BÖLÜMÜ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TadimmetreExplainer />
      </div>

      {/* 6. TIKTOK HESABINA YÖNLENDİRME ALANI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TikTokBanner tiktokUrl={tiktokUrl} tiktokHandle={tiktokHandle} />
      </div>
    </div>
  );
};
