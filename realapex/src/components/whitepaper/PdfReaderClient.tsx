"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// react-pdf touches the DOM/worker — load it client-side only.
const PdfReader = dynamic(
  () => import("./PdfReader").then((m) => m.PdfReader),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-heritage-gold/20 bg-heritage-surface/40 py-24 text-heritage-paper/60">
        <Loader2 className="h-5 w-5 animate-spin" /> Preparing reader…
      </div>
    ),
  },
);

export function PdfReaderClient() {
  return <PdfReader />;
}
