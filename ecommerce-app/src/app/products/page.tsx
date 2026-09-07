'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Grid3X3, LayoutGrid, Search, X } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { SortOption } from '@/types';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [category, sortBy, searchQuery, priceRange]);

  return (
    <div className="min-h-screen">
      <div className="bg-surface-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl text-white font-light">
            {category === 'All' ? 'All Products' : category}
          </h1>
          <p className="text-surface-400 mt-3">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-8">
              <div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-surface-950 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-surface-300 mb-3">Category</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        category === cat
                          ? 'bg-brand-500/10 text-brand-400'
                          : 'text-surface-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-surface-300 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={300}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex items-center justify-between text-sm text-surface-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-surface-300 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="w-full bg-surface-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors bg-surface-950 border border-white/10 rounded-lg px-4 py-2"
              >
                <SlidersHorizontal size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className="hidden lg:flex items-center justify-end gap-2 mb-6">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded-lg transition-colors ${gridCols === 3 ? 'bg-white/10 text-white' : 'text-surface-500 hover:text-white'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded-lg transition-colors ${gridCols === 4 ? 'bg-white/10 text-white' : 'text-surface-500 hover:text-white'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-surface-500 text-lg mb-2">No products found</p>
                <p className="text-surface-600 text-sm">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => { setCategory('All'); setSearchQuery(''); setPriceRange([0, 300]); }}
                  className="mt-4 text-brand-400 hover:text-brand-300 text-sm transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-5`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
