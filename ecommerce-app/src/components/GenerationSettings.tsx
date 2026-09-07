'use client';

import { useStudio } from '@/context/StudioContext';
import { randomSeed } from '@/lib/utils';

export default function GenerationSettings() {
  const { settings, updateSettings } = useStudio();

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-surface-300 uppercase tracking-wider">Settings</h3>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-surface-400">Steps</label>
            <span className="text-[11px] text-surface-300 font-mono">{settings.steps}</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            value={settings.steps}
            onChange={e => updateSettings({ steps: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-surface-400">CFG Scale</label>
            <span className="text-[11px] text-surface-300 font-mono">{settings.cfgScale}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={settings.cfgScale}
            onChange={e => updateSettings({ cfgScale: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-surface-400">Samples</label>
            <span className="text-[11px] text-surface-300 font-mono">{settings.samples}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={settings.samples}
            onChange={e => updateSettings({ samples: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-surface-400">Seed</label>
            <button
              onClick={() => updateSettings({ seed: randomSeed() })}
              className="text-[10px] text-brand-400 hover:text-brand-300 transition-colors"
            >
              Random
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={settings.seed ?? ''}
              onChange={e => updateSettings({ seed: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="Random"
              className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="text-[11px] text-surface-400">Enhance Prompt</label>
          <button
            onClick={() => updateSettings({ enhancePrompt: !settings.enhancePrompt })}
            className={`w-8 h-4.5 rounded-full transition-colors relative ${
              settings.enhancePrompt ? 'bg-brand-500' : 'bg-surface-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                settings.enhancePrompt ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="text-[11px] text-surface-400">Face Lock</label>
          <button
            onClick={() => updateSettings({ faceLock: !settings.faceLock })}
            className={`w-8 h-4.5 rounded-full transition-colors relative ${
              settings.faceLock ? 'bg-brand-500' : 'bg-surface-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                settings.faceLock ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
