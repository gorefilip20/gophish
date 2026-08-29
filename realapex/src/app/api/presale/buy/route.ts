import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PresaleCurrency } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Records a presale purchase after the client has submitted the on-chain tx.
 * The chain remains the source of truth; this endpoint persists the record,
 * links it to a user (creating one if needed), and bumps the raised total.
 *
 * NOTE: In production you should verify `tx_hash` against the treasury on the
 * configured chain (via viem publicClient.getTransactionReceipt) before
 * crediting the raised amount, to prevent spoofed records. That verification
 * hook is marked below.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      wallet_address,
      amount_spent,
      currency,
      tokens_purchased,
      usd_value,
      tx_hash,
      stage,
    } = body ?? {};

    if (!wallet_address || !isAddress(wallet_address)) {
      return NextResponse.json({ error: "invalid wallet_address" }, { status: 400 });
    }
    if (!tx_hash || typeof tx_hash !== "string") {
      return NextResponse.json({ error: "missing tx_hash" }, { status: 400 });
    }
    if (!["ETH", "USDT"].includes(currency)) {
      return NextResponse.json({ error: "invalid currency" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const wallet = String(wallet_address).toLowerCase();

    // TODO(production): verify tx_hash on-chain before trusting these amounts.

    // Ensure a user exists for this wallet.
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", wallet)
      .maybeSingle();

    let userId = existingUser?.id ?? null;
    if (!userId) {
      const { data: created } = await supabase
        .from("users")
        .insert({
          wallet_address: wallet,
          auth_provider: "wallet",
          referral_code: `APX-${wallet.slice(2, 10).toUpperCase()}`,
        })
        .select("id")
        .single();
      userId = created?.id ?? null;
    }

    // Idempotency: skip if this tx_hash was already recorded.
    const { data: dupe } = await supabase
      .from("presale_transactions")
      .select("id")
      .eq("tx_hash", tx_hash)
      .maybeSingle();
    if (dupe) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    const { error: txError } = await supabase.from("presale_transactions").insert({
      user_id: userId,
      wallet_address: wallet,
      amount_spent: Number(amount_spent) || 0,
      currency: currency as PresaleCurrency,
      tokens_purchased: Number(tokens_purchased) || 0,
      tx_hash,
      stage: stage ?? "Stage 1",
    });
    if (txError) throw txError;

    // Bump the raised total via an atomic RPC (defined in the migration).
    const usd = Number(usd_value) || 0;
    if (usd > 0) {
      await supabase.rpc("increment_raised", { delta: usd });
    }

    return NextResponse.json({ ok: true, user_id: userId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
