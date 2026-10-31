import React from 'react';
import { ArrowUpRight, Award, CheckCircle2, Heart, Sparkles, Video } from 'lucide-react';

interface AboutPageProps {
  tiktokUrl?: string;
  tiktokHandle?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  tiktokUrl = 'https://www.tiktok.com/@tadimtabagi',
  tiktokHandle = '@tadimtabagi',
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Badge & Title */}
      <div className="text-center space-y-4">
        <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-2">
          <img
            src="/logo.jpeg"
            alt="Tadım Tabağı Maskot"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Hikayemiz & Misyonumuz</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight">
          Tadım Tabağı Hakkında
        </h1>

        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          "Yeni çıkan ürünleri keşfetmek, farklı lezzetleri denemek ve deneyimlerimizi sizlerle paylaşmak için buradayız. Her ürünü kendi deneyimimizle değerlendiriyor ve Tadımmetre puanımızla sizlere sunuyoruz."
        </p>
      </div>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#171717]">Dürüst & Şeffaf Değerlendirme</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Market raflarında gördüğünüz renkli ambalajların arkasındaki gerçek tadı ortaya çıkarıyoruz. Beğenmediğimiz hiçbir ürünü "fena değil" diyerek geçiştirmiyoruz; damak tadımız ne hissettiyse, Tadımmetre ekranına onu yansıtıyoruz.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#171717]">Tadımmetre Sistemi</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            0 ile 10 arasındaki yarım puanlık hassasiyetle ürünleri sınıflandırıyoruz. Böylece bir ürünün vasat mı, parasını hak eden iyi bir seçenek mi, yoksa mutlaka denenmesi gereken bir zirve lezzet mi olduğunu anında görüyorsunuz.
          </p>
        </div>
      </div>

      {/* TikTok Connect Card */}
      <div className="bg-gradient-to-br from-[#171717] via-[#241a17] to-[#120e0d] rounded-3xl p-8 sm:p-10 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00f2fe]">
            <Video className="w-4 h-4" />
            <span>Resmi TikTok Kanalımız</span>
          </div>
          <h2 className="text-2xl font-black">Topluluğumuza Katılın!</h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-md">
            Günde binlerce kişinin izlediği paket açılışları, market keşifleri ve takipçi tadım önerileri TikTok hesabımızda.
          </p>
        </div>

        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF5A1F] text-white font-extrabold hover:bg-[#e04a14] transition-all shadow-md flex-shrink-0"
        >
          <span>TikTok'a Git ({tiktokHandle})</span>
          <ArrowUpRight className="w-5 h-5" />
        </a>
      </div>

      {/* Values checklist */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-4">
        <h3 className="font-black text-lg text-stone-900">İlkelerimiz</h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] flex-shrink-0" />
            <span>Kendi cebimizden satın aldığımız market ürünlerini inceleriz.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] flex-shrink-0" />
            <span>Kötü ürüne kötü, iyi ürüne iyi deme cesaretine sahibiz.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] flex-shrink-0" />
            <span>Market adını ve fiyat bilgisini şeffafça paylaşırız.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] flex-shrink-0" />
            <span>Takipçilerimizin yorum ve önerilerini dikkate alarak yeni ürünler seçeriz.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
