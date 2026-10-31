import React from 'react';
import { evaluateRating, formatScore } from '../utils/tadimmetre';
import { Sparkles, Award } from 'lucide-react';

interface TadimmetreGaugeProps {
  score: number;
  size?: number;
  showVerdictDetails?: boolean;
}

export const TadimmetreGauge: React.FC<TadimmetreGaugeProps> = ({
  score,
  size = 180,
  showVerdictDetails = true,
}) => {
  const evalData = evaluateRating(score);
  const formatted = formatScore(score);

  // SVG Gauge calculations
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score is 0 to 10
  const normalizedScore = Math.max(0, Math.min(10, score));
  const progressRatio = normalizedScore / 10;
  // Leave a 60 degree gap at bottom for speedometer look
  // Or full circular arc with bottom opening
  const strokeDashoffset = circumference - progressRatio * circumference * 0.75;
  const totalArc = circumference * 0.75;

  return (
    <div className="flex flex-col items-center bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: evalData.hex }}
      />

      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-1.5 text-stone-500 font-semibold text-xs tracking-wider uppercase">
          <Award className="w-4 h-4 text-[#FF5A1F]" />
          <span>TADIMMETRE PUANI</span>
        </div>
        {evalData.level === 'amazing' && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
            Zirve Lezzet
          </span>
        )}
      </div>

      {/* Speedometer Gauge */}
      <div className="relative flex items-center justify-center my-2" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-135"
          width={size}
          height={size}
        >
          {/* Track background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${totalArc} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={evalData.hex}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${totalArc} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline">
            <span
              className="text-5xl font-black tracking-tight"
              style={{ color: evalData.hex }}
            >
              {formatted}
            </span>
            <span className="text-stone-400 font-bold text-lg ml-0.5">/10</span>
          </div>
          <span
            className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 border ${evalData.badgeBg} ${evalData.badgeText} ${evalData.badgeBorder}`}
          >
            {evalData.label}
          </span>
        </div>
      </div>

      {/* Visual scale legend */}
      {showVerdictDetails && (
        <div className="w-full mt-4 pt-3 border-t border-stone-100">
          <div className="flex justify-between items-center text-[10px] text-stone-500 font-medium mb-1">
            <span>0</span>
            <span>3.5</span>
            <span>5.5</span>
            <span>7.5</span>
            <span>10</span>
          </div>
          <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden flex shadow-inner">
            <div className="w-[30%] bg-red-400" title="0 - 3.0: Beğenilmedi" />
            <div className="w-[20%] bg-orange-400" title="3.5 - 5.0: Ortalama Altı" />
            <div className="w-[20%] bg-amber-400" title="5.5 - 7.0: Ortalama" />
            <div className="w-[15%] bg-emerald-400" title="7.5 - 8.5: Beğenildi" />
            <div className="w-[15%] bg-green-500" title="9.0 - 10.0: Muhteşem" />
          </div>

          <p className="text-center text-xs text-stone-600 font-medium mt-3 italic">
            {evalData.level === 'amazing' && 'Kesinlikle kaçırılmaması gereken, damakta iz bırakan bir ürün!'}
            {evalData.level === 'liked' && 'Beklentileri karşılayan, tekrar satın alınmaya değer bir lezzet.'}
            {evalData.level === 'average' && 'Standart bir deneyim, ne çok iyi ne de kötü.'}
            {evalData.level === 'below_average' && 'Eksikleri olan, beklentinin altında kalmış bir ürün.'}
            {evalData.level === 'disliked' && 'Tavsiye edilmeyen, tatmin etmeyen bir deneyim.'}
          </p>
        </div>
      )}
    </div>
  );
};
