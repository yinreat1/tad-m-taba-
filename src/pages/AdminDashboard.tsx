import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppSettings, Category, Product, TastingCriteria } from '../types';
import {
  compressImageFile,
  deleteCategory,
  deleteProduct,
  saveCategory,
  saveProduct,
  saveSettings,
} from '../services/db';
import { evaluateRating, formatCurrency, formatDate, formatScore, slugify } from '../utils/tadimmetre';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  ShieldCheck,
  PlusCircle,
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  Camera,
  Upload,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Store,
  Sparkles,
  Award,
  Video,
  ArrowRight,
  Eye,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Share2,
  Check,
  Flame,
  Scale,
  Barcode,
  ScanLine,
  X,
  Info,
  Loader2,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
  onRefreshData: () => Promise<void>;
  onNavigate: (path: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info', title?: string) => void;
}

type AdminTab = 'overview' | 'products' | 'new-product' | 'categories' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  settings,
  onRefreshData,
  onNavigate,
  onShowToast,
}) => {
  // PIN Protection State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  useEffect(() => {
    // Check if session authenticated
    const authStatus = sessionStorage.getItem('tadim_admin_auth_v2');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.adminPin) {
      if (!/^\d{6}$/.test(pinInput)) {
        setPinError('İlk kullanım için 6 haneli sayısal bir PIN oluşturun.');
        return;
      }
      await saveSettings({ ...settings, adminPin: pinInput });
      await onRefreshData();
      setIsAuthenticated(true);
      sessionStorage.setItem('tadim_admin_auth_v2', 'true');
      setPinError('');
      onShowToast('Yönetici PIN kodu oluşturuldu.', 'success');
      return;
    }

    if (pinInput === settings.adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('tadim_admin_auth_v2', 'true');
      setPinError('');
      onShowToast('Yönetici girişi başarılı!', 'success');
    } else {
      setPinError('PIN kodu hatalı. Lütfen tekrar deneyin.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tadim_admin_auth_v2');
    setPinInput('');
  };

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [barcode, setBarcode] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [market, setMarket] = useState('');
  const [customMarket, setCustomMarket] = useState('');
  const [price, setPrice] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [tastingDate, setTastingDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState<number>(0);
  const [ratingTouched, setRatingTouched] = useState(false);
  const [review, setReview] = useState('');
  const [prosInput, setProsInput] = useState('');
  const [consInput, setConsInput] = useState('');
  const [wouldBuyAgain, setWouldBuyAgain] = useState<'yes' | 'maybe' | 'no' | null>(null);
  const [criteriaFlavor, setCriteriaFlavor] = useState<number>(0);
  const [criteriaTexture, setCriteriaTexture] = useState<number>(0);
  const [criteriaValue, setCriteriaValue] = useState<number>(0);
  const [criteriaPackaging, setCriteriaPackaging] = useState<number>(0);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Category form state
  const [newCatName, setNewCatName] = useState('');

  // Settings form state
  const [siteSettings, setSiteSettings] = useState<AppSettings>(settings);
  const [newPin, setNewPin] = useState<string>('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'product' | 'category';
    id?: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'product',
    title: '',
    message: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState('');
  const [isBarcodeLookup, setIsBarcodeLookup] = useState(false);
  const [barcodeMessage, setBarcodeMessage] = useState('');

  const popularMarkets = ['BİM', 'A101', 'ŞOK', 'Migros', 'CarrefourSA', 'Macrocenter', 'File', 'Tarım Kredi'];

  // Switch to edit mode
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setBarcode(prod.barcode || '');
    setBrand(prod.brand);
    setCategory(prod.category);
    if (popularMarkets.includes(prod.market)) {
      setMarket(prod.market);
      setCustomMarket('');
    } else {
      setMarket('Diğer');
      setCustomMarket(prod.market);
    }
    setPrice(prod.price !== undefined ? prod.price.toString() : '');
    setWeight(prod.weight || '');
    setCalories(prod.calories || '');
    setTagsInput(prod.tags ? prod.tags.join(', ') : '');
    setTastingDate(prod.tastingDate || new Date().toISOString().split('T')[0]);
    setRating(prod.rating);
    setRatingTouched(true);
    setReview(prod.review);
    setProsInput(prod.pros ? prod.pros.join('\n') : '');
    setConsInput(prod.cons ? prod.cons.join('\n') : '');
    setWouldBuyAgain(prod.wouldBuyAgain || null);
    if (prod.criteria) {
      setCriteriaFlavor(prod.criteria.flavor);
      setCriteriaTexture(prod.criteria.texture);
      setCriteriaValue(prod.criteria.value);
      setCriteriaPackaging(prod.criteria.packaging);
    } else {
      setCriteriaFlavor(prod.rating);
      setCriteriaTexture(prod.rating);
      setCriteriaValue(prod.rating);
      setCriteriaPackaging(prod.rating);
    }
    setTiktokUrl(prod.tiktokUrl || '');
    setImagePreview(prod.imageUrl || '');
    setFormErrors({});
    setActiveTab('new-product');
  };

  const resetForm = () => {
    setEditingProduct(null);
    setTitle('');
    setBarcode('');
    setBarcodeMessage('');
    setScanError('');
    setScannerOpen(false);
    setBrand('');
    setCategory('');
    setMarket('');
    setCustomMarket('');
    setPrice('');
    setWeight('');
    setCalories('');
    setTagsInput('');
    setTastingDate(new Date().toISOString().split('T')[0]);
    setRating(0);
    setRatingTouched(false);
    setReview('');
    setProsInput('');
    setConsInput('');
    setWouldBuyAgain(null);
    setCriteriaFlavor(0);
    setCriteriaTexture(0);
    setCriteriaValue(0);
    setCriteriaPackaging(0);
    setTiktokUrl('');
    setImagePreview('');
    setFormErrors({});
  };

  // Image handling with compression
  const handleImageFile = async (file: File) => {
    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file);
      setImagePreview(compressedDataUrl);
      onShowToast('Görsel başarıyla optimize edilerek eklendi.', 'info');
    } catch {
      onShowToast('Görsel işlenirken hata oluştu.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const lookupBarcode = useCallback(async (rawCode: string) => {
    const code = rawCode.replace(/\s+/g, '').trim();
    setBarcode(code);
    setBarcodeMessage('');

    if (!/^(?:\d{8}|\d{12}|\d{13}|\d{14})$/.test(code)) {
      setBarcodeMessage('Geçerli bir EAN / UPC barkodu girin (8, 12, 13 veya 14 hane).');
      return;
    }

    const existingProduct = products.find((item) => item.barcode === code && item.id !== editingProduct?.id);
    if (existingProduct) {
      setBarcodeMessage(`Bu barkod zaten kayıtlı: ${existingProduct.title}. Aynı ürünü tekrar eklemek yerine Ürünler bölümünden mevcut kaydı düzenleyebilirsin.`);
      return;
    }

    setIsBarcodeLookup(true);
    setBarcodeMessage('Ürün bilgisi barkod veritabanında aranıyor...');

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v3.6/product/${encodeURIComponent(code)}.json?fields=code,product_name,product_name_en,brands,categories,categories_tags,quantity`,
        { headers: { Accept: 'application/json' } }
      );
      if (!response.ok) throw new Error(`Barkod servisi yanıt vermedi (${response.status}).`);

      const payload = await response.json();
      const product = payload?.product;
      if (!product || payload?.status === 0 || !(product.product_name || product.product_name_en)) {
        setBarcodeMessage('Bu barkod veri tabanında bulunamadı. Ürün bilgilerini kendin girebilirsin.');
        return;
      }

      const resolvedName = product.product_name || product.product_name_en;
      if (resolvedName) setTitle(String(resolvedName).trim());
      if (product.brands) setBrand(String(product.brands).split(',')[0].trim());
      if (product.quantity) setWeight(String(product.quantity).trim());

      const categoryTags = Array.isArray(product.categories_tags)
        ? product.categories_tags.join(' ')
        : String(product.categories_tags || '');
      const categoryText = `${product.categories || ''} ${categoryTags}`.toLocaleLowerCase('tr-TR');
      const categoryRules: Array<[RegExp, string]> = [
        [/çikolata|chocolate|cocoa|kakao/, 'Çikolata'],
        [/cips|crisps|chips|potato/, 'Cips'],
        [/gofret|wafer/, 'Gofret'],
        [/bisküvi|biskuvi|biscuit|cookie/, 'Bisküvi'],
        [/şekerleme|sekerleme|candy|sweets|candy bar/, 'Şekerleme'],
        [/içecek|icecek|beverage|drink|soda|juice/, 'İçecek'],
        [/atıştırmalık|atistirmalik|snack/, 'Atıştırmalık'],
      ];
      const matchedCategory = categoryRules.find(([pattern]) => pattern.test(categoryText))?.[1];
      if (matchedCategory && categories.some((item) => item.name === matchedCategory)) {
        setCategory(matchedCategory);
      }

      setBarcodeMessage('Ürün bulundu. Otomatik gelen bilgileri kontrol et; fotoğrafı ve tadım bilgilerini kendin ekle.');
    } catch (error) {
      console.error('Barkod sorgulama hatası:', error);
      setBarcodeMessage('Barkod servisine ulaşılamadı. İnternet bağlantını kontrol et veya bilgileri elle gir.');
    } finally {
      setIsBarcodeLookup(false);
    }
  }, [categories, products, editingProduct]);

  // Cross-browser camera scanning via ZXing; prefers the rear camera on phones.
  useEffect(() => {
    if (!scannerOpen) return;

    let cancelled = false;
    let detectedOnce = false;
    let controls: { stop: () => void } | null = null;

    const startScanner = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Kamera erişimi desteklenmiyor. Güvenli HTTPS bağlantısı gerekli.');
        }
        if (!videoRef.current) return;

        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        if (cancelled || !videoRef.current) return;

        const reader = new BrowserMultiFormatReader();
        controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' } }, audio: false },
          videoRef.current,
          (result) => {
            if (!result || cancelled || detectedOnce) return;
            const code = result.getText().replace(/\D/g, '').trim();
            if (!/^(?:\d{8}|\d{12}|\d{13}|\d{14})$/.test(code)) return;

            detectedOnce = true;
            controls?.stop();
            setBarcode(code);
            setScannerOpen(false);
            void lookupBarcode(code);
          }
        );

        if (cancelled || detectedOnce) controls.stop();
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Kamera açılamadı.';
        setScanError(message.includes('NotAllowed') || message.includes('Permission')
          ? 'Kamera izni verilmedi. Tarayıcı ayarlarından izin ver veya barkodu elle gir.'
          : `${message} Barkod numarasını elle de girebilirsin.`);
      }
    };

    setScanError('');
    void startScanner();

    return () => {
      cancelled = true;
      controls?.stop();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [scannerOpen, lookupBarcode]);

  // Form Submit Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!title.trim()) errors.title = 'Ürün adı zorunludur.';
    if (!ratingTouched) errors.rating = 'Lütfen gerçek Tadımmetre puanını seçin.';
    if (!brand.trim()) errors.brand = 'Marka adı zorunludur.';
    if (!category) errors.category = 'Kategori seçilmelidir.';
    if (!imagePreview.trim()) errors.image = 'Lütfen bir ürün fotoğrafı yükleyin veya çekin.';
    if (isCompressing) errors.image = 'Fotoğrafın hazırlanması tamamlanınca kaydedin.';

    const finalMarket = market === 'Diğer' ? customMarket.trim() : market;
    if (!market || (market === 'Diğer' && !customMarket.trim())) errors.market = 'Satın alınan marketi belirtmelisin.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      onShowToast('Lütfen zorunlu alanları kontrol ediniz.', 'error');
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      const parsedPrice = price.trim() ? parseFloat(price.replace(',', '.')) : undefined;
      if (parsedPrice !== undefined && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
        setFormErrors({ price: 'Geçerli ve sıfırdan küçük olmayan bir fiyat girin.' });
        onShowToast('Fiyat bilgisini kontrol edin.', 'error');
        return;
      }

      const parsedPros = prosInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedCons = consInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedTags = tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const baseSlug = slugify(title.trim());
      let uniqueSlug = baseSlug;
      let slugSuffix = 2;
      while (products.some((item) => item.slug === uniqueSlug && item.id !== editingProduct?.id)) {
        uniqueSlug = `${baseSlug}-${slugSuffix++}`;
      }

      const newOrUpdatedProduct: Product = {
        id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
        slug: uniqueSlug,
        title: title.trim(),
        brand: brand.trim(),
        category,
        barcode: barcode.trim() || undefined,
        market: finalMarket,
        price: isNaN(Number(parsedPrice)) ? undefined : parsedPrice,
        weight: weight.trim() || undefined,
        calories: calories.trim() || undefined,
        tastingDate,
        rating: Math.round(rating * 2) / 2,
        review: review.trim(),
        pros: parsedPros.length > 0 ? parsedPros : undefined,
        cons: parsedCons.length > 0 ? parsedCons : undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        wouldBuyAgain: wouldBuyAgain || undefined,
        criteria: [criteriaFlavor, criteriaTexture, criteriaValue, criteriaPackaging].some((value) => value > 0) ? {
          flavor: criteriaFlavor,
          texture: criteriaTexture,
          value: criteriaValue,
          packaging: criteriaPackaging,
        } : undefined,
        tiktokUrl: tiktokUrl.trim() || undefined,
        imageUrl: imagePreview,
        imageAlt: `${brand.trim()} ${title.trim()} İncelemesi`,
        communityVotes: editingProduct?.communityVotes || { count: 0, totalScore: 0 },
        createdAt: editingProduct ? editingProduct.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      await saveProduct(newOrUpdatedProduct);
      await onRefreshData();

      onShowToast(
        editingProduct ? 'İnceleme başarıyla güncellendi!' : 'Yeni ürün başarıyla yayınlandı!',
        'success',
        'Tadım Kaydedildi'
      );

      resetForm();
      setActiveTab('products');
    } catch {
      onShowToast('Ürün kaydedilirken bir hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteProduct = (prod: Product) => {
    setDeleteModal({
      isOpen: true,
      type: 'product',
      id: prod.id,
      title: 'İncelemeyi Sil',
      message: `"${prod.title}" adlı ürün incelemesini kalıcı olarak silmek istediğinizden emin misiniz?`,
    });
  };

  const confirmDeleteCategory = (cat: Category) => {
    setDeleteModal({
      isOpen: true,
      type: 'category',
      id: cat.id,
      title: 'Kategoriyi Sil',
      message: `"${cat.name}" kategorisini silmek istediğinizden emin misiniz?`,
    });
  };

  const executeDelete = async () => {
    if (deleteModal.type === 'product' && deleteModal.id) {
      await deleteProduct(deleteModal.id);
      await onRefreshData();
      onShowToast('Ürün başarıyla kaldırıldı.', 'info');
    } else if (deleteModal.type === 'category' && deleteModal.id) {
      await deleteCategory(deleteModal.id);
      await onRefreshData();
      onShowToast('Kategori silindi.', 'info');
    }

    setDeleteModal({ ...deleteModal, isOpen: false });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: slugify(newCatName.trim()),
      icon: 'Layers',
    };

    await saveCategory(newCat);
    await onRefreshData();
    setNewCatName('');
    onShowToast(`"${newCat.name}" kategorisi başarıyla eklendi.`, 'success');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...siteSettings };
    if (newPin.trim() && !/^\d{6}$/.test(newPin.trim())) {
      onShowToast('PIN kodu 6 rakamdan oluşmalı.', 'error');
      return;
    }
    if (newPin.trim()) updated.adminPin = newPin.trim();
    await saveSettings(updated);
    await onRefreshData();
    setNewPin('');
    onShowToast('Site ve güvenlik ayarları kaydedildi.', 'success');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = {
      products,
      categories,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tadim-tabagi-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Tüm veri arşivi JSON dosyası olarak indirildi.', 'success');
  };

  // If not authenticated, show PIN modal / screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#171717]">İçerik Yönetim Girişi</h2>
            <p className="text-xs text-stone-500 mt-1">
              {settings.adminPin ? 'Yönetim paneline devam etmek için 6 haneli PIN kodunuzu girin.' : 'İlk kullanım: yalnızca bu tarayıcıda kullanılacak 6 haneli bir PIN oluşturun.'}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={settings.adminPin ? "6 haneli PIN kodunuz" : "Yeni 6 haneli PIN oluşturun"}
                className="w-full text-center text-xl tracking-widest font-mono py-3 px-4 rounded-2xl border border-stone-300 focus:border-[#FF5A1F] focus:outline-hidden"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-500 mt-2 font-bold">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#FF5A1F] hover:bg-[#e04a14] text-white font-extrabold text-sm transition-all shadow-md cursor-pointer"
            >
              Panele Giriş Yap
            </button>
          </form>

          <p className="text-[11px] text-stone-400 leading-relaxed">Bu ön sürümde PIN yalnızca bu tarayıcıdaki panel ekranını kilitler. Gerçek hesap doğrulaması ve cihazlar arası yönetim Supabase bağlantısıyla eklenecek.</p>
        </div>
      </div>
    );
  }

  // Stats calculation
  const totalProductsCount = products.length;
  const totalCategoriesCount = categories.length;
  const avgRating =
    totalProductsCount > 0
      ? (products.reduce((acc, p) => acc + p.rating, 0) / totalProductsCount).toFixed(1)
      : '—';
  const highestProduct = [...products].sort((a, b) => b.rating - a.rating)[0];
  const lowestProduct = [...products].sort((a, b) => a.rating - b.rating)[0];

  const ratingEvaluation = evaluateRating(rating);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#171717] text-white text-[10px] font-black uppercase tracking-wider">
              İÇERİK YÖNETİM MERKEZİ
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Yerel kayıt modu
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            Tadım Tabağı İnceleme Paneli
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            Telefonunuzdan barkod okutun, ürün bilgilerini hızla doldurun, fotoğraf çekin ve gerçek tadım kayıtlarınızı yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              resetForm();
              setActiveTab('new-product');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF5A1F] text-white text-xs sm:text-sm font-extrabold hover:bg-[#e04a14] transition-all shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Ürün Ekle</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            title="Panelden Çık"
          >
            <Unlock className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 text-amber-900">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong>Ön sürüm bilgisi:</strong> Bu aşamada ürünler ve görseller yalnızca bu tarayıcıda saklanır; başka cihazlara veya ziyaretçilere senkronize edilmez. Supabase bağlandığında ortak veri tabanı, güvenli yönetici hesabı ve çevrim içi görsel depolama etkinleştirilecek.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Genel Bakış</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Ürünler ({products.length})</span>
        </button>

        <button
          onClick={() => {
            if (!editingProduct) resetForm();
            setActiveTab('new-product');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'new-product'
              ? 'bg-[#FF5A1F] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingProduct ? 'İncelemeyi Düzenle' : 'Yeni Ürün Ekle'}</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kategoriler ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Site & Güvenlik Ayarları</span>
        </button>
      </div>

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Yayınlanan Ürün
              </span>
              <p className="text-3xl font-black text-[#171717]">{totalProductsCount}</p>
              <p className="text-[11px] text-stone-400 mt-1 font-medium">Toplam inceleme</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Reyon / Kategori
              </span>
              <p className="text-3xl font-black text-[#171717]">{totalCategoriesCount}</p>
              <p className="text-[11px] text-stone-400 mt-1 font-medium">Aktif kategori</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Ort. Tadımmetre
              </span>
              <p className="text-3xl font-black text-[#FF5A1F]">{avgRating}</p>
              <p className="text-[11px] text-stone-400 mt-1 font-medium">Genel ortalama</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                En Yüksek Puan
              </span>
              <p className="text-xl font-black text-emerald-700 truncate">
                {highestProduct ? `${highestProduct.title} (${highestProduct.rating})` : '-'}
              </p>
              <p className="text-[11px] text-stone-400 mt-1 font-medium">Zirvedeki lezzet</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                En Düşük Puan
              </span>
              <p className="text-xl font-black text-red-600 truncate">
                {lowestProduct ? `${lowestProduct.title} (${lowestProduct.rating})` : '-'}
              </p>
              <p className="text-[11px] text-stone-400 mt-1 font-medium">En sert eleştiri</p>
            </div>
          </div>

          {/* Quick List Table */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#171717]">Son İncelenen Ürünler</h3>
                <p className="text-xs text-stone-500">Platformdaki en güncel tadımlar</p>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline"
              >
                Tümünü Yönet
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {products.slice(0, 5).map((p) => {
                const evalData = evaluateRating(p.rating);
                return (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-stone-50 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.imageUrl || '/logo.jpeg'}
                        alt={p.title}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-stone-900 truncate">{p.title}</p>
                        <p className="text-[11px] text-stone-500">
                          {p.brand} • {p.category} • {p.market}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${evalData.badgeBg} ${evalData.badgeText} ${evalData.badgeBorder}`}
                      >
                        {formatScore(p.rating)} / 10
                      </span>
                      <button
                        onClick={() => startEditProduct(p)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#171717]">Tüm Ürün İncelemeleri</h2>
              <p className="text-xs text-stone-500">
                Yayındaki ürünleri görüntüleyin, düzenleyin veya yenilerini ekleyin.
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setActiveTab('new-product');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-extrabold hover:bg-[#e04a14] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Ürün Ekle</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-black border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">Görsel</th>
                  <th className="py-3 px-4">Ürün & Marka</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Market</th>
                  <th className="py-3 px-4">Tadımmetre</th>
                  <th className="py-3 px-4">Fiyat</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {products.map((p) => {
                  const evalData = evaluateRating(p.rating);
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={p.imageUrl || '/logo.jpeg'}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-stone-900">{p.title}</p>
                        <p className="text-[11px] text-stone-500">{p.brand}{p.barcode ? ` · Barkod: ${p.barcode}` : ''}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#FF5A1F]">{p.category}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-700">{p.market}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-xs border ${evalData.badgeBg} ${evalData.badgeText} ${evalData.badgeBorder}`}
                        >
                          {formatScore(p.rating)}
                          <span className="text-[10px] opacity-70">/10</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {p.price ? formatCurrency(p.price) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => onNavigate(`/urun/${p.slug}`)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                          title="Sayfayı Gör"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEditProduct(p)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDeleteProduct(p)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. NEW / EDIT PRODUCT FORM */}
      {activeTab === 'new-product' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF5A1F] text-xs font-black uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{editingProduct ? 'İnceleme Düzenleme' : 'Yeni Ürün Yayınlama Formu'}</span>
              </div>
              <h2 className="text-2xl font-black text-[#171717]">
                {editingProduct ? `İncelemeyi Düzenle: ${editingProduct.title}` : 'Yeni Ürün İncelemesi Ekle'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Ürün bilgilerini, puanlama kriterlerini ve TikTok bağlantısını eksiksiz girin.
              </p>
            </div>

            {editingProduct && (
              <button
                onClick={resetForm}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Yeni Form Aç
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-8">
            {/* Barcode quick entry */}
            <section className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FF5A1F] text-white flex items-center justify-center flex-shrink-0">
                  <Barcode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">Barkodla hızlı ürün tanıma</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">Ürünün barkodunu kamerayla okut veya numarasını yaz. Veritabanında varsa ürün adı, marka ve gramaj otomatik doldurulur. Market, ürün fotoğrafı ve tadım notları sana aittir.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={barcode}
                  onChange={(event) => setBarcode(event.target.value.replace(/[^0-9]/g, '').slice(0, 14))}
                  onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void lookupBarcode(barcode); } }}
                  placeholder="Barkod numarası (EAN / UPC)"
                  className="w-full min-w-0 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm font-mono tracking-wide focus:outline-hidden focus:border-[#FF5A1F]"
                  aria-label="Ürün barkodu"
                />
                <button type="button" onClick={() => void lookupBarcode(barcode)} disabled={isBarcodeLookup || !barcode.trim()} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-extrabold disabled:opacity-50">
                  {isBarcodeLookup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Barcode className="w-4 h-4" />}
                  Barkodu Ara
                </button>
                <button type="button" onClick={() => { setScanError(''); setScannerOpen(true); }} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#FF5A1F] text-[#FF5A1F] bg-white text-xs font-extrabold hover:bg-orange-50">
                  <ScanLine className="w-4 h-4" /> Kamerayla Tara
                </button>
              </div>

              {barcodeMessage && <p className="text-xs text-stone-700 bg-white/80 border border-stone-200 rounded-xl px-3 py-2" role="status">{barcodeMessage}</p>}

              {scannerOpen && (
                <div className="rounded-2xl overflow-hidden border border-stone-300 bg-stone-950">
                  <div className="flex items-center justify-between px-4 py-3 text-white">
                    <span className="text-xs font-bold">Barkodu kamera çerçevesine getir</span>
                    <button type="button" onClick={() => setScannerOpen(false)} className="p-1 rounded-lg hover:bg-white/10" aria-label="Tarayıcıyı kapat"><X className="w-4 h-4" /></button>
                  </div>
                  <video ref={videoRef} playsInline muted className="w-full max-h-72 object-cover" />
                  <div className="px-4 py-3 text-xs text-stone-300">Kamerayı ürünün barkoduna yaklaştır ve çizgileri net tut.</div>
                </div>
              )}
              {scanError && <p className="text-xs text-amber-800 bg-amber-100 rounded-xl px-3 py-2" role="alert">{scanError}</p>}
              <p className="text-[11px] text-stone-500">Ürün adı ve marka eşleşmeleri Open Food Facts açık ürün kataloğundan alınır; kayıtlar eksik veya hatalı olabilir. Kaydetmeden önce bilgileri kontrol et. Ürün fotoğrafını kendin çekmen önerilir.</p>
            </section>

            {/* Top row: Name & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  1. Ürün Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Barkodla bulabilir veya ürün adını yazabilirsin"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F] transition-all ${
                    formErrors.title ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  2. Marka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Örn: Eti, Ülker, Fix Dessert, Patito, Doritos"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F] transition-all ${
                    formErrors.brand ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                  }`}
                />
                {formErrors.brand && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.brand}</p>
                )}
              </div>
            </div>

            {/* Category, Market, Price, Weight, Calories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  3. Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-bold bg-white focus:outline-hidden focus:border-[#FF5A1F]"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && <p className="mt-1 text-xs font-semibold text-red-500">{formErrors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  6. Satın Alınan Market <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-bold bg-white focus:outline-hidden focus:border-[#FF5A1F]"
                  >
                    <option value="">Market seçin</option>
                    {popularMarkets.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    <option value="Diğer">Diğer (Manuel Yaz)</option>
                  </select>

                  {market === 'Diğer' && (
                    <input
                      type="text"
                      value={customMarket}
                      onChange={(e) => setCustomMarket(e.target.value)}
                      placeholder="Market adını yazınız..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium"
                    />
                  )}
                </div>
                {formErrors.market && <p className="mt-1 text-xs font-semibold text-red-500">{formErrors.market}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  7. Satın Alma Fiyatı (₺)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Örn: 42.50"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F] ${formErrors.price ? 'border-red-400 bg-red-50/30' : 'border-stone-200'}`}
                />
                {formErrors.price && <p className="mt-1 text-xs font-semibold text-red-500">{formErrors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  Gramaj / Boyut
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Örn: 180g, 500ml"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {/* Date, Calories & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  8. Tadım Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={tastingDate}
                  onChange={(e) => setTastingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  Enerji / Kalori
                </label>
                <input
                  type="text"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Örn: 520 kcal / 100g"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                  Etiketler (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Örn: TikTok Viral, F/P Kralı, Zirve Lezzet"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {/* TikTok link */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                11. TikTok Video Bağlantısı
              </label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@tadimtabagi/video/..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
              />
            </div>

            {/* FOTOĞRAF YÜKLEME VE KAMERA İLE ÇEKME */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-800">
                    4 & 5. Ürün Fotoğrafı (Dosya Yükle veya Kamerayla Çek) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Telefonunuzdan anında fotoğraf çekebilir veya galerinizden yükleyebilirsiniz.
                  </p>
                </div>
                {isCompressing && (
                  <span className="text-xs font-bold text-[#FF5A1F] animate-pulse">
                    Fotoğraf sıkıştırılıyor...
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-stone-600" />
                  <span>Galeriden Seç</span>
                </button>

                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#00f2fe]" />
                  <span>Kamerayla Çek (Mobil)</span>
                </button>
              </div>

              {imagePreview ? (
                <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-[#FF5A1F] shadow-md group">
                  <img
                    src={imagePreview}
                    alt="Yüklenen Görsel"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview('')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors"
                    title="Görseli Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                    formErrors.image
                      ? 'border-red-400 bg-red-50/30'
                      : 'border-stone-300 hover:border-[#FF5A1F] bg-white'
                  }`}
                >
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700">
                    Fotoğraf seçmek veya çekmek için dokunun
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">Otomatik web optimizasyonu yapılır</p>
                </div>
              )}
              {formErrors.image && (
                <p className="text-xs text-red-500 font-semibold">{formErrors.image}</p>
              )}
            </div>

            {/* 9. TADIMMETRE PUANI SLIDER */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-800">
                    9. Tadımmetre Puanı (0 – 10, 0.5 Artış) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Ana değerlendirme puanı (Sıralamaları ve göstergeleri belirler)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-[#171717]">
                    {ratingTouched ? formatScore(rating) : '—'}
                  </span>
                  <span className="text-xs text-stone-400 font-bold">/10</span>
                  {ratingTouched ? (
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-black uppercase border ${ratingEvaluation.badgeBg} ${ratingEvaluation.badgeText} ${ratingEvaluation.badgeBorder}`}>
                      {ratingEvaluation.label}
                    </span>
                  ) : (
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500 border border-stone-200">Puan seçilmedi</span>
                  )}
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => { setRating(parseFloat(e.target.value)); setRatingTouched(true); }}
                className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-stone-500">Kaydırıcıdan puanı seç. Sıfır vermek istiyorsan ayrıca onayla.</span>
                <button type="button" onClick={() => { setRating(0); setRatingTouched(true); }} className="shrink-0 rounded-lg border border-stone-200 px-3 py-1.5 text-[11px] font-bold text-stone-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F]">0 puan ver</button>
              </div>
              {formErrors.rating && <p className="text-xs font-semibold text-red-600" role="alert">{formErrors.rating}</p>}

              <div className="flex justify-between text-[11px] font-bold text-stone-500">
                <span>0 (Beğenilmedi)</span>
                <span>3.5 (Ort. Altı)</span>
                <span>5.5 (Ortalama)</span>
                <span>7.5 (Beğenildi)</span>
                <span>9.0 - 10 (Muhteşem)</span>
              </div>
            </div>

            {/* DETAYLI KRİTER PUANLARI (Lezzet, Çıtırlık, F/P, Koku) */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
              <span className="block text-xs font-black uppercase tracking-wider text-stone-800">
                Detaylı Kriter Puanları (İsteğe Bağlı)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-600 block mb-1">Lezzet & Denge</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={criteriaFlavor}
                    onChange={(e) => setCriteriaFlavor(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-black"
                  />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-600 block mb-1">Doku & Çıtırlık</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={criteriaTexture}
                    onChange={(e) => setCriteriaTexture(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-black"
                  />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-600 block mb-1">Fiyat / Performans</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={criteriaValue}
                    onChange={(e) => setCriteriaValue(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-black"
                  />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-600 block mb-1">Koku & Ambalaj</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={criteriaPackaging}
                    onChange={(e) => setCriteriaPackaging(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-black"
                  />
                </div>
              </div>
            </div>

            {/* TEKRAR ALIR MIYIM? */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-stone-800">
                Tekrar Satın Alır mıyım?
              </label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setWouldBuyAgain('yes')}
                  className={`py-3 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                    wouldBuyAgain === 'yes'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ✓ Kesinlikle Evet!
                </button>

                <button
                  type="button"
                  onClick={() => setWouldBuyAgain('maybe')}
                  className={`py-3 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                    wouldBuyAgain === 'maybe'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ? Kararsızım / İndirimde
                </button>

                <button
                  type="button"
                  onClick={() => setWouldBuyAgain('no')}
                  className={`py-3 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                    wouldBuyAgain === 'no'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ✕ Hayır, Almam
                </button>
              </div>
            </div>

            {/* 10. ÜRÜN HAKKINDAKİ YORUM */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                10. Ürün Hakkındaki Tadım Yorumu (İsteğe Bağlı)
              </label>
              <textarea
                rows={5}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Ürünün kokusu, ilk ısırık hissi, şeker/tuz dengesi ve damakta bıraktığı tat hakkındaki samimi TikToker yorumunuz..."
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F] transition-all ${
                  formErrors.review ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                }`}
              />
              {formErrors.review && (
                <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.review}</p>
              )}
            </div>

            {/* ARTILARI VE EKSİLERİ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-800 mb-1.5">
                  Artıları (Her satıra bir madde)
                </label>
                <textarea
                  rows={3}
                  value={prosInput}
                  onChange={(e) => setProsInput(e.target.value)}
                  placeholder="Örn:&#10;Yoğun Antep fıstığı&#10;Çıtır kadayıf dokusu"
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-rose-800 mb-1.5">
                  Eksileri (Her satıra bir madde)
                </label>
                <textarea
                  rows={3}
                  value={consInput}
                  onChange={(e) => setConsInput(e.target.value)}
                  placeholder="Örn:&#10;Fiyatı biraz yüksek&#10;Hızlı eriyor"
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 rounded-2xl border border-stone-300 text-stone-700 text-sm font-bold hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Formu Temizle
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#FF5A1F] text-white font-black text-sm hover:bg-[#e04a14] transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSaving ? 'Yayınlanıyor...' : editingProduct ? 'Değişiklikleri Kaydet' : 'İncelemeyi Yayınla'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. KATEGORİLER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-[#171717]">Yeni Kategori Ekle</h3>
            <p className="text-xs text-stone-500">
              Yeni çıkan ürün gruplarını sınıflandırmak için bir kategori tanımlayın.
            </p>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Örn: Dondurma, Soslar, Çekirdek"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF5A1F] text-white text-xs font-extrabold hover:bg-[#e04a14] transition-colors cursor-pointer"
              >
                Kategoriyi Kaydet
              </button>
            </form>
          </div>

          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-[#171717]">Mevcut Kategoriler</h3>
            <div className="divide-y divide-stone-100">
              {categories.map((c) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === c.name.toLowerCase()
                ).length;
                return (
                  <div
                    key={c.id}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-stone-50 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="font-extrabold text-sm text-stone-900">{c.name}</p>
                      <p className="text-xs text-stone-500">{count} ürün kayıtlı</p>
                    </div>

                    <button
                      onClick={() => confirmDeleteCategory(c)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      title="Kategoriyi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. SITE AYARLARI & GÜVENLİK */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-3xl space-y-8">
          <div>
            <h2 className="text-xl font-black text-[#171717]">Site & Güvenlik Ayarları</h2>
            <p className="text-xs text-stone-500 mt-1">
              TikTok profili, site sloganı, admin erişim PIN kodu ve yedekleme seçenekleri.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-800">
                Sosyal Medya & Profil
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  TikTok Profil URL
                </label>
                <input
                  type="url"
                  value={siteSettings.tiktokUrl}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tiktokUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  TikTok Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={siteSettings.tiktokHandle}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tiktokHandle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Site Karşılama Sloganı
                </label>
                <input
                  type="text"
                  value={siteSettings.siteTagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteTagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {/* PIN Settings */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#FF5A1F]" />
                <span>Yönetici PIN Güvenliği</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Yeni 6 Haneli PIN Kodu
                </label>
                <input
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Değiştirmek için 6 rakam girin..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono tracking-widest focus:outline-hidden focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              {/* Export Backup JSON */}
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>Tüm Arşivi İndir (JSON Yedek)</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-extrabold hover:bg-[#e04a14] transition-colors cursor-pointer"
              >
                Ayarları Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
      />
    </div>
  );
};
