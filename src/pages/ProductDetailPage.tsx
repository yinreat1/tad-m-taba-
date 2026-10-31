import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { TadimmetreGauge } from '../components/TadimmetreGauge';
import { ProductCard } from '../components/ProductCard';
import { formatDate, formatCurrency, formatScore, evaluateRating } from '../utils/tadimmetre';
import {
  ArrowLeft,
  Share2,
  Check,
  Store,
  Calendar,
  Tag,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Layers,
  Heart,
  Scale,
  Flame,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Video,
  Barcode,
} from 'lucide-react';
import { getFavoriteProductIds, submitProductVote, toggleFavoriteProductId } from '../services/db';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onVoteSubmitted?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onSelectCategory,
  onVoteSubmitted,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userVote, setUserVote] = useState<number>(8.0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const favs = getFavoriteProductIds();
    setIsFavorite(favs.includes(product.id));

    // Check if user previously voted in this session
    const votedInSession = localStorage.getItem(`voted_${product.id}`);
    if (votedInSession) {
      setHasVoted(true);
      setUserVote(parseFloat(votedInSession));
    }
  }, [product.id]);

  const handleToggleFavorite = () => {
    const updated = toggleFavoriteProductId(product.id);
    setIsFavorite(updated);
  };

  const handleVoteSubmit = async () => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    try {
      await submitProductVote(product.id, userVote);
      localStorage.setItem(`voted_${product.id}`, userVote.toString());
      setHasVoted(true);
      if (onVoteSubmitted) onVoteSubmitted();
    } catch {
      // ignore
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Related products
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Market styling
  const getMarketBadgeStyle = (marketName: string) => {
    const m = marketName.toLowerCase();
    if (m.includes('bim')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (m.includes('a101')) return 'bg-cyan-50 text-cyan-800 border-cyan-200';
    if (m.includes('sok') || m.includes('şok')) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (m.includes('migros')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (m.includes('carrefour')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-stone-50 text-stone-700 border-stone-200';
  };

  const communityAvg =
    product.communityVotes && product.communityVotes.count > 0
      ? (product.communityVotes.totalScore / product.communityVotes.count).toFixed(1)
      : null;

  const evalData = evaluateRating(product.rating);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Breadcrumb & Share Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold text-stone-700 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm İncelemelere Dön</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Category link */}
          <button
            onClick={() => onSelectCategory(product.category)}
            className="text-xs font-bold text-[#FF5A1F] bg-orange-50 px-3.5 py-2 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
          >
            {product.category}
          </button>

          {/* Add to Wishlist / Denenecekler */}
          <button
            onClick={handleToggleFavorite}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Deneneceklerde Kayıtlı' : 'Deneneceklere Ekle'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition-all cursor-pointer"
            title="Bağlantıyı Kopyala"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-extrabold">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-stone-500" />
                <span>Paylaş</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Big Product Image & Quick Fact Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
            <img
              src={product.imageUrl || '/logo.jpeg'}
              alt={product.imageAlt || product.title}
              className="w-full h-full object-cover"
            />

            {/* Tags overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              {product.tags?.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-xl text-xs font-black tracking-wider uppercase bg-black/80 text-white backdrop-blur-md shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* TikTok Video Overlay Button if URL exists */}
            {product.tiktokUrl && (
              <a
                href={product.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/85 text-white text-xs font-black shadow-lg hover:bg-black transition-all group backdrop-blur-xs"
              >
                <Video className="w-4 h-4 text-[#00f2fe]" />
                <span>TikTok'ta İzle</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
              </a>
            )}
          </div>

          {/* Product Quick Facts Spec Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                Market
              </span>
              <div className="flex items-center gap-1.5 font-black text-stone-900 text-xs">
                <Store className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>{product.market}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                Fiyat
              </span>
              <div className="font-black text-stone-900 text-xs">
                {product.price !== undefined ? formatCurrency(product.price) : 'Belirtilmedi'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                Gramaj / Boyut
              </span>
              <div className="flex items-center gap-1 font-black text-stone-900 text-xs">
                <Scale className="w-3.5 h-3.5 text-stone-400" />
                <span>{product.weight || 'Standart'}</span>
              </div>
            </div>


            {product.barcode && (
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Barkod</span>
                <div className="flex items-center gap-1.5 font-mono font-black text-stone-900 text-xs">
                  <Barcode className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>{product.barcode}</span>
                </div>
              </div>
            )}
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                Enerji
              </span>
              <div className="flex items-center gap-1 font-bold text-stone-800 text-xs">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{product.calories || 'Belirtilmedi'}</span>
              </div>
            </div>
          </div>

          {/* Sub-criteria Breakdown Box */}
          {product.criteria && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-black uppercase tracking-wider text-stone-900">
                  Tadım Kriterleri Detayı
                </span>
                <span className="text-[11px] font-bold text-stone-400">10 Üzerinden Puanlar</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-stone-700 mb-1">
                    <span>Lezzet & Tat Dengesi</span>
                    <span className="font-black text-stone-900">{product.criteria.flavor}/10</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF5A1F] h-full rounded-full transition-all duration-700"
                      style={{ width: `${product.criteria.flavor * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-stone-700 mb-1">
                    <span>Doku & Çıtırlık / Kıvam</span>
                    <span className="font-black text-stone-900">{product.criteria.texture}/10</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${product.criteria.texture * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-stone-700 mb-1">
                    <span>Fiyat / Performans</span>
                    <span className="font-black text-stone-900">{product.criteria.value}/10</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${product.criteria.value * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-stone-700 mb-1">
                    <span>Koku & Ambalaj Kalitesi</span>
                    <span className="font-black text-stone-900">{product.criteria.packaging}/10</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${product.criteria.packaging * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* "Tekrar Alır mıyım?" Decision Box */}
          {product.wouldBuyAgain && (
            <div
              className={`p-5 rounded-3xl border flex items-center gap-4 ${
                product.wouldBuyAgain === 'yes'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : product.wouldBuyAgain === 'maybe'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${
                  product.wouldBuyAgain === 'yes'
                    ? 'bg-emerald-600 text-white'
                    : product.wouldBuyAgain === 'maybe'
                    ? 'bg-amber-500 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {product.wouldBuyAgain === 'yes' && <CheckCircle2 className="w-6 h-6" />}
                {product.wouldBuyAgain === 'maybe' && <HelpCircle className="w-6 h-6" />}
                {product.wouldBuyAgain === 'no' && <AlertCircle className="w-6 h-6" />}
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider opacity-75">
                  Tadım Tabağı Kararı
                </p>
                <h4 className="font-black text-base">
                  {product.wouldBuyAgain === 'yes' && 'Tekrar Alır mıyım? Kesinlikle Evet!'}
                  {product.wouldBuyAgain === 'maybe' && 'Tekrar Alır mıyım? Belki / İndirimde Olursa'}
                  {product.wouldBuyAgain === 'no' && 'Tekrar Alır mıyım? Hayır, Tavsiye Etmiyorum'}
                </h4>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Title, Brand, Tadımmetre Gauge, Review, Visitor Voting */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-black uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-400 font-medium">
                {formatDate(product.tastingDate)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Signature Tadımmetre Gauge */}
          <div className="w-full">
            <TadimmetreGauge score={product.rating} size={210} />
          </div>

          {/* TikTok Action Banner */}
          {product.tiktokUrl && (
            <a
              href={product.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#171717] text-white hover:bg-black transition-all shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current text-[#00f2fe]" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </div>
                <div>
                  <p className="font-extrabold text-sm sm:text-base">TikTok İncelemesini İzle</p>
                  <p className="text-xs text-stone-400">Canlı tepkiler, paket açılışı ve sesli çıtırtı testi</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-white transition-colors" />
            </a>
          )}

          {/* Tasting Review Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF5A1F]">
              <Sparkles className="w-4 h-4" />
              <span>Tadım Yorumu ve Damak Deneyimi</span>
            </div>

            <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
              {product.review}
            </p>

            {/* Pros and Cons */}
            {(product.pros?.length || product.cons?.length) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                {product.pros && product.pros.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Artıları
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-600">
                      {product.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.cons && product.cons.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1.5 uppercase tracking-wider">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      Eksileri
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-600">
                      {product.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-red-500 font-bold">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Interactive Community Voting ("Sizce Kaç Puan?") */}
          <div className="bg-gradient-to-br from-stone-50 to-orange-50/40 rounded-3xl p-6 border border-orange-200/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF5A1F]" />
                <div>
                  <h4 className="font-black text-sm text-[#171717]">Siz Bu Ürünü Denediniz mi?</h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Kendi puanınızı verin, topluluk ortalamasına katkıda bulunun
                  </p>
                </div>
              </div>

              {communityAvg && (
                <div className="text-right">
                  <span className="text-xs text-stone-400 font-semibold block uppercase">
                    Topluluk Puanı
                  </span>
                  <span className="text-lg font-black text-[#FF5A1F]">
                    {communityAvg} <span className="text-xs text-stone-400 font-bold">/10</span>
                  </span>
                </div>
              )}
            </div>

            {hasVoted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Oyunuz ({userVote}/10) kaydedildi. Katkınız için teşekkürler!</span>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600">Sizin Puanınız:</span>
                  <span className="text-xl font-black text-[#FF5A1F]">{userVote} / 10</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={userVote}
                  onChange={(e) => setUserVote(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
                />

                <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                  <span>1 (Kötü)</span>
                  <span>5 (Ortalama)</span>
                  <span>10 (Mükemmel)</span>
                </div>

                <button
                  onClick={handleVoteSubmit}
                  disabled={isVoting}
                  className="w-full py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white text-xs font-black transition-colors shadow-xs cursor-pointer"
                >
                  {isVoting ? 'Kaydediliyor...' : 'Puanımı Gönder'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products in Same Category */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#171717]">
                Aynı Reyondan Diğer Lezzetler
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {product.category} kategorisinde denediğimiz diğer ürünler
              </p>
            </div>
            <button
              onClick={() => onSelectCategory(product.category)}
              className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
            >
              Kategorideki Tümünü Gör
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onClick={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
