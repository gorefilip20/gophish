"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Settings2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "./admin-context";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useToast } from "@/hooks/use-toast";

export function PresaleManager() {
  const { authFetch } = useAdmin();
  const { data: config } = useSiteConfig();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    current_stage: "",
    token_price_usd: "",
    raised_amount_usd: "",
    target_amount_usd: "",
    eth_treasury_address: "",
    usdt_treasury_address: "",
    presale_active: true,
  });

  useEffect(() => {
    if (config) {
      setForm({
        current_stage: config.current_stage,
        token_price_usd: String(config.token_price_usd),
        raised_amount_usd: String(config.raised_amount_usd),
        target_amount_usd: String(config.target_amount_usd),
        eth_treasury_address: config.eth_treasury_address,
        usdt_treasury_address: config.usdt_treasury_address,
        presale_active: config.presale_active,
      });
    }
  }, [config]);

  async function save() {
    setSaving(true);
    try {
      const res = await authFetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_stage: form.current_stage,
          token_price_usd: Number(form.token_price_usd),
          raised_amount_usd: Number(form.raised_amount_usd),
          target_amount_usd: Number(form.target_amount_usd),
          eth_treasury_address: form.eth_treasury_address,
          usdt_treasury_address: form.usdt_treasury_address,
          presale_active: form.presale_active,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      await qc.invalidateQueries({ queryKey: ["site_config"] });
      toast({ title: "Presale config updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-heritage-gold" />
          Dynamic Presale Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Active Stage</Label>
            <Input value={form.current_stage} onChange={set("current_stage")} placeholder="Stage 1" />
          </div>
          <div className="space-y-1.5">
            <Label>Token Price (USD)</Label>
            <Input type="number" step="0.0001" value={form.token_price_usd} onChange={set("token_price_usd")} />
          </div>
          <div className="space-y-1.5">
            <Label>Raised Amount Override (USD)</Label>
            <Input type="number" value={form.raised_amount_usd} onChange={set("raised_amount_usd")} />
          </div>
          <div className="space-y-1.5">
            <Label>Target Amount (USD)</Label>
            <Input type="number" value={form.target_amount_usd} onChange={set("target_amount_usd")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>ETH Treasury Address</Label>
            <Input value={form.eth_treasury_address} onChange={set("eth_treasury_address")} className="font-mono text-xs" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>USDT Treasury Address</Label>
            <Input value={form.usdt_treasury_address} onChange={set("usdt_treasury_address")} className="font-mono text-xs" />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, presale_active: !f.presale_active }))}
              className={
                "relative h-6 w-11 rounded-full transition-colors " +
                (form.presale_active ? "bg-heritage-gold" : "bg-heritage-bg border border-heritage-gold/30")
              }
              aria-pressed={form.presale_active}
            >
              <span
                className={
                  "absolute top-0.5 h-5 w-5 rounded-full bg-heritage-paper transition-transform " +
                  (form.presale_active ? "translate-x-5" : "translate-x-0.5")
                }
              />
            </button>
            <span className="text-sm text-heritage-paper/70">
              Presale {form.presale_active ? "active" : "paused"}
            </span>
          </div>
        </div>

        <Button className="mt-6" onClick={save} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save Configuration"}
        </Button>
      </CardContent>
    </Card>
  );
}
