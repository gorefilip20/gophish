import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashIp } from "@/lib/hash";
import type { AnalyticsEventType } from "@/lib/types";

export const runtime = "nodejs";

const VALID: AnalyticsEventType[] = ["page_view", "pdf_download", "wallet_connect"];

/** Fire-and-forget analytics ingest. Never throws to the client. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const eventType = body?.event_type as AnalyticsEventType;
    if (!VALID.includes(eventType)) {
      return NextResponse.json({ ok: false, error: "invalid event_type" }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

    const supabase = createAdminClient();
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      user_id: body?.user_id ?? null,
      ip_hash: hashIp(ip),
      user_agent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      path: typeof body?.path === "string" ? body.path.slice(0, 300) : null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Analytics failures must be silent.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
