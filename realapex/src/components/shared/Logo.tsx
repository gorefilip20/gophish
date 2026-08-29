import Link from "next/link";
import { Mountain } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-heritage-gold/40 bg-heritage-gold/10 text-heritage-gold transition-colors group-hover:bg-heritage-gold/20">
        <Mountain className="h-5 w-5" />
      </span>
      <span className="text-lg font-serif font-semibold tracking-wide text-heritage-paper">
        Real<span className="text-heritage-gold">Apex</span>
      </span>
    </Link>
  );
}
