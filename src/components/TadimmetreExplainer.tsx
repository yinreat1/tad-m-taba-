import React, { useState } from 'react';
import { evaluateRating, formatScore } from '../utils/tadimmetre';
import { Award, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TadimmetreExplainer: React.FC = () => {
  const [sampleScore, setSampleScore] = useState<number>(8.5);
  const evalData = evaluateRating(sampleScore);

  const tiers = [
    {
      range: '9.0 – 10.0',
      label: 'Muhteşem',
      desc: 'Kusursuz lezzet dengesi, kaliteli malzeme, kaçırılmaması gereken zirve ürünler.',
      color: 'bg-green-500 text-white',
      border: 'border-green-300',
      bgLight: 'bg-green-50',
    },
    {
      range: '7.5 – 8.5',
      label: 'Beğenildi',
      desc: 'Oldukça lezzetli, parasının karşılığını veren ve tekrar satın alınacak ürünler.',
      color: 'bg-emerald-500 text-white',
      border: 'border-emerald-300',
      bgLight: 'bg-emerald-50',
    },
    {
      range: '5.5 – 7.0',
      label: 'Ortalama',
      desc: 'Yenilebilir, standart kalitede ancak unutulmaz bir lezzet bırakmayan ürünler.',
      color: 'bg-amber-400 text-amber-950',
      border: 'border-amber-300',
      bgLight: 'bg-amber-50',
    },
    {
      range: '3.5 – 5.0',
      label: 'Ortalama Altı',
      desc: 'Eksikleri olan, şeker/tuz dengesi zayıf veya beklentinin altında kalan ürünler.',
      color: 'bg-orange-500 text-white',
      border: 'border-orange-300',
      bgLight: 'bg-orange-50',
    },
    {
      range: '0 – 3.0',
      label: 'Beğenilmedi',
      desc: 'Tavsiye edilmeyen, tatmin etmeyen veya hayal kırıklığı yaratan ürünler.',
      color: 'bg-red-500 text-white',
      border: 'border-red-300',
      bgLight: 'bg-red-50',
    },
  ];

  return (
    <section className="bg-stone-50/80 rounded-3xl p-6 sm:p-12 border border-stone-200/90 my-16">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] text-xs font-black uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Kendi Değerlendirme Sistemimiz</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Tadımmetre Nedir?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tadımmetre, denediğimiz market ürünlerini kendi tadım deneyimimize göre dürüstçe ve 0.5 hassasiyetle 10 üzerinden değerlendirdiğimiz puanlama sistemidir.
          </p>
        </div>

        {/* Interactive Try-It Slider */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                İnteraktif Deneyim
              </span>
              <h3 className="text-xl font-extrabold text-[#171717]">
                Puanı Kaydırın ve Anlamını Görün
              </h3>
              <p className="text-xs text-stone-500 max-w-md">
                Tadımmetre 0 ile 10 arasında yarım puanlık (0.5) artışlarla çalışır:
              </p>
            </div>

            {/* Current Score Output */}
            <div className="flex items-center gap-3 bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200">
              <div className="text-right">
                <span className="text-3xl font-black text-[#171717]">
                  {formatScore(sampleScore)}
                </span>
                <span className="text-xs text-stone-500 font-bold ml-1">/10</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${evalData.badgeBg} ${evalData.badgeText} border ${evalData.badgeBorder}`}
              >
                {evalData.label}
              </span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="mt-6">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={sampleScore}
              onChange={(e) => setSampleScore(parseFloat(e.target.value))}
              className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
              aria-label="Tadımmetre deneme puanı"
            />
            <div className="flex justify-between text-[11px] font-bold text-stone-600 mt-2">
              <span>0 (En Kötü)</span>
              <span>2.5</span>
              <span>5.0 (Ortalama Altı)</span>
              <span>7.5 (İyi)</span>
              <span>10 (Kusursuz)</span>
            </div>
          </div>
        </div>

        {/* 5 Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.range}
              className={`p-5 rounded-2xl border ${tier.border} ${tier.bgLight} transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${tier.color}`}>
                    {tier.range}
                  </span>
                  <span className="text-sm font-black text-stone-900">{tier.label}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed mt-2">{tier.desc}</p>
              </div>
            </div>
          ))}

          {/* Philosophy Card */}
          <div className="p-5 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF5A1F]" />
              <span className="text-xs font-black uppercase text-[#FF5A1F]">Tarafsızlık İlkesi</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Değerlendirmeler, ürünü deneyen içerik üreticisinin kişisel tadım görüşüne dayanır. Market ve fiyat bilgisi ürün incelemesinde ayrıca paylaşılır.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
