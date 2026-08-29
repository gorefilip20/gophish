"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { ROADMAP } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export function Roadmap() {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">
          The Path
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-heritage-paper sm:text-4xl">
          Roadmap
        </h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {ROADMAP.map((phase, i) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Card className={`h-full p-6 ${phase.done ? "border-heritage-gold/50" : ""}`}>
              <div className="flex items-center gap-2">
                {phase.done ? (
                  <CheckCircle2 className="h-5 w-5 text-heritage-gold" />
                ) : (
                  <Circle className="h-5 w-5 text-heritage-paper/30" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wider text-heritage-gold/80">
                  {phase.phase}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-heritage-paper">{phase.title}</h3>
              <ul className="mt-4 space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-heritage-paper/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-heritage-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
