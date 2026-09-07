'use client';

import PromptInput from '@/components/PromptInput';
import ModelSelector from '@/components/ModelSelector';
import AspectRatioSelector from '@/components/AspectRatioSelector';
import GenerationSettings from '@/components/GenerationSettings';
import PersonaSelector from '@/components/PersonaSelector';
import GenerationCanvas from '@/components/GenerationCanvas';
import { useState } from 'react';

export default function StudioPage() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <GenerationCanvas />
        <div className="border-t border-surface-700/50 bg-surface-900/50 p-4">
          <div className="max-w-2xl mx-auto">
            <PromptInput />
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="lg:hidden fixed bottom-4 right-4 z-30 w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>

      <aside className={`${showSettings ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden lg:block'} w-full lg:w-72 xl:w-80`}>
        {showSettings && <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setShowSettings(false)} />}
        <div className={`${showSettings ? 'absolute right-0 top-0 h-full' : ''} w-72 xl:w-80 bg-surface-900 border-l border-surface-700/50 h-full overflow-y-auto p-4 space-y-6`}>
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-sm font-medium text-white">Settings</h2>
            <button onClick={() => setShowSettings(false)} className="text-surface-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <PersonaSelector />
          <ModelSelector />
          <AspectRatioSelector />
          <GenerationSettings />
        </div>
      </aside>
    </div>
  );
}
