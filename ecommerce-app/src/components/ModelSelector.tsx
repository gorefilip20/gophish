'use client';

import { useStudio } from '@/context/StudioContext';
import { aiModels } from '@/data/models';
import { cn } from '@/lib/utils';

export default function ModelSelector() {
  const { settings, updateSettings } = useStudio();
  const imageModels = aiModels.filter(m => m.type === 'image');
  const videoModels = aiModels.filter(m => m.type === 'video');

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-surface-300 uppercase tracking-wider">AI Model</h3>

      <div className="space-y-1.5">
        <p className="text-[10px] text-surface-500 font-medium">Image Models</p>
        {imageModels.map(model => (
          <button
            key={model.id}
            onClick={() => updateSettings({ model: model.id })}
            className={cn(
              'w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all',
              settings.model === model.id
                ? 'bg-brand-600/15 border border-brand-500/30 ring-1 ring-brand-500/10'
                : 'bg-surface-800/50 border border-transparent hover:bg-surface-800 hover:border-surface-700/50'
            )}
          >
            <span className="text-base mt-0.5">{model.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white">{model.name}</span>
                <span className={cn(
                  'px-1.5 py-0.5 text-[9px] font-medium rounded-full',
                  model.quality === 'ultra' ? 'bg-brand-600/20 text-brand-400' :
                  model.quality === 'high' ? 'bg-accent-600/20 text-accent-400' :
                  'bg-surface-700 text-surface-400'
                )}>
                  {model.quality}
                </span>
              </div>
              <p className="text-[10px] text-surface-400 mt-0.5 line-clamp-1">{model.description}</p>
              <div className="flex gap-1 mt-1">
                {model.strengths.map(s => (
                  <span key={s} className="px-1.5 py-0.5 text-[9px] bg-surface-700/50 text-surface-400 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] text-surface-500 font-medium">Video Models</p>
        {videoModels.map(model => (
          <button
            key={model.id}
            onClick={() => updateSettings({ model: model.id })}
            className={cn(
              'w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all',
              settings.model === model.id
                ? 'bg-brand-600/15 border border-brand-500/30 ring-1 ring-brand-500/10'
                : 'bg-surface-800/50 border border-transparent hover:bg-surface-800 hover:border-surface-700/50'
            )}
          >
            <span className="text-base mt-0.5">{model.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white">{model.name}</span>
                <span className={cn(
                  'px-1.5 py-0.5 text-[9px] font-medium rounded-full',
                  model.speed === 'slow' ? 'bg-warning-500/20 text-warning-400' : 'bg-success-500/20 text-success-400'
                )}>
                  {model.speed}
                </span>
              </div>
              <p className="text-[10px] text-surface-400 mt-0.5 line-clamp-1">{model.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
