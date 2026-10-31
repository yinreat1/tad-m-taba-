import React from 'react';
import { evaluateRating, formatScore } from '../utils/tadimmetre';
import { Sparkles, ThumbsDown, ThumbsUp, Meh, Frown } from 'lucide-react';

interface TadimmetreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const TadimmetreBadge: React.FC<TadimmetreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const evalData = evaluateRating(score);
  const formatted = formatScore(score);

  const getIcon = () => {
    switch (evalData.level) {
      case 'amazing':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'liked':
        return <ThumbsUp className="w-3.5 h-3.5" />;
      case 'average':
        return <Meh className="w-3.5 h-3.5" />;
      case 'below_average':
        return <Frown className="w-3.5 h-3.5" />;
      case 'disliked':
        return <ThumbsDown className="w-3.5 h-3.5" />;
    }
  };

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${evalData.badgeBg} ${evalData.badgeText} ${evalData.badgeBorder} shadow-xs`}
        title={`Tadımmetre: ${formatted} / 10 - ${evalData.label}`}
      >
        <span>{formatted}</span>
        <span className="text-[10px] opacity-70">/10</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex flex-col items-center p-3 rounded-2xl border ${evalData.badgeBg} ${evalData.badgeBorder} shadow-sm`}>
        <div className="flex items-center gap-1.5">
          <span className={`text-3xl font-black ${evalData.badgeText}`}>
            {formatted}
          </span>
          <span className="text-sm font-semibold opacity-60 text-stone-600">/ 10</span>
        </div>
        {showLabel && (
          <div className="flex items-center gap-1 mt-1 text-xs font-bold uppercase tracking-wider">
            {getIcon()}
            <span className={evalData.badgeText}>{evalData.label}</span>
          </div>
        )}
      </div>
    );
  }

  // Medium (default)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${evalData.badgeBg} ${evalData.badgeText} ${evalData.badgeBorder} shadow-xs`}
    >
      <span className="font-extrabold">{formatted}</span>
      <span className="text-[10px] opacity-70">/10</span>
      {showLabel && (
        <>
          <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
          <span>{evalData.label}</span>
        </>
      )}
    </div>
  );
};
