'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('cart');
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch {}
    }
  }, [items, mounted]);

  const addItem = useCallback((product: Product, quantity = 1, color?: string, size?: string) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.selectedColor === color && i.selectedSize === size
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedColor === color && i.selectedSize === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, color?: string, size?: string) => {
    setItems(prev => prev.filter(
      i => !(i.product.id === productId && i.selectedColor === color && i.selectedSize === size)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeItem(productId, color, size);
      return;
    }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.selectedColor === color && i.selectedSize === size
        ? { ...i, quantity }
        : i
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart,
      itemCount, subtotal, shipping, tax, total,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
