"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChapterSidebar } from "@/components/whitepaper/ChapterSidebar";
import { PdfReaderClient } from "@/components/whitepaper/PdfReaderClient";
import { IncubateForm } from "@/components/whitepaper/IncubateForm";
import { PageViewTracker } from "@/components/shared/PageViewTracker";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BRAND } from "@/lib/constants";

export default function WhitepaperPage() {
  const { track } = useAnalytics();

  const download = () => {
    track("pdf_download", { source: "whitepaper_header" });
    window.location.href = "/api/analytics/download-pdf";
  };

  return (
    <>
      <PageViewTracker />

      {/* Sticky top header with primary download CTA */}
      <div className="sticky top-16 z-30 border-b border-heritage-gold/15 bg-heritage-bg/90 backdrop-blur">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline">v1.0</Badge>
            <h1 className="font-serif text-xl font-semibold text-heritage-paper">
              {BRAND.name} Whitepaper
            </h1>
          </div>
          <Button onClick={download}>
            <Download className="h-4 w-4" /> Download Original PDF (30+ Pages)
          </Button>
        </div>
      </div>

      <div className="container grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ChapterSidebar />
        </aside>

        <div className="min-w-0 space-y-16">
          {/* Embedded reader */}
          <section id="ch-1">
            <PdfReaderClient />
          </section>

          {/* Brand incubation portal */}
          <IncubateForm />
        </div>
      </div>
    </>
  );
}
