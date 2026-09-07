'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, shipping, total, itemCount } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#0f0f0f] border-l border-white/5 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-brand-400" />
            <h2 className="text-lg font-medium text-white">Your Cart</h2>
            <span className="text-sm text-surface-500">({itemCount} items)</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-surface-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag size={48} className="text-surface-700 mb-4" />
            <p className="text-surface-400 mb-2">Your cart is empty</p>
            <p className="text-sm text-surface-600 mb-6">Discover our collection and add something you love.</p>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4 bg-surface-950 rounded-xl p-3 border border-white/5">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.selectedSize && <span className="text-xs text-surface-500">{item.selectedSize}</span>}
                      {item.selectedColor && <span className="text-xs text-surface-500">{item.selectedColor}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-surface-400 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-surface-400 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">{formatPrice(item.product.price * item.quantity)}</span>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                          className="p-1.5 text-surface-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Shipping</span>
                <span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-brand-400">You qualify for free shipping!</p>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-white/5">
                <span className="text-white">Total</span>
                <span className="text-brand-400">{formatPrice(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-lg font-medium transition-colors mt-2"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-sm text-surface-400 hover:text-white transition-colors py-2"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
