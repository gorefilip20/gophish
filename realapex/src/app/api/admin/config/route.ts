import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Update the singleton site_config row (presale management). Admin-only. */
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {};

  if (typeof body.current_stage === "string") update.current_stage = body.current_stage.slice(0, 40);
  if (body.token_price_usd != null) update.token_price_usd = Math.max(0, Number(body.token_price_usd));
  if (body.raised_amount_usd != null) update.raised_amount_usd = Math.max(0, Number(body.raised_amount_usd));
  if (body.target_amount_usd != null) update.target_amount_usd = Math.max(0, Number(body.target_amount_usd));
  if (typeof body.presale_active === "boolean") update.presale_active = body.presale_active;
  if (typeof body.eth_treasury_address === "string") {
    if (!isAddress(body.eth_treasury_address)) {
      return NextResponse.json({ error: "invalid eth_treasury_address" }, { status: 400 });
    }
    update.eth_treasury_address = body.eth_treasury_address;
  }
  if (typeof body.usdt_treasury_address === "string") {
    if (!isAddress(body.usdt_treasury_address)) {
      return NextResponse.json({ error: "invalid usdt_treasury_address" }, { status: 400 });
    }
    update.usdt_treasury_address = body.usdt_treasury_address;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "no valid fields" }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_config")
    .update(update)
    .eq("id", 1)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, config: data });
}
