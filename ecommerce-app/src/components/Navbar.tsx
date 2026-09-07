'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-surface-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/products" className="text-sm tracking-wide text-surface-400 hover:text-brand-400 transition-colors">
              Shop All
            </Link>
            <Link href="/products?category=Skincare" className="text-sm tracking-wide text-surface-400 hover:text-brand-400 transition-colors">
              Skincare
            </Link>
            <Link href="/products?category=Fragrances" className="text-sm tracking-wide text-surface-400 hover:text-brand-400 transition-colors">
              Fragrances
            </Link>
            <Link href="/products?category=Body+Care" className="text-sm tracking-wide text-surface-400 hover:text-brand-400 transition-colors">
              Body Care
            </Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl tracking-[0.2em] text-white font-light">
              LUMIERE
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <form action="/products" method="get">
                  <input
                    type="text"
                    name="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    autoFocus
                    className="bg-surface-950 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50 w-40 lg:w-64"
                  />
                </form>
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-1 text-surface-500">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-surface-400 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}

            <Link
              href={user ? '/account' : '/auth/login'}
              className="p-2 text-surface-400 hover:text-white transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-surface-400 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-brand-500 text-white text-[10px] font-semibold rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-t border-white/5 animate-fade-in">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link href="/products" onClick={() => setMobileOpen(false)} className="text-sm tracking-wide text-surface-300 hover:text-brand-400 transition-colors py-2">
              Shop All
            </Link>
            <Link href="/products?category=Skincare" onClick={() => setMobileOpen(false)} className="text-sm tracking-wide text-surface-300 hover:text-brand-400 transition-colors py-2">
              Skincare
            </Link>
            <Link href="/products?category=Fragrances" onClick={() => setMobileOpen(false)} className="text-sm tracking-wide text-surface-300 hover:text-brand-400 transition-colors py-2">
              Fragrances
            </Link>
            <Link href="/products?category=Body+Care" onClick={() => setMobileOpen(false)} className="text-sm tracking-wide text-surface-300 hover:text-brand-400 transition-colors py-2">
              Body Care
            </Link>
            <Link href="/products?category=Hair+Care" onClick={() => setMobileOpen(false)} className="text-sm tracking-wide text-surface-300 hover:text-brand-400 transition-colors py-2">
              Hair Care
            </Link>
            <Link href="/products?category=Wellness" onClick={() => setMobileOpen(false)} className="text-sm tracking-wide text-surface-300 hover:text-brand-400 transition-colors py-2">
              Wellness
            </Link>
            <Link href="/products?category=Gift+Sets" onClick={() => setMobileOpen(false)} className="text-sm tracking-wide text-surface-300 hover:text-brand-400 transition-colors py-2">
              Gift Sets
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
