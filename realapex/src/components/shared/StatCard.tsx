import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, hint, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-heritage-paper/50">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-heritage-paper">{value}</p>
          {hint && <p className="mt-1 text-xs text-heritage-paper/45">{hint}</p>}
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-heritage-gold/30 bg-heritage-gold/10 text-heritage-gold">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-heritage-gold/5 blur-2xl" />
    </Card>
  );
}
