import React from 'react';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  tiktokUrl?: string;
  tiktokHandle?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  tiktokUrl = 'https://www.tiktok.com/@tadimtabagi',
  tiktokHandle = '@tadimtabagi',
}) => {
  return (
    <footer className="bg-[#171717] text-white pt-16 pb-12 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="Tadım Tabağı"
                className="w-12 h-12 rounded-2xl object-cover border border-stone-700"
              />
              <div>
                <span className="text-xl font-black tracking-tight text-white">Tadım Tabağı</span>
                <p className="text-xs text-[#FF5A1F] font-semibold">Tadım & İnceleme Platformu</p>
              </div>
            </div>

            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              Yeni çıkan market ürünlerini ve farklı lezzetleri deneyimleyerek fotoğrafları, satın alındıkları market bilgileri ve Tadımmetre puanlarıyla arşivliyoruz.
            </p>

            <div className="pt-2">
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#FF5A1F] text-white hover:bg-[#e04a14] transition-colors shadow-sm"
              >
                <span>TikTok'ta Takip Et ({tiktokHandle})</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">Gezinti</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#FF5A1F] transition-colors text-left"
                >
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/urunler')}
                  className="hover:text-[#FF5A1F] transition-colors text-left"
                >
                  Tüm Ürünler
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/siralamalar')}
                  className="hover:text-[#FF5A1F] transition-colors text-left"
                >
                  Sıralamalar & En İyiler
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/kategoriler')}
                  className="hover:text-[#FF5A1F] transition-colors text-left"
                >
                  Kategoriler
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/hakkimizda')}
                  className="hover:text-[#FF5A1F] transition-colors text-left"
                >
                  Hakkımızda
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Admin info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">İçerik Üreticisi</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Mobil uyumlu yönetim panelimiz sayesinde telefonunuzdan markette veya evde anında ürün ekleyin.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/admin')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-stone-700 bg-stone-800/80 text-stone-200 hover:text-white hover:border-stone-500 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Yönetim Paneli Girişi</span>
              </button>
            </div>
            <div className="text-[11px] text-stone-500 pt-2">
              <span className="font-semibold text-stone-400">İlkemiz:</span> İncelemeler gerçek ürün denemelerine ve içerik üreticisinin kişisel görüşüne dayanır.
            </div>
          </div>
        </div>

        {/* Bilgilendirme alanı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-stone-800">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
            <h4 className="text-xs font-black text-white mb-2">Tadımmetre puanları</h4>
            <p className="text-[11px] leading-relaxed text-stone-400">Puanlar içerik üreticisinin kendi tadım deneyimine dayanır. 0 ile 10 arasında, yarım puanlık aralıklarla verilir.</p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
            <h4 className="text-xs font-black text-white mb-2">Ürün ve market bilgileri</h4>
            <p className="text-[11px] leading-relaxed text-stone-400">Market ve fiyat bilgileri ürünün denendiği zamana aittir. Mağazaya, şehre ve tarihe göre değişiklik gösterebilir.</p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
            <h4 className="text-xs font-black text-white mb-2">Barkodla ürün tanıma</h4>
            <p className="text-[11px] leading-relaxed text-stone-400">Barkod aramasında Open Food Facts açık kataloğundan yararlanılabilir. Katalog verileri topluluk katkılıdır; eksik veya hatalı olabilir.</p>
            <a href="https://world.openfoodfacts.org/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[11px] font-bold text-[#FF8A5B] hover:text-white">Open Food Facts hakkında ↗</a>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
            <h4 className="text-xs font-black text-white mb-2">Bilgilendirme</h4>
            <p className="text-[11px] leading-relaxed text-stone-400">Değerlendirmeler kişisel görüş niteliğindedir. Ürün ambalajı, içerik, gramaj ve fiyat bilgileri zamanla değişebilir; güncel bilgi için ürün ambalajını kontrol edin.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Tadım Tabağı. Tüm hakları saklıdır.</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Dürüst tadımlar, gerçek lezzetler</span>
            <Heart className="w-3.5 h-3.5 text-[#FF5A1F] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
