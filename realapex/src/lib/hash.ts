import "server-only";
import { createHash } from "crypto";

/** One-way hash of a visitor IP with a server salt (privacy-preserving). */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.ANALYTICS_IP_SALT ?? "realapex-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
