'use client';

import { GeneratedImage } from '@/types';
import { formatDate } from '@/lib/utils';
import { aiModels } from '@/data/models';

interface ImageViewerProps {
  image: GeneratedImage;
  onClose: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

export default function ImageViewer({ image, onClose, onToggleFavorite, onDelete }: ImageViewerProps) {
  const model = aiModels.find(m => m.id === image.model);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-surface-900 rounded-2xl border border-surface-700/50 max-w-4xl w-full max-h-[90vh] flex flex-col lg:flex-row overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1 bg-surface-950 flex items-center justify-center min-h-[300px] lg:min-h-0">
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="max-w-full max-h-[60vh] lg:max-h-[85vh] object-contain"
          />
        </div>

        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-surface-700/50 p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Details</h3>
            <button onClick={onClose} className="text-surface-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-surface-500 uppercase tracking-wider">Prompt</label>
              <p className="text-xs text-surface-200 mt-1 leading-relaxed">{image.prompt}</p>
            </div>

            {image.negativePrompt && (
              <div>
                <label className="text-[10px] text-surface-500 uppercase tracking-wider">Negative Prompt</label>
                <p className="text-[11px] text-surface-400 mt-1">{image.negativePrompt}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-surface-500 uppercase tracking-wider">Model</label>
                <p className="text-xs text-surface-200 mt-0.5">{model?.icon} {model?.name ?? image.model}</p>
              </div>
              <div>
                <label className="text-[10px] text-surface-500 uppercase tracking-wider">Aspect Ratio</label>
                <p className="text-xs text-surface-200 mt-0.5">{image.aspectRatio}</p>
              </div>
              <div>
                <label className="text-[10px] text-surface-500 uppercase tracking-wider">Resolution</label>
                <p className="text-xs text-surface-200 mt-0.5">{image.width} x {image.height}</p>
              </div>
              <div>
                <label className="text-[10px] text-surface-500 uppercase tracking-wider">Seed</label>
                <p className="text-xs text-surface-200 mt-0.5 font-mono">{image.seed}</p>
              </div>
              <div>
                <label className="text-[10px] text-surface-500 uppercase tracking-wider">Steps</label>
                <p className="text-xs text-surface-200 mt-0.5">{image.steps}</p>
              </div>
              <div>
                <label className="text-[10px] text-surface-500 uppercase tracking-wider">CFG Scale</label>
                <p className="text-xs text-surface-200 mt-0.5">{image.cfgScale}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-surface-500 uppercase tracking-wider">Created</label>
              <p className="text-xs text-surface-200 mt-0.5">{formatDate(image.createdAt)}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onToggleFavorite}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  image.favorite
                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                    : 'bg-surface-800 text-surface-300 border border-surface-700/50 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={image.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                {image.favorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-600/15 text-brand-400 border border-brand-500/30 rounded-lg text-xs font-medium hover:bg-brand-600/25 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Upscale
              </button>
            </div>

            <button
              onClick={onDelete}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-surface-800 text-surface-400 border border-surface-700/50 rounded-lg text-xs font-medium hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
