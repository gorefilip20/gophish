'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({ rating, size = 14, showValue = false, reviewCount }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(rating) ? 'fill-brand-400 text-brand-400' : 'text-surface-700'}
          />
        ))}
      </div>
      {showValue && <span className="text-sm text-surface-400 ml-1">{rating}</span>}
      {reviewCount !== undefined && (
        <span className="text-sm text-surface-500">({reviewCount})</span>
      )}
    </div>
  );
}
