"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Thin wrapper over RainbowKit's ConnectButton that logs a `wallet_connect`
 * analytics event the first time an address becomes available.
 */
export function ConnectButton() {
  const { address } = useAccount();
  const { track } = useAnalytics();
  const logged = useRef<string | null>(null);

  useEffect(() => {
    if (address && logged.current !== address) {
      logged.current = address;
      track("wallet_connect", { wallet_address: address });
    }
  }, [address, track]);

  return <RainbowConnectButton showBalance={false} chainStatus="icon" />;
}
