import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns a wallet's presale portfolio: total tokens, USD spent, referral code
 * and referred users. Keyed by the connected wallet address.
 *
 * NOTE(production): gate this with a SIWE signature so a user can only read the
 * wallet they control. For the presale MVP it returns public-by-wallet data.
 */
export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")?.toLowerCase();
  if (!wallet || !isAddress(wallet)) {
    return NextResponse.json({ error: "valid wallet required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Ensure a user row exists (auto-provision on first dashboard visit).
  let { data: user } = await supabase
    .from("users")
    .select("id, referral_code, created_at")
    .eq("wallet_address", wallet)
    .maybeSingle();

  if (!user) {
    const { data: created } = await supabase
      .from("users")
      .insert({
        wallet_address: wallet,
        auth_provider: "wallet",
        referral_code: `APX-${wallet.slice(2, 10).toUpperCase()}`,
      })
      .select("id, referral_code, created_at")
      .single();
    user = created ?? null;
  }

  const { data: txs } = await supabase
    .from("presale_transactions")
    .select("amount_spent, currency, tokens_purchased, tx_hash, timestamp, stage")
    .eq("wallet_address", wallet)
    .order("timestamp", { ascending: false });

  const { data: referred } = user
    ? await supabase
        .from("users")
        .select("wallet_address, created_at")
        .eq("referred_by", user.id)
    : { data: [] as { wallet_address: string; created_at: string }[] };

  const totalTokens = (txs ?? []).reduce((s, t) => s + Number(t.tokens_purchased), 0);

  return NextResponse.json({
    wallet,
    referralCode: user?.referral_code ?? null,
    memberSince: user?.created_at ?? null,
    totalTokens,
    transactions: txs ?? [],
    referredUsers: referred ?? [],
  });
}
