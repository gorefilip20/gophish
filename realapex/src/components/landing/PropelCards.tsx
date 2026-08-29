"use client";

import { motion } from "framer-motion";
import { TrendingUp, Megaphone, Waves, Landmark, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PROPEL_PILLARS } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = { TrendingUp, Megaphone, Waves, Landmark };

export function PropelCards() {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">
          The Acceleration Engine
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-heritage-paper sm:text-4xl">
          How RealApex Propels Your Coin
        </h2>
        <p className="mt-4 text-heritage-paper/60">
          Four synchronized programs that move a project from launch to lasting
          market presence.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PROPEL_PILLARS.map((pillar, i) => {
          const Icon = ICONS[pillar.icon] ?? TrendingUp;
          return (
            <motion.div
              key={pillar.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="group h-full p-6 transition-all hover:-translate-y-1 hover:border-heritage-gold/50 hover:shadow-[0_0_40px_-14px_rgba(212,175,55,0.5)]">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-heritage-gold/30 bg-heritage-gold/10 text-heritage-gold transition-colors group-hover:bg-heritage-gold group-hover:text-heritage-bg">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-heritage-paper">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-heritage-paper/60">
                  {pillar.blurb}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
