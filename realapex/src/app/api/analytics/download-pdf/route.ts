import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashIp } from "@/lib/hash";
import { BRAND } from "@/lib/constants";

export const runtime = "nodejs";

/**
 * Streams the whitepaper PDF from /public and records a `pdf_download`
 * analytics event (the download-count metric). The counter increment and the
 * file stream are independent, so a logging failure never blocks the download.
 */
export async function GET(req: NextRequest) {
  // Record the download metric (best-effort).
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;
    const supabase = createAdminClient();
    await supabase.from("analytics_events").insert({
      event_type: "pdf_download",
      ip_hash: hashIp(ip),
      user_agent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      path: "/api/analytics/download-pdf",
    });
  } catch {
    // ignore analytics errors
  }

  try {
    const filePath = path.join(process.cwd(), "public", BRAND.whitepaperFile);
    const file = await readFile(filePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${BRAND.whitepaperFile}"`,
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: `Whitepaper not found. Place ${BRAND.whitepaperFile} in /public.` },
      { status: 404 },
    );
  }
}
