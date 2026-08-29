"use client";

import { useState, type ReactNode } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { ShieldAlert, Loader2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdmin } from "./admin-context";
import { buildAdminChallenge } from "@/lib/admin-challenge";
import { useToast } from "@/hooks/use-toast";

/**
 * Strict admin gate: connect wallet -> sign a timestamped challenge ->
 * verify against /api/admin/stats. The server allowlist is the real boundary;
 * the UI only reveals panels once a request authenticates.
 */
export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { headers, setHeaders, authFetch } = useAdmin();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [denied, setDenied] = useState(false);

  async function authenticate() {
    if (!address) return;
    setChecking(true);
    setDenied(false);
    try {
      const timestamp = Date.now();
      const message = buildAdminChallenge(timestamp);
      const signature = await signMessageAsync({ message });

      const nextHeaders = {
        "x-admin-address": address,
        "x-admin-message": message,
        "x-admin-signature": signature,
      };

      const res = await authFetch("/api/admin/stats", { headers: nextHeaders });
      if (res.ok) {
        setHeaders(nextHeaders);
        toast({ title: "Admin access granted", variant: "success" });
      } else {
        setHeaders(null);
        setDenied(true);
        toast({
          title: "Access denied",
          description: "This wallet is not an admin.",
          variant: "error",
        });
      }
    } catch {
      setHeaders(null);
      toast({ title: "Signature cancelled", variant: "error" });
    } finally {
      setChecking(false);
    }
  }

  if (headers) return <>{children}</>;

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-20">
      <Card className="max-w-md p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-heritage-gold/40 bg-heritage-gold/10 text-heritage-gold">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-serif text-2xl font-semibold text-heritage-paper">
          Admin Control Panel
        </h2>
        <p className="mt-3 text-heritage-paper/60">
          Restricted access. Authenticate with an authorized admin wallet.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          {!isConnected ? (
            <RainbowConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button size="lg" onClick={openConnectModal}>Connect Wallet</Button>
              )}
            </RainbowConnectButton.Custom>
          ) : (
            <Button size="lg" onClick={authenticate} disabled={checking}>
              {checking ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
              ) : (
                <><KeyRound className="h-4 w-4" /> Authenticate as Admin</>
              )}
            </Button>
          )}
          {denied && (
            <p className="text-sm text-red-400">
              This wallet is not on the admin allowlist.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
