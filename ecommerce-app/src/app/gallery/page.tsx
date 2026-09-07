'use client';

import GalleryGrid from '@/components/GalleryGrid';

export default function GalleryPage() {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white">Gallery</h1>
        <p className="text-xs text-surface-400 mt-1">Browse and manage all your generated images and videos</p>
      </div>
      <GalleryGrid />
    </div>
  );
}
