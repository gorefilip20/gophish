"use client";

import { useMemo, useState } from "react";
import { parseEther, parseUnits, erc20Abi } from "viem";
import {
  useAccount,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { Currency } from "@/lib/constants";
import type { SiteConfigRow } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

/** Assumed USD price of 1 ETH for quote math. In production, source this from
 *  an on-chain oracle (e.g. Chainlink) or a price API. */
const ASSUMED_ETH_USD = 3000;
const USDT_DECIMALS = 6;

interface UsePresaleArgs {
  config: SiteConfigRow;
}

/**
 * Quote + execute presale purchases. ETH is sent directly to the treasury;
 * USDT is transferred via the ERC-20 contract. On confirmation the purchase
 * is recorded to the database through /api/presale/buy.
 */
export function usePresale({ config }: UsePresaleArgs) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [pendingHash, setPendingHash] = useState<`0x${string}` | undefined>();

  const { sendTransactionAsync, isPending: ethPending } = useSendTransaction();
  const { writeContractAsync, isPending: usdtPending } = useWriteContract();
  const { isLoading: confirming, isSuccess: confirmed } =
    useWaitForTransactionReceipt({ hash: pendingHash });

  /** USD value of a given input amount in the selected currency. */
  const quoteUsd = (amountIn: string, currency: Currency) => {
    const n = Number(amountIn);
    if (!n || n <= 0) return 0;
    return currency === "ETH" ? n * ASSUMED_ETH_USD : n; // USDT ~ $1
  };

  /** $APEX tokens received for an input amount. */
  const quoteTokens = (amountIn: string, currency: Currency) => {
    const usd = quoteUsd(amountIn, currency);
    if (!config.token_price_usd) return 0;
    return usd / config.token_price_usd;
  };

  async function buy(amountIn: string, currency: Currency) {
    if (!isConnected || !address) {
      toast({ title: "Wallet not connected", description: "Connect a wallet to continue.", variant: "error" });
      return;
    }
    if (!config.presale_active) {
      toast({ title: "Presale paused", description: "Purchases are currently disabled.", variant: "error" });
      return;
    }
    const amount = Number(amountIn);
    if (!amount || amount <= 0) {
      toast({ title: "Enter an amount", variant: "error" });
      return;
    }

    try {
      let hash: `0x${string}`;
      if (currency === "ETH") {
        hash = await sendTransactionAsync({
          to: config.eth_treasury_address as `0x${string}`,
          value: parseEther(amountIn),
        });
      } else {
        const usdtAddress = process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS as `0x${string}`;
        hash = await writeContractAsync({
          address: usdtAddress,
          abi: erc20Abi,
          functionName: "transfer",
          args: [config.usdt_treasury_address as `0x${string}`, parseUnits(amountIn, USDT_DECIMALS)],
        });
      }
      setPendingHash(hash);
      toast({ title: "Transaction submitted", description: "Waiting for confirmation…", variant: "default" });

      // Record to DB (best-effort; the chain is the source of truth).
      const tokens = quoteTokens(amountIn, currency);
      const usd = quoteUsd(amountIn, currency);
      await fetch("/api/presale/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: address,
          amount_spent: amount,
          currency,
          tokens_purchased: tokens,
          usd_value: usd,
          tx_hash: hash,
          stage: config.current_stage,
        }),
      });

      toast({
        title: "Purchase recorded",
        description: `${tokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} $APEX reserved.`,
        variant: "success",
      });
      return hash;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      toast({ title: "Transaction failed", description: message.slice(0, 120), variant: "error" });
    }
  }

  const isBusy = useMemo(
    () => ethPending || usdtPending || confirming,
    [ethPending, usdtPending, confirming],
  );

  return { buy, quoteUsd, quoteTokens, isBusy, confirmed, pendingHash };
}
