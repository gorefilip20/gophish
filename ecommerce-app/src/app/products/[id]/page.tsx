'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Truck, Shield, RotateCcw, Star, ChevronLeft, Minus, Plus, Check } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Product not found</h1>
          <Link href="/products" className="text-brand-400 hover:text-brand-300 transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    const size = selectedSize || product.variants.sizes?.[0];
    const color = selectedColor || product.variants.colors?.[0]?.name;
    addItem(product, quantity, color, size);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-950 border border-white/5">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.originalPrice && (
                <span className="absolute top-4 left-4 bg-brand-500 text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                  {getDiscountPercentage(product.price, product.originalPrice)}% Off
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-brand-400' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:py-4">
            <p className="text-xs text-brand-400 uppercase tracking-[0.2em] font-medium mb-2">{product.category}</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-white font-light mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={product.rating} showValue reviewCount={product.reviewCount} />
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-surface-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-surface-400 leading-relaxed mb-8">{product.description}</p>

            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-surface-300 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        (selectedSize || product.variants.sizes?.[0]) === size
                          ? 'bg-brand-500/10 border-brand-500/50 text-brand-400'
                          : 'border-white/10 text-surface-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants.colors && product.variants.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-surface-300 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-colors ${
                        (selectedColor || product.variants.colors?.[0]?.name) === color.name
                          ? 'border-brand-400'
                          : 'border-white/10'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-sm font-medium text-surface-300 mb-3">Quantity</h3>
              <div className="flex items-center gap-1 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-950 border border-white/10 text-surface-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-950 border border-white/10 text-surface-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-medium transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-brand-500 hover:bg-brand-600 text-white'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </>
                )}
              </button>
              <button className="w-14 flex items-center justify-center rounded-xl border border-white/10 text-surface-400 hover:text-brand-400 hover:border-brand-400/30 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-white/5">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-brand-400" />
                <span className="text-xs text-surface-400">Free Shipping<br />Over $100</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={20} className="text-brand-400" />
                <span className="text-xs text-surface-400">Authentic<br />Products</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-brand-400" />
                <span className="text-xs text-surface-400">30-Day<br />Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-12">
          <div className="flex gap-8 border-b border-white/5 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'description'
                  ? 'border-brand-400 text-brand-400'
                  : 'border-transparent text-surface-500 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-brand-400 text-brand-400'
                  : 'border-transparent text-surface-500 hover:text-white'
              }`}
            >
              Reviews ({product.reviews.length})
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="max-w-3xl">
              <p className="text-surface-300 leading-relaxed">{product.longDescription}</p>
            </div>
          ) : (
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-semibold text-white">{product.rating}</div>
                  <StarRating rating={product.rating} size={16} />
                  <p className="text-xs text-surface-500 mt-1">{product.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5 ml-8">
                  {[5, 4, 3, 2, 1].map(stars => {
                    const count = product.reviews.filter(r => r.rating === stars).length;
                    const percentage = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-surface-500 w-3">{stars}</span>
                        <Star size={12} className="text-brand-400 fill-brand-400" />
                        <div className="flex-1 h-2 bg-surface-950 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-400 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-xs text-surface-500 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {product.reviews.map(review => (
                <div key={review.id} className="bg-surface-950 rounded-xl p-6 border border-white/5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{review.author}</span>
                        {review.verified && (
                          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                    <span className="text-xs text-surface-600">{review.date}</span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-2">{review.title}</h4>
                  <p className="text-sm text-surface-400 leading-relaxed">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-white/5 pt-12 pb-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-white font-light mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
