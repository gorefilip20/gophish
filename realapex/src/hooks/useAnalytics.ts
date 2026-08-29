"use client";

import { useCallback } from "react";
import type { AnalyticsEventType } from "@/lib/types";

/**
 * Fire-and-forget analytics beacon to /api/analytics/track.
 * Uses navigator.sendBeacon when available so it never blocks navigation.
 */
export function useAnalytics() {
  const track = useCallback(
    (eventType: AnalyticsEventType, meta?: Record<string, unknown>) => {
      try {
        const payload = JSON.stringify({ event_type: eventType, path: window.location.pathname, ...meta });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics/track", new Blob([payload], { type: "application/json" }));
        } else {
          void fetch("/api/analytics/track", {
            method: "POST",
            body: payload,
            headers: { "Content-Type": "application/json" },
            keepalive: true,
          });
        }
      } catch {
        // analytics must never break the UX
      }
    },
    [],
  );

  return { track };
}
