'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ChevronLeft, Check, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

type Step = 'information' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const [step, setStep] = useState<Step>('information');
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    if (user) {
      addOrder({
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        items: [...items],
        total,
        status: 'processing',
      });
    }

    clearCart();
    setProcessing(false);
    setStep('confirmation');
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-surface-700 mx-auto mb-4" />
          <h1 className="text-xl text-white mb-2">Your cart is empty</h1>
          <p className="text-surface-500 mb-6 text-sm">Add some products before checking out.</p>
          <Link href="/products" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-400" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-white mb-4">Order Confirmed!</h1>
          <p className="text-surface-400 mb-2">Thank you for your purchase. Your order has been placed successfully.</p>
          <p className="text-sm text-surface-500 mb-8">A confirmation email will be sent to {form.email}.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors">
              Continue Shopping
            </Link>
            {user && (
              <Link href="/account" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-lg text-sm font-medium transition-colors">
                View Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-8">
          <ChevronLeft size={16} />
          Continue Shopping
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step === 'information' ? 'bg-brand-500 text-white' : 'bg-brand-500/20 text-brand-400'
            }`}>1</div>
            <span className={`text-sm ${step === 'information' ? 'text-white' : 'text-surface-500'}`}>Information</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step === 'payment' ? 'bg-brand-500 text-white' : 'bg-white/5 text-surface-500'
            }`}>2</div>
            <span className={`text-sm ${step === 'payment' ? 'text-white' : 'text-surface-500'}`}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            {step === 'information' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-medium text-white">Contact & Shipping</h2>

                <div>
                  <label className="block text-sm text-surface-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-surface-400 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={e => updateField('firstName', e.target.value)}
                      className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-400 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={e => updateField('lastName', e.target.value)}
                      className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-surface-400 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => updateField('address', e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-surface-400 mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => updateField('city', e.target.value)}
                      className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-400 mb-1.5">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={e => updateField('state', e.target.value)}
                      className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-400 mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={e => updateField('zip', e.target.value)}
                      className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep('payment')}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-xl font-medium transition-colors mt-4"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-white">Payment</h2>
                  <button
                    onClick={() => setStep('information')}
                    className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Edit Information
                  </button>
                </div>

                <div className="bg-surface-950/50 border border-white/5 rounded-xl p-4 mb-4">
                  <p className="text-sm text-surface-400">
                    Shipping to: {form.firstName} {form.lastName}, {form.address}, {form.city} {form.state} {form.zip}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-surface-500 mb-4">
                  <CreditCard size={18} />
                  <span className="text-sm">Credit or Debit Card</span>
                </div>

                <div>
                  <label className="block text-sm text-surface-400 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={e => updateField('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-surface-400 mb-1.5">Name on Card</label>
                  <input
                    type="text"
                    value={form.nameOnCard}
                    onChange={e => updateField('nameOnCard', e.target.value)}
                    className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-surface-400 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={form.expiry}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        updateField('expiry', val);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-400 mb-1.5">CVC</label>
                    <input
                      type="text"
                      value={form.cvc}
                      onChange={e => updateField('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-surface-500 pt-2">
                  <Lock size={14} />
                  <span>Your payment information is secure and encrypted. This is a simulated checkout.</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-colors mt-4 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing Order...
                    </>
                  ) : (
                    <>Place Order &mdash; {formatPrice(total)}</>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-surface-950 rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-medium text-white mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-brand-500 text-white text-[10px] font-bold rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.product.name}</p>
                      <p className="text-xs text-surface-500">{item.selectedSize} {item.selectedColor}</p>
                    </div>
                    <span className="text-sm text-white">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Tax</span>
                  <span className="text-white">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-white/5">
                  <span className="text-white">Total</span>
                  <span className="text-brand-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
