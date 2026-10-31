# Tadım Tabağı

Tadım Tabağı; gerçek ürün tadımlarını, ürün fotoğraflarını, satın alınan market bilgilerini, TikTok inceleme bağlantılarını ve Tadımmetre puanlarını sergileyen mobil uyumlu bir React + TypeScript sitesidir.

## Gereksinimler

- Node.js **22.12 veya üzeri** (önerilen: 22.16.0)
- npm 10 veya üzeri

## Windows'ta çalıştırma

1. ZIP dosyasını bir klasöre çıkar.
2. Klasörü Visual Studio Code ile aç.
3. Terminal > New Terminal bölümünü aç.
4. Aşağıdaki komutları sırayla çalıştır:

```powershell
npm install
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcıda aç (varsayılan: `http://localhost:3000`).

## Derleme kontrolü

```powershell
npm run typecheck
npm run build
npm run preview
```

Üretim dosyaları `dist/` klasörüne oluşturulur. `npm run preview`, üretim derlemesini yerelde kontrol etmek içindir; gerçek yayın sunucusu değildir.

## GitHub'a yükleme

ZIP'i açtıktan sonra **içindeki tüm dosyaları** yeni GitHub deposunun köküne yükle. `package.json`, `index.html`, `src/`, `public/` ve `vercel.json` depo kökünde bulunmalıdır. `node_modules/` veya `dist/` klasörlerini GitHub'a yükleme.

## Vercel yayınlama ayarları

1. Vercel'de **Add New → Project** seç.
2. GitHub deposunu içe aktar.
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Install Command: `npm install`.
8. Deploy seç.

Vercel proje ayarlarında Node.js sürümünü 22.x olarak seç. `vercel.json`, `/urun/...` gibi doğrudan açılan sayfaların yenilemede de uygulamaya yönlendirilmesini sağlar. Vercel HTTPS sunduğu için mobil tarayıcıdan kamera izni istenebilir.

## Bu sürümde bulunanlar

- Gerçek incelemeler için boş ürün kataloğu; örnek ürün otomatik eklenmez.
- Ürün ekleme, düzenleme, silme ve JSON yedekleme.
- Ürün fotoğrafı yükleme ve mobil cihaz kamerasından fotoğraf çekme.
- EAN / UPC barkod numarası girerek Open Food Facts kataloğunda arama.
- ZXing ile cihaz kamerasından barkod tarama; mobilde arka kamera tercih edilir.
- Barkod bulunduğunda ürün adı, marka, gramaj ve uygun kategori önerisini otomatik doldurma.
- Market, fiyat, Tadımmetre puanı ve TikTok bağlantısı girme.
- Ürün, kategori, puan ve market filtreleri; favori listesi ve sıralamalar.
- Temiz ürün URL'leri ve doğrudan sayfa yenileme desteği.
- Mobil uyumlu yönetim paneli ve sayfa altı bilgilendirmeleri.

## Önemli: Bu sürümün veri saklama sınırı

Bu ara sürümde ürünler, fotoğraflar, kategoriler, ayarlar ve PIN yalnızca kullanıldığı tarayıcıda (IndexedDB / gerektiğinde localStorage) tutulur. Bu veriler başka telefona veya ziyaretçiye otomatik olarak aktarılmaz. Tarayıcı verileri silinirse kayıtlar da kaybolabilir. Başka cihazlardan ortak veri erişimi ve gerçek kullanıcı yetkilendirmesi için bir sonraki aşamada Supabase Auth, PostgreSQL ve Storage bağlanmalıdır.

PIN bu sürümde yalnızca yerel arayüz kilididir; sunucu tarafında güvenlik veya gerçek yönetici kimlik doğrulaması sağlamaz. Bu nedenle Supabase bağlanana kadar bu sürümü herkese açık gerçek yönetim sistemi olarak değerlendirme.

## Barkod arama hakkında

Barkod eşleştirmesi Open Food Facts'in açık, topluluk katkılı ürün kataloğundan yapılır. Her ürün bulunmayabilir; isim, marka ve gramaj verileri eksik veya hatalı olabilir. Kaydetmeden önce bilgileri kontrol et. Market, fiyat, tadım notu ve ürün fotoğrafı içerik üreticisi tarafından girilir. Kamera taraması için kamera izni ve HTTPS (veya localhost) gerekir; kamera açılamazsa barkod numarası elle girilebilir.

## Teknoloji

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React
- ZXing Browser
- IndexedDB (bu ara sürümde yerel kayıt)
