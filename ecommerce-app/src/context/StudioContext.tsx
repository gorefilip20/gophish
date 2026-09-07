'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GenerationSettings, GeneratedImage } from '@/types';
import { sampleGallery } from '@/data/presets';
import { defaultNegativePrompt } from '@/data/models';
import { generateId, randomSeed } from '@/lib/utils';

interface StudioContextType {
  settings: GenerationSettings;
  updateSettings: (partial: Partial<GenerationSettings>) => void;
  resetSettings: () => void;
  gallery: GeneratedImage[];
  addToGallery: (image: GeneratedImage) => void;
  removeFromGallery: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isGenerating: boolean;
  generate: () => void;
  generationProgress: number;
}

const defaultSettings: GenerationSettings = {
  prompt: '',
  negativePrompt: defaultNegativePrompt,
  model: 'flux-pro',
  aspectRatio: '1:1',
  steps: 30,
  cfgScale: 7.5,
  seed: null,
  samples: 1,
  persona: null,
  enhancePrompt: false,
  faceLock: false,
};

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [gallery, setGallery] = useState<GeneratedImage[]>(sampleGallery);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const updateSettings = useCallback((partial: Partial<GenerationSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const addToGallery = useCallback((image: GeneratedImage) => {
    setGallery(prev => [image, ...prev]);
  }, []);

  const removeFromGallery = useCallback((id: string) => {
    setGallery(prev => prev.filter(img => img.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setGallery(prev =>
      prev.map(img => img.id === id ? { ...img, favorite: !img.favorite } : img)
    );
  }, []);

  const generate = useCallback(() => {
    if (!settings.prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);

      const placeholders = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1024&h=1024&fit=crop',
      ];
      const randomImg = placeholders[Math.floor(Math.random() * placeholders.length)];

      const newImage: GeneratedImage = {
        id: `gen-${generateId()}`,
        prompt: settings.prompt,
        negativePrompt: settings.negativePrompt,
        model: settings.model,
        aspectRatio: settings.aspectRatio,
        imageUrl: randomImg,
        thumbnailUrl: randomImg.replace('w=1024&h=1024', 'w=300&h=300'),
        width: 1024,
        height: 1024,
        seed: settings.seed ?? randomSeed(),
        steps: settings.steps,
        cfgScale: settings.cfgScale,
        persona: settings.persona,
        createdAt: new Date().toISOString(),
        favorite: false,
        status: 'complete',
        type: settings.model.includes('video') || settings.model.includes('runway') ? 'video' : 'image',
      };
      addToGallery(newImage);
      setIsGenerating(false);
      setGenerationProgress(0);
    }, 3000);
  }, [settings, isGenerating, addToGallery]);

  return (
    <StudioContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        gallery,
        addToGallery,
        removeFromGallery,
        toggleFavorite,
        isGenerating,
        generate,
        generationProgress,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio must be used within StudioProvider');
  return context;
}
