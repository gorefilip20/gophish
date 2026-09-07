'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, LogOut, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile(editName, editEmail);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-surface-950/50 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center">
              <User size={28} className="text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white">{user.name}</h1>
              <p className="text-sm text-surface-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 border-b border-white/5 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-brand-400 text-brand-400'
                : 'border-transparent text-surface-500 hover:text-white'
            }`}
          >
            <User size={16} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-brand-400 text-brand-400'
                : 'border-transparent text-surface-500 hover:text-white'
            }`}
          >
            <Package size={16} />
            Orders ({user.orders.length})
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="max-w-lg animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Profile Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Save size={14} />
                    Save
                  </button>
                  <button
                    onClick={() => { setEditing(false); setEditName(user.name); setEditEmail(user.email); }}
                    className="flex items-center gap-1 text-sm text-surface-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-surface-400 mb-1.5">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                  />
                ) : (
                  <p className="text-white text-sm bg-surface-950 rounded-lg px-4 py-3 border border-white/5">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-surface-400 mb-1.5">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full bg-surface-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50"
                  />
                ) : (
                  <p className="text-white text-sm bg-surface-950 rounded-lg px-4 py-3 border border-white/5">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-surface-400 mb-1.5">Member Since</label>
                <p className="text-white text-sm bg-surface-950 rounded-lg px-4 py-3 border border-white/5">{user.joinedDate}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors mt-10"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            {user.orders.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="text-surface-700 mx-auto mb-4" />
                <p className="text-surface-400 mb-2">No orders yet</p>
                <p className="text-sm text-surface-600 mb-6">Your order history will appear here.</p>
                <Link href="/products" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map(order => (
                  <div key={order.id} className="bg-surface-950 rounded-xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-white">Order {order.id}</p>
                        <p className="text-xs text-surface-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatPrice(order.total)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-brand-500/10 text-brand-400'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3 text-sm">
                          <span className="text-surface-400">{item.quantity}x</span>
                          <span className="text-white">{item.product.name}</span>
                          {item.selectedSize && <span className="text-surface-500">({item.selectedSize})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
