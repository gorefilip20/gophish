"use client";

import type { ReactNode } from "react";
import { useAccount } from "wagmi";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Auth guard for the investor portal. Requires a connected wallet.
 * (Email sign-in via Supabase Auth can be added as an alternative branch.)
 */
export function ConnectGate({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount();

  if (isConnected) return <>{children}</>;

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-20">
      <Card className="max-w-md p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-heritage-gold/40 bg-heritage-gold/10 text-heritage-gold">
          <Lock className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-serif text-2xl font-semibold text-heritage-paper">
          Investor Portal
        </h2>
        <p className="mt-3 text-heritage-paper/60">
          Connect your wallet to view your $APEX holdings, referral rewards, and
          the Yield Syndicate task hub.
        </p>
        <div className="mt-6 flex justify-center">
          <RainbowConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button size="lg" onClick={openConnectModal}>
                Connect Wallet
              </Button>
            )}
          </RainbowConnectButton.Custom>
        </div>
      </Card>
    </div>
  );
}
