import { AppSettings, Category, Product } from '../types';
import { slugify } from '../utils/tadimmetre';

const DB_NAME = 'tadim_tabagi_prod_v2';
const DB_VERSION = 2;
const STORE_PRODUCTS = 'products';
const STORE_CATEGORIES = 'categories';
const STORE_SETTINGS = 'settings';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Çikolata', slug: 'cikolata', icon: 'Candy', description: 'Tablet, dolgulu ve gurme çikolata incelemeleri' },
  { id: 'cat-2', name: 'Cips', slug: 'cips', icon: 'Flame', description: 'Patates, mısır, fırınlanmış ve acı cips tadımları' },
  { id: 'cat-3', name: 'Bisküvi', slug: 'biskuvi', icon: 'Cookie', description: 'Kremalı, yulaflı ve çay yanı bisküvileri' },
  { id: 'cat-4', name: 'Gofret', slug: 'gofret', icon: 'Layers', description: 'Çıtır kat kat gofretler ve çikolata kaplamalar' },
  { id: 'cat-5', name: 'Şekerleme', slug: 'sekerleme', icon: 'Sparkles', description: 'Jelibon, yumuşak şeker ve ekşi şekerlemeler' },
  { id: 'cat-6', name: 'İçecek', slug: 'icecek', icon: 'CupSoda', description: 'Soğuk çaylar, gazlı içecekler ve meyveli maden suları' },
  { id: 'cat-7', name: 'Atıştırmalık', slug: 'atistirmalik', icon: 'Utensils', description: 'Kuruyemişler, krakerler ve protein barlar' },
  { id: 'cat-8', name: 'Kahvaltılık', slug: 'kahvaltilik', icon: 'Coffee', description: 'Kakaolu fındık kremaları, gevrekler ve ezmeler' },
  { id: 'cat-9', name: 'Diğer', slug: 'diger', icon: 'Package', description: 'Soslar, ithal ürünler ve sürpriz lezzetler' },
];

export const INITIAL_SETTINGS: AppSettings = {
  siteTitle: 'Tadım Tabağı',
  siteTagline: 'Yeni lezzetler, gerçek deneyimler!',
  tiktokUrl: 'https://www.tiktok.com/@tadimtabagi',
  tiktokHandle: '@tadimtabagi',
  creatorName: 'Tadım Tabağı',
  aboutText:
    'Yeni çıkan ürünleri keşfetmek, farklı lezzetleri denemek ve deneyimlerimizi sizlerle paylaşmak için buradayız. Her ürünü kendi deneyimimizle değerlendiriyor ve Tadımmetre puanımızla sizlere sunuyoruz.',
  adminPin: '',
};

// The catalog intentionally starts empty. Legacy generated demo records are removed once on load.
export const INITIAL_PRODUCTS: Product[] = [];

const LEGACY_DEMO_PRODUCT_IDS = new Set([
  'prod-dubai-cikolatasi',
  'prod-eti-karam-gurme',
  'prod-patito-barbeku',
  'prod-milka-oreo',
  'prod-didi-seftali',
  'prod-haribo-altin-ayicik-eksi',
  'prod-tadim-antep-fistigi',
  'prod-doritos-risk',
  'prod-bebeto-eksi-karpuz',
]);

function removeLegacyDemoProducts(products: Product[]): Product[] {
  return products.filter((product) => !product.isDemo && !LEGACY_DEMO_PRODUCT_IDS.has(product.id));
}


// Open IndexedDB instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
        db.createObjectStore(STORE_PRODUCTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
        db.createObjectStore(STORE_CATEGORIES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const LOCAL_STORAGE_KEY_PRODUCTS = 'tadim_prod_products_v2';
const LOCAL_STORAGE_KEY_CATEGORIES = 'tadim_prod_categories_v2';
const LOCAL_STORAGE_KEY_SETTINGS = 'tadim_prod_settings_v2';
const LOCAL_STORAGE_KEY_FAVORITES = 'tadim_prod_favorites_v2';

// Listeners for multi-component reactivity
type DBChangeListener = () => void;
const listeners = new Set<DBChangeListener>();

export function subscribeToDBChanges(listener: DBChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyDBChanged() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in DB listener:', e);
    }
  });
}

// PRODUCTS API
export async function getProducts(): Promise<Product[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PRODUCTS, 'readonly');
      const store = tx.objectStore(STORE_PRODUCTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const stored = (req.result || []) as Product[];
        const clean = removeLegacyDemoProducts(stored);
        if (clean.length === stored.length) {
          resolve(clean);
          return;
        }

        // Remove only the known generated sample records; keep any products the owner added.
        const writeTx = db.transaction(STORE_PRODUCTS, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_PRODUCTS);
        stored
          .filter((product) => !clean.some((item) => item.id === product.id))
          .forEach((product) => writeStore.delete(product.id));
        writeTx.oncomplete = () => resolve(clean);
        writeTx.onerror = () => resolve(clean);
      };
      req.onerror = () => resolve(getProductsFromLocalStorage());
    });
  } catch {
    return getProductsFromLocalStorage();
  }
}

