"use client";

import { useAccount } from "wagmi";
import { Coins, DollarSign, Timer, Percent } from "lucide-react";
import { ConnectGate } from "@/components/dashboard/ConnectGate";
import { ReferralEngine } from "@/components/dashboard/ReferralEngine";
import { TaskHub } from "@/components/dashboard/TaskHub";
import { StatCard } from "@/components/shared/StatCard";
import { PageViewTracker } from "@/components/shared/PageViewTracker";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { formatNumber, formatUsd, shortAddress } from "@/lib/utils";

function DashboardInner() {
  const { address } = useAccount();
  const { data: portfolio, isLoading } = usePortfolio(address);
  const { data: config } = useSiteConfig();

  const usdValue =
    portfolio && config ? portfolio.totalTokens * config.token_price_usd : 0;

  return (
    <div className="container space-y-8 py-12">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-heritage-paper">
          Investor Portal
        </h1>
        <p className="mt-1 text-sm text-heritage-paper/55">
          {address ? shortAddress(address) : ""} · Your $APEX position at a glance
        </p>
      </div>

      {isLoading || !portfolio ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total $APEX Purchased"
            value={formatNumber(Math.floor(portfolio.totalTokens))}
            icon={Coins}
          />
          <StatCard
            label="Estimated USD Value"
            value={formatUsd(usdValue)}
            icon={DollarSign}
            hint={config ? `@ ${formatUsd(config.token_price_usd)}` : undefined}
          />
          <StatCard
            label="Vesting Status"
            value="Cliff: TGE"
            icon={Timer}
            hint="25% at TGE, then linear"
          />
          <StatCard
            label="Staking APY (preview)"
            value="18.5%"
            icon={Percent}
            hint="Available at listing"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {portfolio && <ReferralEngine portfolio={portfolio} />}
        <TaskHub />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <PageViewTracker />
      <ConnectGate>
        <DashboardInner />
      </ConnectGate>
    </>
  );
}
