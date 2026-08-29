"use client";

import { useState } from "react";
import { Copy, Check, Users, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { shortAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Portfolio } from "@/hooks/usePortfolio";

export function ReferralEngine({ portfolio }: { portfolio: Portfolio }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const link =
    typeof window !== "undefined" && portfolio.referralCode
      ? `${window.location.origin}/?ref=${portfolio.referralCode}`
      : "";

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Referral link copied", variant: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-heritage-gold" />
          Personal Referral Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-heritage-paper/50">
            Your unique link — earn a 10% bonus on every referral
          </label>
          <div className="flex gap-2">
            <Input readOnly value={link} className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-heritage-gold/15 bg-heritage-bg/40 p-4">
          <span className="flex items-center gap-2 text-sm text-heritage-paper/70">
            <Users className="h-4 w-4 text-heritage-slate" /> Referred investors
          </span>
          <Badge variant="slate">{portfolio.referredUsers.length}</Badge>
        </div>

        {portfolio.referredUsers.length > 0 && (
          <ul className="space-y-2">
            {portfolio.referredUsers.slice(0, 6).map((u) => (
              <li
                key={u.wallet_address}
                className="flex items-center justify-between rounded-md bg-heritage-bg/40 px-3 py-2 text-sm"
              >
                <span className="font-mono text-heritage-paper/70">
                  {shortAddress(u.wallet_address)}
                </span>
                <span className="text-xs text-heritage-paper/40">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Button
          className="w-full"
          disabled={portfolio.referredUsers.length === 0}
          onClick={() =>
            toast({
              title: "Referral bonus queued",
              description: "Your 10% bonus will vest with your allocation.",
              variant: "success",
            })
          }
        >
          Claim 10% Referral Bonus
        </Button>
      </CardContent>
    </Card>
  );
}
