import React, { useState, useEffect, useCallback } from 'react';
import { AppSettings, Category, Product } from './types';
import {
  getCategories,
  getProducts,
  getSettings,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  subscribeToDBChanges,
} from './services/db';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { RankingsPage } from './pages/RankingsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [prods, cats, sets] = await Promise.all([
        getProducts(),
        getCategories(),
        getSettings(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setSettings(sets);
    } catch (e) {
      console.error('Veri yüklenirken hata:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDBChanges(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // Sync with browser URL / hash
  useEffect(() => {
    const handleLocationChange = () => {
      // Older preview links used hash routes; migrate them to clean paths once.
      const hashRoute = window.location.hash.startsWith('#/')
        ? window.location.hash.slice(1)
        : '';
      if (hashRoute) {
        window.history.replaceState({}, '', hashRoute);
      }
      const pathname = `${window.location.pathname}${window.location.search}`;
      setCurrentPath(hashRoute || pathname || '/');
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    const nextPath = path.startsWith('/') ? path : `/${path}`;
    window.history.pushState({}, '', nextPath);
    setCurrentPath(`${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Route parser (query strings are kept separate from the route itself).
  let renderedPage = null;
  const routePath = currentPath.split('?')[0].split('#')[0] || '/';

  // Check if product detail
  if (routePath.startsWith('/urun/')) {
    const slug = routePath.slice('/urun/'.length);
    const currentProduct = products.find((p) => p.slug === slug || p.id === slug);

    if (currentProduct) {
      // Dynamic SEO document title update
      document.title = `${currentProduct.title} (${currentProduct.rating}/10 Tadımmetre) | Tadım Tabağı`;

      renderedPage = (
        <ProductDetailPage
          product={currentProduct}
          allProducts={products}
          onBack={() => navigate('/urunler')}
          onSelectProduct={(newSlug) => navigate(`/urun/${newSlug}`)}
          onSelectCategory={(catSlug) => {
            setSelectedCategory(catSlug);
            navigate('/urunler');
          }}
          onVoteSubmitted={loadData}
        />
      );
    } else {
      renderedPage = (
        <div className="max-w-md mx-auto py-24 text-center space-y-4">
          <h2 className="text-2xl font-black text-[#171717]">Ürün Bulunamadı</h2>
          <p className="text-xs text-stone-500">
            Aradığınız tadım incelemesi mevcut değil veya silinmiş olabilir.
          </p>
          <button
            onClick={() => navigate('/urunler')}
            className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold"
          >
            Tüm Ürünlere Dön
          </button>
        </div>
      );
    }
  } else if (routePath === '/urunler') {
    document.title = 'Tüm Ürünler & Tadım İncelemeleri | Tadım Tabağı';
    renderedPage = (
      <ProductsPage
        products={products}
        categories={categories}
        initialCategory={selectedCategory}
        routeKey={currentPath}
        onSelectProduct={(slug) => navigate(`/urun/${slug}`)}
      />
    );
  } else if (routePath === '/siralamalar') {
    document.title = 'Tadımmetre Sıralamaları & En İyi Lezzetler | Tadım Tabağı';
    renderedPage = (
      <RankingsPage
        products={products}
        categories={categories}
        onSelectProduct={(slug) => navigate(`/urun/${slug}`)}
        onSelectCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          navigate('/urunler');
        }}
      />
    );
  } else if (routePath === '/kategoriler') {
    document.title = 'Kategoriler | Tadım Tabağı';
    renderedPage = (
      <CategoriesPage
        categories={categories}
        products={products}
        onSelectCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          navigate('/urunler');
        }}
      />
    );
  } else if (routePath === '/hakkimizda') {
    document.title = 'Hakkımızda | Tadım Tabağı';
    renderedPage = (
      <AboutPage
        tiktokUrl={settings.tiktokUrl}
        tiktokHandle={settings.tiktokHandle}
      />
    );
  } else if (routePath === '/admin') {
    document.title = 'Yönetim Paneli | Tadım Tabağı';
    renderedPage = (
      <AdminDashboard
        products={products}
        categories={categories}
        settings={settings}
        onRefreshData={loadData}
        onNavigate={navigate}
        onShowToast={showToast}
      />
    );
  } else if (routePath === '/') {
    // Home Page
    document.title = 'Tadım Tabağı | Profesyonel Ürün Tadım ve İnceleme Platformu';
    renderedPage = (
      <HomePage
        products={products}
        categories={categories}
        onNavigate={navigate}
        onSelectProduct={(slug) => navigate(`/urun/${slug}`)}
        onSelectCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          navigate('/urunler');
        }}
        tiktokUrl={settings.tiktokUrl}
        tiktokHandle={settings.tiktokHandle}
      />
    );
  } else {
    document.title = 'Sayfa Bulunamadı | Tadım Tabağı';
    renderedPage = (
      <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-[#FF5A1F]">404 · Sayfa bulunamadı</p>
        <h1 className="text-3xl font-black text-stone-900">Aradığın sayfa burada değil.</h1>
        <p className="text-sm text-stone-500">Bağlantı değişmiş veya kaldırılmış olabilir.</p>
        <button onClick={() => navigate('/')} className="px-5 py-3 rounded-xl bg-[#FF5A1F] text-white text-sm font-bold">Ana sayfaya dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFC] text-[#171717] selection:bg-[#FF5A1F]/20 selection:text-[#FF5A1F]">
      {/* Top Trending Ticker Bar */}
      <div className="bg-[#171717] text-white py-2 px-4 text-center text-xs font-semibold border-b border-stone-800 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
        <span className="font-extrabold text-[#FF5A1F]">Tadım Tabağı</span>
        <span className="text-stone-200">Yeni lezzetler, gerçek deneyimler.</span>
      </div>

      {/* Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        tiktokUrl={settings.tiktokUrl}
        tiktokHandle={settings.tiktokHandle}
      />

      {/* Main Content Area */}
      <main className="flex-1 transition-all duration-150">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-12 h-12 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-stone-500">Tadım Tabağı Hazırlanıyor...</p>
          </div>
        ) : (
          renderedPage
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigate}
        tiktokUrl={settings.tiktokUrl}
        tiktokHandle={settings.tiktokHandle}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
