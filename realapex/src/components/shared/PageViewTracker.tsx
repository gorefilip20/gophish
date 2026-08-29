"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Client-side page_view logger. The middleware records unique first-hit
 * visitors server-side; this captures client-side route transitions too.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const { track } = useAnalytics();

  useEffect(() => {
    track("page_view", { path: pathname });
  }, [pathname, track]);

  return null;
}
