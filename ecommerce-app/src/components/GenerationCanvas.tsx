'use client';

import { useStudio } from '@/context/StudioContext';
import { truncatePrompt, formatRelativeTime } from '@/lib/utils';

export default function GenerationCanvas() {
  const { gallery, isGenerating, generationProgress } = useStudio();
  const recentImages = gallery.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        {isGenerating ? (
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-600/10 animate-pulse" />
              <div className="absolute inset-2 rounded-xl bg-surface-800 flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin w-8 h-8 text-brand-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-lg font-semibold text-white">{Math.min(Math.round(generationProgress), 100)}%</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-surface-300">Generating your image...</p>
            <p className="text-xs text-surface-500 mt-1">This usually takes a few seconds</p>
          </div>
        ) : recentImages.length > 0 ? (
          <div className="w-full max-w-2xl space-y-4">
            <h3 className="text-xs font-medium text-surface-400 uppercase tracking-wider">Recent Generations</h3>
            <div className="grid grid-cols-2 gap-3">
              {recentImages.map(img => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden bg-surface-800 border border-surface-700/30">
                  <div className="aspect-square">
                    <img src={img.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white/80 line-clamp-2">{truncatePrompt(img.prompt, 80)}</p>
                    <p className="text-[9px] text-surface-400 mt-1">{formatRelativeTime(img.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-surface-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-white mb-1">Create Something Amazing</h3>
            <p className="text-xs text-surface-400 max-w-xs mx-auto">
              Enter a prompt and select your model to start generating AI images and videos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
