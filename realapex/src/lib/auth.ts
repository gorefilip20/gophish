import "server-only";

/** Parse the admin allowlists from env (server-only). */
export function getAdminAllowlists() {
  const wallets = (process.env.ADMIN_WALLET_ADDRESSES ?? "")
    .split(",")
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
  const emails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return { wallets, emails };
}

export function isAdminWallet(address?: string | null) {
  if (!address) return false;
  return getAdminAllowlists().wallets.includes(address.toLowerCase());
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminAllowlists().emails.includes(email.toLowerCase());
}
