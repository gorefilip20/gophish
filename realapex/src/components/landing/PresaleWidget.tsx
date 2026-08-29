"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2, Wallet, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { usePresale } from "@/hooks/usePresale";
import { usePresaleStore } from "@/store/usePresaleStore";
import { BRAND, type Currency } from "@/lib/constants";
import { formatNumber, formatUsd, clampPercent } from "@/lib/utils";

const CURRENCIES: Currency[] = ["ETH", "USDT"];

export function PresaleWidget() {
  const { data: config, isLoading } = useSiteConfig();
  const { isConnected } = useAccount();
  const { currency, amountIn, setCurrency, setAmountIn } = usePresaleStore();

  const presale = usePresale({
    config: config ?? {
      id: 1,
      current_stage: "Stage 1",
      token_price_usd: 0.025,
      raised_amount_usd: 0,
      target_amount_usd: 2_500_000,
      eth_treasury_address: "0x0000000000000000000000000000000000000000",
      usdt_treasury_address: "0x0000000000000000000000000000000000000000",
      presale_active: true,
      updated_at: new Date().toISOString(),
    },
  });

  const tokens = useMemo(
    () => presale.quoteTokens(amountIn, currency),
    [amountIn, currency, presale],
  );

  const pct = useMemo(() => {
    if (!config?.target_amount_usd) return 0;
    return clampPercent((config.raised_amount_usd / config.target_amount_usd) * 100);
  }, [config]);

  if (isLoading || !config) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-4 h-24 w-full" />
        <Skeleton className="mt-4 h-11 w-full" />
      </Card>
    );
  }

  return (
    <Card className="relative border-heritage-gold/40 shadow-[0_0_60px_-20px_rgba(212,175,55,0.45)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-heritage-paper">
            <Zap className="h-5 w-5 text-heritage-gold" />
            Buy {BRAND.ticker}
          </CardTitle>
          <Badge variant={config.presale_active ? "success" : "warning"}>
            {config.presale_active ? config.current_stage : "Paused"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-heritage-paper/60">Presale progress</span>
            <span className="font-semibold text-heritage-gold">{pct.toFixed(1)}%</span>
          </div>
          <Progress value={pct} />
          <div className="flex items-center justify-between text-xs text-heritage-paper/50">
            <span>{formatUsd(config.raised_amount_usd, { compact: true })} raised</span>
            <span>Target {formatUsd(config.target_amount_usd, { compact: true })}</span>
          </div>
        </div>

        {/* Currency toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-heritage-gold/20 bg-heritage-bg/50 p-1">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={
                "rounded-md py-2 text-sm font-medium transition-colors " +
                (currency === c
                  ? "bg-heritage-gold text-heritage-bg"
                  : "text-heritage-paper/60 hover:text-heritage-paper")
              }
            >
              Pay with {c}
            </button>
          ))}
        </div>

        {/* Amount in */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-heritage-paper/50">
            You pay ({currency})
          </label>
          <Input
            inputMode="decimal"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || /^\d*\.?\d*$/.test(v)) setAmountIn(v);
            }}
            className="h-14 text-lg"
          />
        </div>

        {/* Amount out */}
        <div className="rounded-lg border border-heritage-gold/20 bg-heritage-bg/40 p-4">
          <p className="text-xs uppercase tracking-wider text-heritage-paper/50">You receive</p>
          <p className="mt-1 text-2xl font-semibold text-heritage-gold">
            {formatNumber(Math.floor(tokens))} <span className="text-base">{BRAND.ticker}</span>
          </p>
          <p className="mt-1 text-xs text-heritage-paper/45">
            1 {BRAND.ticker} = {formatUsd(config.token_price_usd)} · ≈{" "}
            {formatUsd(presale.quoteUsd(amountIn, currency))}
          </p>
        </div>

        {/* Action */}
        {!isConnected ? (
          <RainbowConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button size="lg" className="w-full" onClick={openConnectModal}>
                <Wallet className="h-4 w-4" /> Connect Wallet
              </Button>
            )}
          </RainbowConnectButton.Custom>
        ) : (
          <Button
            size="lg"
            className="w-full"
            disabled={presale.isBusy || !config.presale_active || !Number(amountIn)}
            onClick={() => presale.buy(amountIn, currency)}
          >
            {presale.isBusy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>Buy {BRAND.ticker} now</>
            )}
          </Button>
        )}

        <p className="text-center text-[11px] leading-relaxed text-heritage-paper/40">
          Transactions settle on-chain to the project treasury. Token pricing is
          fixed per stage. Always verify the contract address before sending funds.
        </p>
      </CardContent>
    </Card>
  );
}