function getProductsFromLocalStorage(): Product[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
    if (!saved) return [];
    const stored = JSON.parse(saved) as Product[];
    const clean = removeLegacyDemoProducts(stored);
    if (clean.length !== stored.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export async function saveProduct(product: Product, notify = true): Promise<void> {
  if (!product.slug) {
    product.slug = slugify(product.title);
  }
  product.updatedAt = Date.now();

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PRODUCTS, 'readwrite');
      const store = tx.objectStore(STORE_PRODUCTS);
      const req = store.put(product);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = getProductsFromLocalStorage();
    const index = list.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.push(product);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(list));
  }

  if (notify) {
    notifyDBChanged();
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PRODUCTS, 'readwrite');
      const store = tx.objectStore(STORE_PRODUCTS);
      const req = store.delete(productId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = getProductsFromLocalStorage().filter((p) => p.id !== productId);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(list));
  }
  notifyDBChanged();
}

/**
 * Community Voting API
 * Lets visitors vote on products (1 to 10)
 */
export async function submitProductVote(productId: string, userScore: number): Promise<Product | null> {
  const products = await getProducts();
  const product = products.find((p) => p.id === productId || p.slug === productId);
  if (!product) return null;

  const currentVotes = product.communityVotes || { count: 0, totalScore: 0 };
  const updatedVotes = {
    count: currentVotes.count + 1,
    totalScore: currentVotes.totalScore + userScore,
  };

  const updatedProduct: Product = {
    ...product,
    communityVotes: updatedVotes,
  };

  await saveProduct(updatedProduct);
  return updatedProduct;
}

// FAVORITES / WISHLIST API
export function getFavoriteProductIds(): string[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FAVORITES);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteProductId(productId: string): boolean {
  try {
    const favs = getFavoriteProductIds();
    const index = favs.indexOf(productId);
    let isFav = false;
    if (index >= 0) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.push(productId);
      isFav = true;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_FAVORITES, JSON.stringify(favs));
    notifyDBChanged();
    return isFav;
  } catch {
    return false;
  }
}

// CATEGORIES API
export async function getCategories(): Promise<Category[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CATEGORIES, 'readonly');
      const store = tx.objectStore(STORE_CATEGORIES);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result as Category[];
        if (!list || list.length === 0) {
          saveInitialCategories().then(resolve);
        } else {
          resolve(list);
        }
      };
      req.onerror = () => resolve(getCategoriesFromLocalStorage());
    });
  } catch {
    return getCategoriesFromLocalStorage();
  }
}

async function saveInitialCategories(): Promise<Category[]> {
  for (const cat of INITIAL_CATEGORIES) {
    await saveCategory(cat, false);
  }
  notifyDBChanged();
  return INITIAL_CATEGORIES;
}

function getCategoriesFromLocalStorage(): Category[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export async function saveCategory(category: Category, notify = true): Promise<void> {
  if (!category.slug) {
    category.slug = slugify(category.name);
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CATEGORIES, 'readwrite');
      const store = tx.objectStore(STORE_CATEGORIES);
      const req = store.put(category);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = getCategoriesFromLocalStorage();
    const index = list.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(list));
  }

  if (notify) {
    notifyDBChanged();
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CATEGORIES, 'readwrite');
      const store = tx.objectStore(STORE_CATEGORIES);
      const req = store.delete(categoryId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = getCategoriesFromLocalStorage().filter((c) => c.id !== categoryId);
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(list));
  }
  notifyDBChanged();
}

// SETTINGS API
export async function getSettings(): Promise<AppSettings> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.get('main_settings');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          const storedSettings = req.result.value as AppSettings;
          // Remove the old public demo PIN; first admin visit will create a new one.
          if (storedSettings.adminPin === '1234') {
            const migrated = { ...storedSettings, adminPin: '' };
            saveSettings(migrated).then(() => resolve(migrated));
          } else {
            resolve(storedSettings);
          }
        } else {
          saveSettings(INITIAL_SETTINGS).then(() => resolve(INITIAL_SETTINGS));
        }
      };
      req.onerror = () => resolve(getSettingsFromLocalStorage());
    });
  } catch {
    return getSettingsFromLocalStorage();
  }
}

function getSettingsFromLocalStorage(): AppSettings {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (!saved) return INITIAL_SETTINGS;
    const parsed = JSON.parse(saved) as AppSettings;
    if (parsed.adminPin === '1234') {
      const migrated = { ...parsed, adminPin: '' };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(migrated));
      return migrated;
    }
    return parsed;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.put({ key: 'main_settings', value: settings });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }
  notifyDBChanged();
}

export async function resetAllData(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_PRODUCTS, STORE_CATEGORIES, STORE_SETTINGS], 'readwrite');
    tx.objectStore(STORE_PRODUCTS).clear();
    tx.objectStore(STORE_CATEGORIES).clear();
    tx.objectStore(STORE_SETTINGS).clear();
  } catch {
    // ignore
  }

  localStorage.removeItem(LOCAL_STORAGE_KEY_PRODUCTS);
  localStorage.removeItem(LOCAL_STORAGE_KEY_CATEGORIES);
  localStorage.removeItem(LOCAL_STORAGE_KEY_SETTINGS);

  for (const cat of INITIAL_CATEGORIES) {
    await saveCategory(cat, false);
  }
  await saveSettings(INITIAL_SETTINGS);
  notifyDBChanged();
}

/**
 * Image compressor utility:
 * Resizes large camera photos down to max 1200px width/height
 * and compresses as WebP or JPEG (quality 0.85) to avoid storage bloat.
 */
export async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Görsel yüklenemedi'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsDataURL(file);
  });
}
