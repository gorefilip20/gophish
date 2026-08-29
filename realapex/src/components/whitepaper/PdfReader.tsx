"use client";

import { useCallback, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { ZoomIn, ZoomOut, Search, Loader2, FileWarning } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";

// Load the pdf.js worker from a version-matched CDN (react-pdf's documented
// approach for bundlers). Keeps the worker out of the app bundle and always
// matches the installed pdfjs-dist version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FILE = `/${BRAND.whitepaperFile}`;

export function PdfReader() {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);

  const onLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  // Highlight search matches inside the text layer.
  const textRenderer = useCallback(
    (textItem: { str: string }) => {
      if (!query) return textItem.str;
      const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(${safe})`, "gi");
      return textItem.str.replace(
        re,
        '<mark style="background:#D4AF37;color:#1E241C;padding:0 1px;border-radius:2px;">$1</mark>',
      );
    },
    [query],
  );

  const pages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i + 1),
    [numPages],
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-heritage-gold/25 bg-heritage-surface/60 p-16 text-center">
        <FileWarning className="h-10 w-10 text-heritage-gold" />
        <p className="font-medium text-heritage-paper">Whitepaper not available</p>
        <p className="max-w-sm text-sm text-heritage-paper/55">
          Place <code className="text-heritage-gold">{BRAND.whitepaperFile}</code> in
          the <code>/public</code> directory to enable the in-browser reader.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="sticky top-16 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-heritage-gold/20 bg-heritage-bg/90 p-3 backdrop-blur">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-heritage-paper/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the document…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-14 text-center text-sm text-heritage-paper/60">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.15))}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        {numPages > 0 && (
          <span className="text-sm text-heritage-paper/50">{numPages} pages</span>
        )}
      </div>

      {/* Document */}
      <div className="flex max-h-[80vh] flex-col items-center gap-6 overflow-y-auto rounded-xl border border-heritage-gold/20 bg-heritage-surface/40 p-4">
        <Document
          file={FILE}
          onLoadSuccess={onLoad}
          onLoadError={() => setError(true)}
          loading={
            <div className="flex items-center gap-2 py-20 text-heritage-paper/60">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading whitepaper…
            </div>
          }
        >
          {pages.map((p) => (
            <div key={p} id={`pdf-page-${p}`} className="shadow-xl">
              <Page
                pageNumber={p}
                scale={scale}
                customTextRenderer={textRenderer}
                renderAnnotationLayer
                renderTextLayer
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
