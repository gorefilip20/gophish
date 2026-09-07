'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.variants.sizes?.[0];
    const defaultColor = product.variants.colors?.[0]?.name;
    addItem(product, 1, defaultColor, defaultSize);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div
        className="relative overflow-hidden rounded-xl bg-surface-950 border border-white/5 transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-brand-500/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[isHovered && product.images[1] ? 1 : 0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-brand-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
              {getDiscountPercentage(product.price, product.originalPrice)}% Off
            </span>
          )}

          {product.bestSeller && !product.originalPrice && (
            <span className="absolute top-3 left-3 bg-white/90 text-black text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Add to wishlist"
          >
            <Heart size={16} className={wishlisted ? 'fill-brand-400 text-brand-400' : ''} />
          </button>

          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-white text-black text-sm font-medium py-2.5 rounded-lg hover:bg-brand-400 hover:text-white transition-colors"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-xs text-surface-500 mt-1 line-clamp-1">{product.description}</p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-surface-600 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <StarRating rating={product.rating} size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}
