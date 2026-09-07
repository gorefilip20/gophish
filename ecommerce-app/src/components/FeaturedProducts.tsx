'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-brand-400 text-xs tracking-[0.3em] uppercase font-medium mb-3">Curated For You</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-white font-light">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors group"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
