import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TokenStatus } from "@/lib/types";

export const runtime = "nodejs";

const STATUSES: TokenStatus[] = ["Idea", "Pre-launch", "Live"];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Handles brand-incubation lead submissions from /whitepaper. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      project_name,
      contact_email,
      telegram_handle,
      token_status,
      budget_usd,
      services_needed,
    } = body ?? {};

    if (!project_name || String(project_name).trim().length < 2) {
      return NextResponse.json({ error: "project_name is required" }, { status: 400 });
    }
    if (!contact_email || !emailRe.test(String(contact_email))) {
      return NextResponse.json({ error: "valid contact_email is required" }, { status: 400 });
    }
    const status: TokenStatus = STATUSES.includes(token_status) ? token_status : "Idea";

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("brand_applications")
      .insert({
        project_name: String(project_name).slice(0, 160),
        contact_email: String(contact_email).slice(0, 200),
        telegram_handle: telegram_handle ? String(telegram_handle).slice(0, 100) : null,
        token_status: status,
        budget_usd: budget_usd != null ? Number(budget_usd) : null,
        services_needed: services_needed ? String(services_needed).slice(0, 1000) : null,
        status: "Pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    // NOTE: admin notification hook — wire to Resend/Slack/Telegram here.
    // e.g. await notifyAdmin({ type: "brand_application", id: data.id });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
