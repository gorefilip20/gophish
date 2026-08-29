"use client";

import { useState } from "react";
import { Twitter, ThumbsUp, MessageCircle, Trophy, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TASKS = [
  { id: "retweet", label: "Retweet the RealApex announcement", reward: 500, icon: Twitter },
  { id: "coingecko", label: "Vote on CoinGecko", reward: 750, icon: ThumbsUp },
  { id: "telegram", label: "Join & verify in Telegram", reward: 300, icon: MessageCircle },
  { id: "dextools", label: "Watchlist $APEX on DEXTools", reward: 400, icon: Trophy },
] as const;

export function TaskHub() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const complete = (id: string, reward: number, label: string) => {
    setDone((d) => ({ ...d, [id]: true }));
    toast({
      title: `+${formatNumber(reward)} $APEX earned`,
      description: label,
      variant: "success",
    });
  };

  const earned = TASKS.reduce((s, t) => s + (done[t.id] ? t.reward : 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-heritage-gold" />
            Yield Syndicate Task Hub
          </CardTitle>
          <Badge>{formatNumber(earned)} $APEX earned</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {TASKS.map((task) => {
          const Icon = task.icon;
          const isDone = done[task.id];
          return (
            <div
              key={task.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-heritage-gold/15 bg-heritage-bg/40 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-heritage-gold/25 bg-heritage-gold/10 text-heritage-gold">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm text-heritage-paper">{task.label}</p>
                  <p className="text-xs text-heritage-gold">
                    +{formatNumber(task.reward)} $APEX
                  </p>
                </div>
              </div>
              {isDone ? (
                <span className="flex items-center gap-1 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Done
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => complete(task.id, task.reward, task.label)}
                >
                  Complete
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
