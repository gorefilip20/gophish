"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SITE_CONFIG } from "@/lib/constants";
import type { SiteConfigRow } from "@/lib/types";

/**
 * Reads the singleton `site_config` row (id = 1). Falls back to the static
 * defaults if the table is empty or Supabase is unreachable, so the presale
 * widget always renders.
 */
export function useSiteConfig() {
  return useQuery({
    queryKey: ["site_config"],
    queryFn: async (): Promise<SiteConfigRow> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("site_config")
        .select("*")
        .eq("id", 1)
        .single();
      if (error || !data) {
        return { id: 1, updated_at: new Date().toISOString(), ...DEFAULT_SITE_CONFIG };
      }
      return data as SiteConfigRow;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
