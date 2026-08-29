"use client";

import { useState } from "react";
import { Rocket, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { TokenStatus } from "@/lib/types";

const STATUS_OPTIONS: TokenStatus[] = ["Idea", "Pre-launch", "Live"];

export function IncubateForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("Idea");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const res = await fetch("/api/brand/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: form.get("project_name"),
          contact_email: form.get("contact_email"),
          telegram_handle: form.get("telegram_handle"),
          token_status: tokenStatus,
          budget_usd: form.get("budget_usd") ? Number(form.get("budget_usd")) : null,
          services_needed: form.get("services_needed"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setDone(true);
      toast({
        title: "Application received",
        description: "Our incubation team will reach out shortly.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Could not submit",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card id="incubate" className="border-heritage-gold/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-2xl">
          <Rocket className="h-6 w-6 text-heritage-gold" />
          Incubate Your Brand With Apex
        </CardTitle>
        <p className="text-sm text-heritage-paper/60">
          Tell us about your project and promotional goals. Our team reviews every
          application personally.
        </p>
      </CardHeader>
      <CardContent>
        {done ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <p className="font-medium text-emerald-300">Thank you — your application is in.</p>
            <p className="mt-1 text-sm text-heritage-paper/60">
              We&apos;ll be in touch at the email you provided.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="project_name">Project Name *</Label>
              <Input id="project_name" name="project_name" required placeholder="Acme Protocol" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_email">Contact Email *</Label>
              <Input id="contact_email" name="contact_email" type="email" required placeholder="founder@acme.io" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telegram_handle">Telegram Handle</Label>
              <Input id="telegram_handle" name="telegram_handle" placeholder="@acmefounder" />
            </div>
            <div className="space-y-1.5">
              <Label>Token Status</Label>
              <Select value={tokenStatus} onValueChange={(v) => setTokenStatus(v as TokenStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget_usd">Budget (USD)</Label>
              <Input id="budget_usd" name="budget_usd" type="number" min="0" placeholder="25000" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="services_needed">Targeted Promotional Goals</Label>
              <Textarea
                id="services_needed"
                name="services_needed"
                placeholder="DEX trending, KOL raids, market making, brand positioning…"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                ) : (
                  "Submit Incubation Inquiry"
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
