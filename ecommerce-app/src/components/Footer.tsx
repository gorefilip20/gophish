import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-[0.2em] text-white font-light">
              LUMIERE
            </span>
            <p className="mt-4 text-sm text-surface-500 leading-relaxed">
              Luxury beauty and lifestyle products crafted with the finest ingredients for the modern connoisseur.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-surface-300 mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/products?category=Skincare" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">Skincare</Link></li>
              <li><Link href="/products?category=Fragrances" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">Fragrances</Link></li>
              <li><Link href="/products?category=Body+Care" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">Body Care</Link></li>
              <li><Link href="/products?category=Hair+Care" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">Hair Care</Link></li>
              <li><Link href="/products?category=Wellness" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">Wellness</Link></li>
              <li><Link href="/products?category=Gift+Sets" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-surface-300 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-surface-500 cursor-default">About Us</span></li>
              <li><span className="text-sm text-surface-500 cursor-default">Sustainability</span></li>
              <li><span className="text-sm text-surface-500 cursor-default">Press</span></li>
              <li><span className="text-sm text-surface-500 cursor-default">Careers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-surface-300 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-surface-500 cursor-default">Contact Us</span></li>
              <li><span className="text-sm text-surface-500 cursor-default">Shipping & Returns</span></li>
              <li><span className="text-sm text-surface-500 cursor-default">FAQ</span></li>
              <li><span className="text-sm text-surface-500 cursor-default">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} LUMIERE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-surface-600">Free shipping on orders over $100</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
