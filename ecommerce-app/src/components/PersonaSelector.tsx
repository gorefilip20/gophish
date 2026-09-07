'use client';

import { usePersonas } from '@/context/PersonaContext';
import { useStudio } from '@/context/StudioContext';
import { cn } from '@/lib/utils';

export default function PersonaSelector() {
  const { personas } = usePersonas();
  const { settings, updateSettings } = useStudio();

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-surface-300 uppercase tracking-wider">Persona</h3>
      <div className="space-y-1">
        <button
          onClick={() => updateSettings({ persona: null, faceLock: false })}
          className={cn(
            'w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all',
            !settings.persona
              ? 'bg-brand-600/15 border border-brand-500/30'
              : 'bg-surface-800/50 border border-transparent hover:bg-surface-800'
          )}
        >
          <div className="w-7 h-7 rounded-full bg-surface-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-surface-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <span className={cn('text-xs', !settings.persona ? 'text-white' : 'text-surface-400')}>No Persona</span>
        </button>

        {personas.map(persona => (
          <button
            key={persona.id}
            onClick={() => updateSettings({
              persona: persona.id,
              faceLock: persona.faceLockEnabled,
            })}
            className={cn(
              'w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all',
              settings.persona === persona.id
                ? 'bg-brand-600/15 border border-brand-500/30'
                : 'bg-surface-800/50 border border-transparent hover:bg-surface-800'
            )}
          >
            <img
              src={persona.avatar}
              alt={persona.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className={cn('text-xs font-medium', settings.persona === persona.id ? 'text-white' : 'text-surface-300')}>
                {persona.name}
              </p>
              <p className="text-[9px] text-surface-500 truncate">{persona.styleTags.join(' / ')}</p>
            </div>
            {persona.faceLockEnabled && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-brand-400 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
