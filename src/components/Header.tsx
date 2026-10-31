import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, Heart, Sparkles, Search } from 'lucide-react';
import { getFavoriteProductIds, subscribeToDBChanges } from '../services/db';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  tiktokUrl?: string;
  tiktokHandle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  tiktokUrl = 'https://www.tiktok.com/@tadimtabagi',
  tiktokHandle = '@tadimtabagi',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState<number>(0);

  useEffect(() => {
    const updateFavs = () => {
      setFavCount(getFavoriteProductIds().length);
    };
    updateFavs();
    const unsub = subscribeToDBChanges(updateFavs);
    window.addEventListener('storage', updateFavs);
    return () => {
      unsub();
      window.removeEventListener('storage', updateFavs);
    };
  }, []);

  const navLinks = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Ürünler', path: '/urunler' },
    { label: 'Kategoriler', path: '/kategoriler' },
    { label: 'Sıralamalar', path: '/siralamalar' },
    { label: 'Hakkımızda', path: '/hakkimizda' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDFC]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-hidden"
            aria-label="Tadım Tabağı Ana Sayfa"
          >
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-stone-200/90 group-hover:scale-105 transition-transform duration-200 bg-white">
              <img
                src="/logo.jpeg"
                alt="Tadım Tabağı Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-[#171717] group-hover:text-[#FF5A1F] transition-colors">
                  Tadım Tabağı
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF5A1F] border border-orange-200">
                  <Sparkles className="w-2.5 h-2.5" />
                  TikTok İnceleme
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium tracking-tight">
                Dürüst Yorumlar & Tadımmetre
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FF5A1F] text-white shadow-xs'
                      : 'text-stone-700 hover:text-[#FF5A1F] hover:bg-stone-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Side Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Wishlist / Denenecekler */}
            <button
              onClick={() => handleNav('/urunler?filter=favorites')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                currentPath.includes('filter=favorites')
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 bg-white'
              }`}
              title="Denenecekler Listesi"
            >
              <Heart className={`w-4 h-4 ${favCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden xl:inline">Denenecekler</span>
              {favCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </button>

            {/* TikTok CTA Button */}
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#171717] text-white hover:bg-black hover:shadow-md transition-all group"
            >
              <svg className="w-4 h-4 fill-current text-[#00f2fe]" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              <span>TikTok</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
            </a>

            {/* Creator Portal / Admin Button */}
            <button
              onClick={() => handleNav('/admin')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'bg-orange-50 border-[#FF5A1F] text-[#FF5A1F]'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 bg-white'
              }`}
              title="Yönetim Paneli"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
              <span className="hidden xl:inline">İçerik Yönetimi</span>
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => handleNav('/urunler?filter=favorites')}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-700 bg-white relative"
              aria-label="Denenecekler"
            >
              <Heart className={`w-4 h-4 ${favCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('/admin')}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-700 bg-white"
              aria-label="Yönetim Paneli"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-800 bg-white hover:bg-stone-50 transition-colors focus:outline-hidden"
              aria-label={mobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-bold text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#FF5A1F] text-white'
                      : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <Sparkles className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2.5">
            <button
              onClick={() => handleNav('/urunler?filter=favorites')}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-bold bg-rose-50 text-rose-700 border border-rose-200 text-sm"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>Denenecekler Listem</span>
              </div>
              <span className="font-black">{favCount} Ürün</span>
            </button>

            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-[#171717] text-white text-sm shadow-sm"
            >
              <span>TikTok'ta Bizi İzle ({tiktokHandle})</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleNav('/admin')}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold border border-orange-200 bg-orange-50 text-[#FF5A1F] text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>İçerik Yönetim Paneli</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
