"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ICONS = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant ?? "default"];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-lg border bg-heritage-surface p-4 shadow-lg",
                t.variant === "success" && "border-emerald-500/40",
                t.variant === "error" && "border-red-500/40",
                (!t.variant || t.variant === "default") && "border-heritage-gold/40",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0",
                  t.variant === "success" && "text-emerald-400",
                  t.variant === "error" && "text-red-400",
                  (!t.variant || t.variant === "default") && "text-heritage-gold",
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-heritage-paper">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-heritage-paper/60">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-heritage-paper/40 hover:text-heritage-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
