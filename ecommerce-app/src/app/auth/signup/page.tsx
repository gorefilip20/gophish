'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);

    if (success) {
      router.push('/account');
    } else {
      setError('An account with this email already exists.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-[family-name:var(--font-display)] text-3xl tracking-[0.2em] text-white font-light">
              LUMIERE
            </span>
          </Link>
          <h1 className="text-xl text-white mt-6 mb-2">Create Your Account</h1>
          <p className="text-sm text-surface-500">Join the LUMIERE community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-surface-400 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-surface-400 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-surface-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-surface-400 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat your password"
              className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-surface-500 mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
