'use client';

import Link from 'next/link';
import Image from 'next/image';

const categoryData = [
  {
    name: 'Skincare',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop',
    description: 'Radiance & renewal',
  },
  {
    name: 'Fragrances',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop',
    description: 'Signature scents',
  },
  {
    name: 'Body Care',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=400&fit=crop',
    description: 'Nourish & glow',
  },
  {
    name: 'Wellness',
    image: 'https://images.unsplash.com/photo-1602607616907-f36d7be41c1e?w=600&h=400&fit=crop',
    description: 'Mind & body',
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 lg:py-28 bg-surface-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-400 text-xs tracking-[0.3em] uppercase font-medium mb-3">Explore</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-white font-light">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryData.map(cat => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs text-brand-300 uppercase tracking-wider mb-1">{cat.description}</p>
                <h3 className="text-xl font-medium text-white">{cat.name}</h3>
              </div>
              <div className="absolute inset-0 border border-white/0 group-hover:border-brand-400/30 rounded-xl transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
