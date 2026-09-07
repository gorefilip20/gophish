'use client';

import { useStudio } from '@/context/StudioContext';
import { aspectRatios } from '@/data/models';
import { cn } from '@/lib/utils';

export default function AspectRatioSelector() {
  const { settings, updateSettings } = useStudio();

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-surface-300 uppercase tracking-wider">Aspect Ratio</h3>
      <div className="grid grid-cols-4 gap-1.5">
        {aspectRatios.map(ratio => {
          const isActive = settings.aspectRatio === ratio.value;
          const w = ratio.width / ratio.height;
          const displayW = Math.min(w * 20, 28);
          const displayH = Math.min(20 / w, 28);

          return (
            <button
              key={ratio.value}
              onClick={() => updateSettings({ aspectRatio: ratio.value })}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all',
                isActive
                  ? 'bg-brand-600/15 border border-brand-500/30'
                  : 'bg-surface-800/50 border border-transparent hover:bg-surface-800'
              )}
            >
              <div
                className={cn(
                  'border-2 rounded-sm',
                  isActive ? 'border-brand-400' : 'border-surface-500'
                )}
                style={{ width: displayW, height: displayH }}
              />
              <span className={cn(
                'text-[10px] font-medium',
                isActive ? 'text-brand-400' : 'text-surface-400'
              )}>
                {ratio.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
