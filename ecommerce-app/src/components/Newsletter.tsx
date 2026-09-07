'use client';

import { useState } from 'react';
import { Send, Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-br from-surface-950 via-surface-950 to-brand-900/20 border border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/5 to-transparent" />
          <div className="relative px-8 py-16 sm:px-16 text-center">
            <p className="text-brand-400 text-xs tracking-[0.3em] uppercase font-medium mb-3">Stay Connected</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-white font-light mb-4">
              Join the Inner Circle
            </h2>
            <p className="text-surface-400 max-w-md mx-auto mb-8">
              Be the first to know about new launches, exclusive offers, and beauty tips from our experts.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-5 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                {submitted ? (
                  <>
                    <Check size={16} />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
