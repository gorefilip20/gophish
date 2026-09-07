'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/studio', label: 'Studio', icon: 'M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42' },
  { href: '/gallery', label: 'Gallery', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z' },
  { href: '/personas', label: 'Personas', icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 lg:w-56 bg-surface-900 border-r border-surface-700/50 flex flex-col">
      <div className="flex items-center gap-2 px-3 lg:px-4 h-14 border-b border-surface-700/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
          AI
        </div>
        <span className="hidden lg:block text-sm font-semibold text-white tracking-wide">AI Studio</span>
      </div>

      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-surface-300 hover:bg-surface-800 hover:text-white'
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 lg:p-3 border-t border-surface-700/50">
        <div className="flex items-center gap-2 px-2 lg:px-3 py-2 rounded-lg bg-surface-800/50">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 shrink-0" />
          <div className="hidden lg:block min-w-0">
            <p className="text-xs font-medium text-white truncate">Pro Plan</p>
            <p className="text-[10px] text-surface-400">500 credits</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
