"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRAND } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero({ aside }: { aside: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="container grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-7">
          <motion.div variants={item}>
            <Badge variant="outline" className="gap-1.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-heritage-gold" />
              {BRAND.name} {BRAND.ticker} Presale — Live Now
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-heritage-paper sm:text-5xl lg:text-6xl"
          >
            The Premier{" "}
            <span className="text-gradient-gold">Brand Incubator</span> &amp;
            Token Acceleration Protocol.
          </motion.h1>

          <motion.p variants={item} className="max-w-xl text-lg text-heritage-paper/65">
            RealApex engineers institutional-grade launches — DEX trending,
            syndicated KOL raids, automated volume, and heritage positioning —
            turning early conviction into blue-chip momentum.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <a href="#presale">
                Join the Presale <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/whitepaper">Read the Whitepaper</Link>
            </Button>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-2 text-sm text-heritage-paper/50">
            <ShieldCheck className="h-4 w-4 text-heritage-slate" />
            Non-custodial • On-chain settlement • Audited treasury
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          id="presale"
          className="w-full max-w-md lg:justify-self-end"
        >
          {aside}
        </motion.div>
      </div>
    </section>
  );
}
