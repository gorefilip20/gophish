'use client';

import { useState } from 'react';
import { Persona } from '@/types';
import { usePersonas } from '@/context/PersonaContext';

interface PersonaEditorProps {
  persona?: Persona;
  onClose: () => void;
}

const defaultFormData = {
  name: '',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  description: '',
  styleTags: [] as string[],
  faceLockEnabled: false,
  faceReferenceUrl: null as string | null,
  basePrompt: '',
  negativePrompt: 'cartoon, anime, blurry, deformed',
  preferredModel: 'flux-pro',
  gender: '',
  age: '',
  ethnicity: '',
  bodyType: '',
  hairStyle: '',
  hairColor: '',
};

export default function PersonaEditor({ persona, onClose }: PersonaEditorProps) {
  const { addPersona, updatePersona } = usePersonas();
  const [form, setForm] = useState(persona ? {
    name: persona.name,
    avatar: persona.avatar,
    description: persona.description,
    styleTags: persona.styleTags,
    faceLockEnabled: persona.faceLockEnabled,
    faceReferenceUrl: persona.faceReferenceUrl,
    basePrompt: persona.basePrompt,
    negativePrompt: persona.negativePrompt,
    preferredModel: persona.preferredModel,
    gender: persona.gender,
    age: persona.age,
    ethnicity: persona.ethnicity,
    bodyType: persona.bodyType,
    hairStyle: persona.hairStyle,
    hairColor: persona.hairColor,
  } : defaultFormData);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (persona) {
      updatePersona(persona.id, form);
    } else {
      addPersona(form);
    }
    onClose();
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.styleTags.includes(tag)) {
      setForm(prev => ({ ...prev, styleTags: [...prev.styleTags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, styleTags: prev.styleTags.filter(t => t !== tag) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-surface-900 rounded-2xl border border-surface-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-surface-900 border-b border-surface-700/50 p-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-semibold text-white">{persona ? 'Edit Persona' : 'New Persona'}</h2>
          <button onClick={onClose} className="text-surface-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] text-surface-400 mb-1 block">Name</label>
              <input
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Persona name"
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-[11px] text-surface-400 mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this persona's aesthetic..."
                rows={2}
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 resize-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[11px] text-surface-400 mb-1 block">Base Prompt</label>
              <textarea
                value={form.basePrompt}
                onChange={e => setForm(prev => ({ ...prev, basePrompt: e.target.value }))}
                placeholder="Core prompt describing this persona..."
                rows={2}
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-surface-400 mb-1 block">Gender</label>
              <input
                value={form.gender}
                onChange={e => setForm(prev => ({ ...prev, gender: e.target.value }))}
                placeholder="e.g., Female"
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>

            <div>
              <label className="text-[11px] text-surface-400 mb-1 block">Age</label>
              <input
                value={form.age}
                onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
                placeholder="e.g., 25"
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>

            <div>
              <label className="text-[11px] text-surface-400 mb-1 block">Ethnicity</label>
              <input
                value={form.ethnicity}
                onChange={e => setForm(prev => ({ ...prev, ethnicity: e.target.value }))}
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>

            <div>
              <label className="text-[11px] text-surface-400 mb-1 block">Body Type</label>
              <input
                value={form.bodyType}
                onChange={e => setForm(prev => ({ ...prev, bodyType: e.target.value }))}
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>

            <div>
              <label className="text-[11px] text-surface-400 mb-1 block">Hair Style</label>
              <input
                value={form.hairStyle}
                onChange={e => setForm(prev => ({ ...prev, hairStyle: e.target.value }))}
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>

            <div>
              <label className="text-[11px] text-surface-400 mb-1 block">Hair Color</label>
              <input
                value={form.hairColor}
                onChange={e => setForm(prev => ({ ...prev, hairColor: e.target.value }))}
                className="w-full bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-surface-400 mb-1 block">Style Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                className="flex-1 bg-surface-800 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            {form.styleTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.styleTags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-600/15 text-brand-400 rounded-full text-[10px]">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-[11px] text-surface-400">Face Lock</label>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, faceLockEnabled: !prev.faceLockEnabled }))}
              className={`w-8 h-4.5 rounded-full transition-colors relative ${
                form.faceLockEnabled ? 'bg-brand-500' : 'bg-surface-600'
              }`}
            >
              <span
                className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  form.faceLockEnabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-surface-800 text-surface-300 border border-surface-700/50 text-xs font-medium rounded-lg hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-medium rounded-lg hover:from-brand-500 hover:to-brand-400 transition-all"
            >
              {persona ? 'Save Changes' : 'Create Persona'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
