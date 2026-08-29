import "server-only";
import { NextRequest } from "next/server";
import { verifyMessage } from "viem";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, isAdminWallet } from "@/lib/auth";
import { buildAdminChallenge } from "@/lib/admin-challenge";

export { buildAdminChallenge };

export interface AdminIdentity {
  kind: "email" | "wallet";
  value: string;
}

/**
 * Verifies that the caller is an admin, by either:
 *  (a) a Supabase Auth session whose email is in ADMIN_EMAILS, or
 *  (b) a wallet in ADMIN_WALLET_ADDRESSES that signed a fresh challenge,
 *      passed via headers: x-admin-address, x-admin-message, x-admin-signature.
 *
 * Returns the admin identity, or null if unauthorized.
 */
export async function requireAdmin(req: NextRequest): Promise<AdminIdentity | null> {
  // (a) Email session via Supabase Auth
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email && isAdminEmail(user.email)) {
      return { kind: "email", value: user.email };
    }
  } catch {
    // fall through to wallet check
  }

  // (b) Signed-wallet challenge
  const address = req.headers.get("x-admin-address");
  const message = req.headers.get("x-admin-message");
  const signature = req.headers.get("x-admin-signature");
  if (address && message && signature && isAdminWallet(address)) {
    try {
      const valid = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });
      // Basic freshness check: the message must embed a recent timestamp.
      const tsMatch = message.match(/Timestamp:\s*(\d+)/);
      const fresh = tsMatch ? Date.now() - Number(tsMatch[1]) < 30 * 60_000 : false;
      if (valid && fresh) {
        return { kind: "wallet", value: address.toLowerCase() };
      }
    } catch {
      return null;
    }
  }

  return null;
}
