'use client';

import { useState } from 'react';
import { usePersonas } from '@/context/PersonaContext';
import { Persona } from '@/types';
import PersonaCard from '@/components/PersonaCard';
import PersonaEditor from '@/components/PersonaEditor';

export default function PersonasPage() {
  const { personas, deletePersona } = usePersonas();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | undefined>(undefined);

  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona);
    setEditorOpen(true);
  };

  const handleNew = () => {
    setEditingPersona(undefined);
    setEditorOpen(true);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white">Personas</h1>
          <p className="text-xs text-surface-400 mt-1">Manage AI influencer personas for consistent character generation</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-medium rounded-lg hover:from-brand-500 hover:to-brand-400 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Persona
        </button>
      </div>

      {personas.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-surface-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <p className="text-sm text-surface-400">No personas yet</p>
          <p className="text-xs text-surface-500 mt-1">Create your first AI influencer persona to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {personas.map(persona => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onEdit={() => handleEdit(persona)}
              onDelete={() => deletePersona(persona.id)}
            />
          ))}
        </div>
      )}

      {editorOpen && (
        <PersonaEditor
          persona={editingPersona}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}
