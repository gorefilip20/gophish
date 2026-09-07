'use client';

import { Persona } from '@/types';
import { cn } from '@/lib/utils';

interface PersonaCardProps {
  persona: Persona;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PersonaCard({ persona, onEdit, onDelete }: PersonaCardProps) {
  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700/30 hover:border-brand-500/20 transition-all overflow-hidden">
      <div className="relative h-32 bg-gradient-to-br from-brand-600/20 to-accent-600/10">
        <img
          src={persona.avatar}
          alt={persona.name}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full border-4 border-surface-800 object-cover"
        />
      </div>

      <div className="pt-10 pb-4 px-4 text-center">
        <h3 className="text-sm font-semibold text-white">{persona.name}</h3>
        <p className="text-[11px] text-surface-400 mt-1 line-clamp-2">{persona.description}</p>

        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {persona.styleTags.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[9px] bg-brand-600/15 text-brand-400 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-surface-700/30">
          <div>
            <p className="text-xs font-medium text-white">{persona.generationCount}</p>
            <p className="text-[9px] text-surface-500">Generations</p>
          </div>
          <div>
            <p className="text-xs font-medium text-white">{persona.age}</p>
            <p className="text-[9px] text-surface-500">Age</p>
          </div>
          <div>
            <p className="text-xs font-medium text-white">
              {persona.faceLockEnabled ? (
                <span className="text-brand-400">On</span>
              ) : (
                <span className="text-surface-500">Off</span>
              )}
            </p>
            <p className="text-[9px] text-surface-500">Face Lock</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onEdit}
            className="flex-1 py-2 bg-surface-700 hover:bg-surface-600 text-surface-200 text-xs font-medium rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-surface-700 hover:bg-red-500/15 text-surface-400 hover:text-red-400 text-xs rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
