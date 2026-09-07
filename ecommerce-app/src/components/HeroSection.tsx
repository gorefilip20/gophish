'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=1080&fit=crop"
          alt="Luxury beauty"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-brand-400 text-sm tracking-[0.3em] uppercase font-medium mb-6 animate-fade-in">
            Premium Collection
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl lg:text-7xl text-white font-light leading-[1.1] mb-6 animate-slide-up">
            Elevate Your
            <span className="block italic text-brand-300">Beauty Ritual</span>
          </h1>
          <p className="text-lg text-surface-300 max-w-lg mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover our curated collection of luxury skincare, fragrances, and wellness products crafted with the finest ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-lg text-sm font-medium tracking-wide transition-all hover:gap-3"
            >
              Shop Collection
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/products?category=Gift+Sets"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-lg text-sm font-medium tracking-wide transition-all"
            >
              Gift Sets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
