'use client';

import { useState } from 'react';
import { GeneratedImage, GalleryFilter, GallerySort, ViewMode } from '@/types';
import { useStudio } from '@/context/StudioContext';
import { cn, truncatePrompt, formatRelativeTime } from '@/lib/utils';
import ImageViewer from './ImageViewer';

export default function GalleryGrid() {
  const { gallery, toggleFavorite, removeFromGallery } = useStudio();
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [sort, setSort] = useState<GallerySort>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const filtered = gallery
    .filter(img => {
      if (filter === 'favorites') return img.favorite;
      if (filter === 'images') return img.type === 'image';
      if (filter === 'videos') return img.type === 'video';
      if (filter === 'upscaled') return img.status === 'upscaled';
      return true;
    })
    .sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'prompt') return a.prompt.localeCompare(b.prompt);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const filters: { label: string; value: GalleryFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Favorites', value: 'favorites' },
    { label: 'Images', value: 'images' },
    { label: 'Videos', value: 'videos' },
    { label: 'Upscaled', value: 'upscaled' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-surface-800/50 rounded-lg">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                filter === f.value ? 'bg-brand-600/20 text-brand-400' : 'text-surface-400 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as GallerySort)}
            className="bg-surface-800 border border-surface-700/50 rounded-lg px-2 py-1.5 text-xs text-surface-200 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="prompt">Prompt A-Z</option>
          </select>

          <div className="flex items-center gap-0.5 p-0.5 bg-surface-800/50 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-1.5 rounded', viewMode === 'grid' ? 'bg-surface-700 text-white' : 'text-surface-400')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-1.5 rounded', viewMode === 'list' ? 'bg-surface-700 text-white' : 'text-surface-400')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-surface-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
          <p className="text-sm text-surface-400">No images match this filter</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(img => (
            <div
              key={img.id}
              className="group relative bg-surface-800 rounded-xl overflow-hidden border border-surface-700/30 hover:border-brand-500/30 transition-all cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <div className="aspect-square relative">
                <img
                  src={img.thumbnailUrl}
                  alt={truncatePrompt(img.prompt, 50)}
                  className="w-full h-full object-cover"
                />
                {img.type === 'video' && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-white font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                    Video
                  </div>
                )}
                {img.status === 'upscaled' && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-brand-600/80 rounded text-[9px] text-white font-medium">
                    HD
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-white/80 line-clamp-2">{truncatePrompt(img.prompt, 60)}</p>
                </div>
              </div>
              <div className="p-2 flex items-center justify-between">
                <span className="text-[10px] text-surface-500">{formatRelativeTime(img.createdAt)}</span>
                <button
                  onClick={e => { e.stopPropagation(); toggleFavorite(img.id); }}
                  className="p-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={img.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} className={cn('w-3.5 h-3.5', img.favorite ? 'text-red-400' : 'text-surface-500')}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(img => (
            <div
              key={img.id}
              className="flex items-center gap-3 p-3 bg-surface-800 rounded-xl border border-surface-700/30 hover:border-brand-500/30 transition-all cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.thumbnailUrl}
                alt=""
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white line-clamp-1">{img.prompt}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-surface-500">{img.model}</span>
                  <span className="text-[10px] text-surface-600">|</span>
                  <span className="text-[10px] text-surface-500">{img.aspectRatio}</span>
                  <span className="text-[10px] text-surface-600">|</span>
                  <span className="text-[10px] text-surface-500">{formatRelativeTime(img.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); toggleFavorite(img.id); }}
                className="p-1 shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={img.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} className={cn('w-4 h-4', img.favorite ? 'text-red-400' : 'text-surface-500')}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onToggleFavorite={() => toggleFavorite(selectedImage.id)}
          onDelete={() => { removeFromGallery(selectedImage.id); setSelectedImage(null); }}
        />
      )}
    </div>
  );
}
