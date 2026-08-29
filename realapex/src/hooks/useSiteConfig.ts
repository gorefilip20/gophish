"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SITE_CONFIG } from "@/lib/constants";
import type { SiteConfigRow } from "@/lib/types";

const FALLBACK: SiteConfigRow = {
  id: 1,
  updated_at: new Date(0).toISOString(),
  ...DEFAULT_SITE_CONFIG,
};

/**
 * Reads the singleton `site_config` row (id = 1). Falls back to the static
 * defaults if the table is empty, Supabase errors, or the request exceeds a
 * short timeout — so the presale widget always renders promptly even when the
 * backend is slow or unreachable.
 */
export function useSiteConfig() {
  return useQuery({
    queryKey: ["site_config"],
    queryFn: async (): Promise<SiteConfigRow> => {
      const supabase = createClient();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("*")
          .eq("id", 1)
          .abortSignal(controller.signal)
          .single();
        if (error || !data) return FALLBACK;
        return data as SiteConfigRow;
      } catch {
        return FALLBACK;
      } finally {
        clearTimeout(timeout);
      }
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: false,
  });
}
