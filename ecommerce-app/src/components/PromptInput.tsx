'use client';

import { useStudio } from '@/context/StudioContext';
import { stylePresets } from '@/data/models';
import { useState } from 'react';

export default function PromptInput() {
  const { settings, updateSettings, generate, isGenerating, generationProgress } = useStudio();
  const [showNegative, setShowNegative] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={settings.prompt}
          onChange={e => updateSettings({ prompt: e.target.value })}
          placeholder="Describe the image you want to generate..."
          rows={4}
          className="w-full bg-surface-800 border border-surface-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-surface-500 resize-none focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-colors"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-2 py-1 text-[10px] font-medium bg-surface-700 hover:bg-surface-600 text-surface-300 rounded-md transition-colors"
          >
            Styles
          </button>
          <span className="text-[10px] text-surface-500">{settings.prompt.length}</span>
        </div>
      </div>

      {showPresets && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-surface-800/50 rounded-lg border border-surface-700/30">
          {stylePresets.map(preset => (
            <button
              key={preset}
              onClick={() => {
                const addition = settings.prompt ? `, ${preset.toLowerCase()}` : preset.toLowerCase();
                updateSettings({ prompt: settings.prompt + addition });
              }}
              className="px-2.5 py-1 text-[11px] bg-surface-700 hover:bg-brand-600/30 hover:text-brand-300 text-surface-300 rounded-full transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowNegative(!showNegative)}
        className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-3.5 h-3.5 transition-transform ${showNegative ? 'rotate-90' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        Negative Prompt
      </button>

      {showNegative && (
        <textarea
          value={settings.negativePrompt}
          onChange={e => updateSettings({ negativePrompt: e.target.value })}
          placeholder="What to exclude from the generation..."
          rows={2}
          className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-surface-200 placeholder:text-surface-500 resize-none focus:outline-none focus:border-brand-500/50 transition-colors"
        />
      )}

      <button
        onClick={generate}
        disabled={!settings.prompt.trim() || isGenerating}
        className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:from-surface-700 disabled:to-surface-700 disabled:text-surface-500 text-white font-medium text-sm rounded-xl transition-all relative overflow-hidden"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating... {Math.min(Math.round(generationProgress), 100)}%
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
            Generate
          </span>
        )}
        {isGenerating && (
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-white/30 transition-all duration-300"
            style={{ width: `${Math.min(generationProgress, 100)}%` }}
          />
        )}
      </button>
    </div>
  );
}
