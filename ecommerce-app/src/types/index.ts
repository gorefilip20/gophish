export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'image' | 'video';
  description: string;
  strengths: string[];
  speed: 'fast' | 'medium' | 'slow';
  quality: 'standard' | 'high' | 'ultra';
  maxResolution: string;
  icon: string;
}

export interface AspectRatio {
  label: string;
  value: string;
  width: number;
  height: number;
}

export interface GenerationSettings {
  prompt: string;
  negativePrompt: string;
  model: string;
  aspectRatio: string;
  steps: number;
  cfgScale: number;
  seed: number | null;
  samples: number;
  persona: string | null;
  enhancePrompt: boolean;
  faceLock: boolean;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  negativePrompt: string;
  model: string;
  aspectRatio: string;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  seed: number;
  steps: number;
  cfgScale: number;
  persona: string | null;
  createdAt: string;
  favorite: boolean;
  status: 'generating' | 'complete' | 'failed' | 'upscaled';
  type: 'image' | 'video';
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  description: string;
  styleTags: string[];
  faceLockEnabled: boolean;
  faceReferenceUrl: string | null;
  basePrompt: string;
  negativePrompt: string;
  preferredModel: string;
  gender: string;
  age: string;
  ethnicity: string;
  bodyType: string;
  hairStyle: string;
  hairColor: string;
  createdAt: string;
  generationCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
}

export type ViewMode = 'grid' | 'list';
export type GalleryFilter = 'all' | 'favorites' | 'images' | 'videos' | 'upscaled';
export type GallerySort = 'newest' | 'oldest' | 'prompt';
