"use client";

import { WHITEPAPER_CHAPTERS } from "@/lib/constants";

/**
 * Chapter jump navigation. Chapters map to anchor sections on the page; the
 * PDF reader renders alongside. Clicking scrolls to the chapter marker.
 */
export function ChapterSidebar() {
  return (
    <nav className="sticky top-24 space-y-1">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-heritage-gold/80">
        Contents
      </p>
      {WHITEPAPER_CHAPTERS.map((ch) => (
        <a
          key={ch.id}
          href={`#${ch.id}`}
          className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-heritage-paper/65 transition-colors hover:bg-heritage-gold/10 hover:text-heritage-paper"
        >
          <span className="w-8 shrink-0 font-serif text-heritage-gold/70 group-hover:text-heritage-gold">
            {ch.roman}
          </span>
          <span>{ch.title}</span>
        </a>
      ))}
    </nav>
  );
}
