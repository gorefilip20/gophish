'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TopBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-14 bg-surface-900/80 backdrop-blur-md border-b border-surface-700/50 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-surface-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="text-sm font-medium text-white">Generation Studio</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 rounded-lg border border-surface-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-brand-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <span className="text-xs text-surface-200">500 credits</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-medium">
          U
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-surface-900 border-b border-surface-700/50 p-4 lg:hidden">
          <nav className="space-y-2">
            <Link href="/studio" className="block px-3 py-2 text-sm text-surface-200 hover:text-white rounded-lg hover:bg-surface-800" onClick={() => setMobileMenuOpen(false)}>Studio</Link>
            <Link href="/gallery" className="block px-3 py-2 text-sm text-surface-200 hover:text-white rounded-lg hover:bg-surface-800" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
            <Link href="/personas" className="block px-3 py-2 text-sm text-surface-200 hover:text-white rounded-lg hover:bg-surface-800" onClick={() => setMobileMenuOpen(false)}>Personas</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
