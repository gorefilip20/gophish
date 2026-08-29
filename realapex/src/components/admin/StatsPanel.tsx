"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Users, Eye, Download, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "./admin-context";
import { formatNumber, formatUsd } from "@/lib/utils";
import type { AdminStats } from "@/lib/types";

const tooltipStyle = {
  background: "#2C3528",
  border: "1px solid rgba(212,175,55,0.4)",
  borderRadius: 8,
  color: "#F4F5F0",
};

export function StatsPanel() {
  const { authFetch } = useAdmin();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      const res = await authFetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    },
    refetchInterval: 30_000,
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const merged = data.dailyVisitors.map((d, i) => ({
    date: d.date.slice(5),
    visitors: d.count,
    downloads: data.dailyDownloads[i]?.count ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Website Visitors" value={formatNumber(data.totalVisitors)} icon={Eye} />
        <StatCard label="Total Registered Users" value={formatNumber(data.totalUsers)} icon={Users} />
        <StatCard label="Total PDF Downloads" value={formatNumber(data.totalPdfDownloads)} icon={Download} />
        <StatCard label="Total Presale Raised" value={formatUsd(data.totalRaisedUsd, { compact: true })} icon={DollarSign} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Daily Visitor Trend</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={merged}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,245,240,0.08)" />
                <XAxis dataKey="date" stroke="#8a9382" fontSize={12} />
                <YAxis stroke="#8a9382" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="visitors" stroke="#D4AF37" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>PDF Download Spikes</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={merged}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,245,240,0.08)" />
                <XAxis dataKey="date" stroke="#8a9382" fontSize={12} />
                <YAxis stroke="#8a9382" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="downloads" fill="#4A5D43" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
