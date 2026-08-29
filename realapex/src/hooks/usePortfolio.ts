"use client";

import { useQuery } from "@tanstack/react-query";

export interface Portfolio {
  wallet: string;
  referralCode: string | null;
  memberSince: string | null;
  totalTokens: number;
  transactions: {
    amount_spent: number;
    currency: "ETH" | "USDT";
    tokens_purchased: number;
    tx_hash: string;
    timestamp: string;
    stage: string;
  }[];
  referredUsers: { wallet_address: string; created_at: string }[];
}

export function usePortfolio(wallet?: string) {
  return useQuery({
    queryKey: ["portfolio", wallet],
    enabled: Boolean(wallet),
    queryFn: async (): Promise<Portfolio> => {
      const res = await fetch(`/api/user/portfolio?wallet=${wallet}`);
      if (!res.ok) throw new Error("Failed to load portfolio");
      return res.json();
    },
    staleTime: 15_000,
  });
}
