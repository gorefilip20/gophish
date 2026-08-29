"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { TOKENOMICS } from "@/lib/constants";

export function Tokenomics() {
  return (
    <section className="container py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">
            Tokenomics
          </p>
          <h2 className="font-serif text-3xl font-semibold text-heritage-paper sm:text-4xl">
            An allocation built for longevity
          </h2>
          <p className="text-heritage-paper/60">
            $APEX supply is weighted toward the presale and the mechanisms that
            sustain it — liquidity, incubation, and a vested team aligned to the
            long game.
          </p>
          <ul className="space-y-3">
            {TOKENOMICS.map((slice) => (
              <li key={slice.label} className="flex items-center justify-between rounded-lg border border-heritage-gold/15 bg-heritage-bg/40 px-4 py-3">
                <span className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-sm" style={{ background: slice.color }} />
                  <span className="text-sm text-heritage-paper/80">{slice.label}</span>
                </span>
                <span className="font-semibold text-heritage-paper">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOKENOMICS as unknown as { label: string; value: number }[]}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {TOKENOMICS.map((slice) => (
                      <Cell key={slice.label} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#2C3528",
                      border: "1px solid rgba(212,175,55,0.4)",
                      borderRadius: 8,
                      color: "#F4F5F0",
                    }}
                    formatter={(v: number, n: string) => [`${v}%`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
