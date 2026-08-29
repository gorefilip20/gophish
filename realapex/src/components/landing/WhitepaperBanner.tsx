"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BRAND } from "@/lib/constants";
import { useAnalytics } from "@/hooks/useAnalytics";

export function WhitepaperBanner() {
  const { track } = useAnalytics();

  const handleDownload = () => {
    track("pdf_download", { source: "landing_banner" });
    // The API route streams the file and increments the DB metric.
    window.location.href = "/api/analytics/download-pdf";
  };

  return (
    <section className="container py-16">
      <Card className="overflow-hidden border-heritage-gold/40">
        <div className="grid items-center gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
          <div className="space-y-5">
            <Badge variant="outline">Official Document</Badge>
            <h2 className="font-serif text-3xl font-semibold text-heritage-paper">
              {BRAND.name} Whitepaper <span className="text-heritage-gold">v1.0</span>
            </h2>
            <p className="max-w-lg text-heritage-paper/65">
              A 30+ page institutional blueprint — the incubation thesis, protocol
              architecture, $APEX tokenomics, the acceleration engine, governance,
              and full risk disclosures.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={handleDownload}>
                <Download className="h-4 w-4" /> Download Whitepaper PDF
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/whitepaper">
                  <BookOpen className="h-4 w-4" /> Read Online
                </Link>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, rotate: -6, y: 20 }}
            whileInView={{ opacity: 1, rotate: -3, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto"
          >
            <div className="relative aspect-[3/4] w-52 rounded-lg border border-heritage-gold/40 bg-gradient-to-br from-heritage-surface to-heritage-bg p-5 shadow-2xl">
              <FileText className="h-8 w-8 text-heritage-gold" />
              <div className="mt-6 space-y-2">
                <div className="h-2 w-3/4 rounded bg-heritage-gold/40" />
                <div className="h-2 w-full rounded bg-heritage-paper/15" />
                <div className="h-2 w-5/6 rounded bg-heritage-paper/15" />
                <div className="h-2 w-2/3 rounded bg-heritage-paper/15" />
              </div>
              <p className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-wider text-heritage-gold">
                {BRAND.ticker} · v1.0
              </p>
            </div>
          </motion.div>
        </div>
      </Card>
    </section>
  );
}
