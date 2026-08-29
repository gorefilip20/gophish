import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";
import type { AdminStats } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Aggregates dashboard metrics. Admin-only. */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const [visitors, users, downloads, raised, daily] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "page_view"),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "pdf_download"),
    supabase.from("site_config").select("raised_amount_usd").eq("id", 1).single(),
    // Daily buckets via a SQL view/RPC (defined in the migration).
    supabase.rpc("daily_analytics", { days: 14 }),
  ]);

  const dailyRows = (daily.data ?? []) as {
    day: string;
    page_views: number;
    pdf_downloads: number;
  }[];

  const stats: AdminStats = {
    totalVisitors: visitors.count ?? 0,
    totalUsers: users.count ?? 0,
    totalPdfDownloads: downloads.count ?? 0,
    totalRaisedUsd: raised.data?.raised_amount_usd ?? 0,
    dailyVisitors: dailyRows.map((r) => ({ date: r.day, count: r.page_views })),
    dailyDownloads: dailyRows.map((r) => ({ date: r.day, count: r.pdf_downloads })),
  };

  return NextResponse.json(stats);
}
