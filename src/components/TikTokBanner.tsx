import React from 'react';
import { ArrowUpRight, Video, Sparkles, Heart } from 'lucide-react';

interface TikTokBannerProps {
  tiktokUrl?: string;
  tiktokHandle?: string;
}

export const TikTokBanner: React.FC<TikTokBannerProps> = ({
  tiktokUrl = 'https://www.tiktok.com/@tadimtabagi',
  tiktokHandle = '@tadimtabagi',
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171717] via-[#221c1a] to-[#120e0d] text-white p-8 sm:p-12 border border-stone-800 shadow-xl my-16">
      {/* Background glow orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FF5A1F]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#00f2fe]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-stone-200 text-xs font-bold border border-white/10 backdrop-blur-xs">
            <Video className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>TikTok'ta Canlı Tadımlar & Tepkiler</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Tadım anlarını, ilk tepkileri ve en eğlenceli videoları{' '}
            <span className="text-[#FF5A1F]">TikTok'ta</span> izleyin!
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Markete yeni gelen abur cuburlar, sürpriz yabancı atıştırmalıklar ve takipçilerimizin
            önerdiği lezzetlerin paket açılışını canlı yayında ve videolarda kaçırmayın.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#FF5A1F] text-white font-extrabold text-sm sm:text-base hover:bg-[#e04a14] hover:shadow-lg transition-all group cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              <span>{tiktokHandle} Takip Et</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Hergün Yeni Ürün & Anlık Hikayeler</span>
            </div>
          </div>
        </div>

        {/* Visual Badge Card */}
        <div className="relative flex-shrink-0 w-64 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
          <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#FF5A1F] via-pink-500 to-[#00f2fe] shadow-lg mb-4">
            <img
              src="/logo.jpeg"
              alt="Tadım Tabağı TikTok"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h3 className="font-black text-lg text-white">Tadım Tabağı</h3>
          <p className="text-xs text-stone-400 font-mono mt-0.5">{tiktokHandle}</p>
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-around text-center">
            <div>
              <p className="font-black text-sm text-[#FF5A1F]">0–10</p>
              <p className="text-[10px] text-stone-400 uppercase">Puanlama</p>
            </div>
            <div>
              <p className="font-black text-sm text-[#00f2fe]">Dürüst</p>
              <p className="text-[10px] text-stone-400 uppercase">Yorumlar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
