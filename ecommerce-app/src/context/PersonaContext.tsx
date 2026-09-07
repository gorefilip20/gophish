'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Persona } from '@/types';
import { samplePersonas } from '@/data/presets';
import { generateId } from '@/lib/utils';

interface PersonaContextType {
  personas: Persona[];
  selectedPersona: Persona | null;
  selectPersona: (id: string | null) => void;
  addPersona: (persona: Omit<Persona, 'id' | 'createdAt' | 'generationCount'>) => void;
  updatePersona: (id: string, partial: Partial<Persona>) => void;
  deletePersona: (id: string) => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personas, setPersonas] = useState<Persona[]>(samplePersonas);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const selectPersona = useCallback((id: string | null) => {
    if (!id) {
      setSelectedPersona(null);
      return;
    }
    setSelectedPersona(prev => {
      const found = personas.find(p => p.id === id) ?? null;
      return found;
    });
  }, [personas]);

  const addPersona = useCallback((data: Omit<Persona, 'id' | 'createdAt' | 'generationCount'>) => {
    const newPersona: Persona = {
      ...data,
      id: `persona-${generateId()}`,
      createdAt: new Date().toISOString().split('T')[0],
      generationCount: 0,
    };
    setPersonas(prev => [newPersona, ...prev]);
  }, []);

  const updatePersona = useCallback((id: string, partial: Partial<Persona>) => {
    setPersonas(prev =>
      prev.map(p => p.id === id ? { ...p, ...partial } : p)
    );
  }, []);

  const deletePersona = useCallback((id: string) => {
    setPersonas(prev => prev.filter(p => p.id !== id));
    setSelectedPersona(prev => prev?.id === id ? null : prev);
  }, []);

  return (
    <PersonaContext.Provider
      value={{ personas, selectedPersona, selectPersona, addPersona, updatePersona, deletePersona }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersonas() {
  const context = useContext(PersonaContext);
  if (!context) throw new Error('usePersonas must be used within PersonaProvider');
  return context;
}
