"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "./admin-context";
import { useToast } from "@/hooks/use-toast";
import type { ApplicationStatus, BrandApplicationRow } from "@/lib/types";
import { formatUsd } from "@/lib/utils";

const STATUSES: ApplicationStatus[] = ["Pending", "Contacted", "Approved"];
const badgeVariant: Record<ApplicationStatus, "warning" | "slate" | "success"> = {
  Pending: "warning",
  Contacted: "slate",
  Approved: "success",
};

export function ApplicationsManager() {
  const { authFetch } = useAdmin();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-apps"],
    queryFn: async (): Promise<BrandApplicationRow[]> => {
      const res = await authFetch("/api/admin/applications");
      if (!res.ok) throw new Error("Failed to load applications");
      const json = await res.json();
      return json.applications ?? [];
    },
  });

  async function updateStatus(id: string, status: ApplicationStatus) {
    const res = await authFetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      await qc.invalidateQueries({ queryKey: ["admin-apps"] });
      toast({ title: `Marked ${status}`, variant: "success" });
    } else {
      toast({ title: "Update failed", variant: "error" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-heritage-gold" /> Brand Applications Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <p className="font-medium text-heritage-paper">{app.project_name}</p>
                    {app.services_needed && (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-heritage-paper/45">
                        {app.services_needed}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    <p className="text-heritage-paper/70">{app.contact_email}</p>
                    {app.telegram_handle && (
                      <p className="text-heritage-paper/45">{app.telegram_handle}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.token_status}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-heritage-paper/70">
                    {app.budget_usd ? formatUsd(app.budget_usd, { compact: true }) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={badgeVariant[app.status]}>{app.status}</Badge>
                      <Select
                        value={app.status}
                        onValueChange={(v) => updateStatus(app.id, v as ApplicationStatus)}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-heritage-paper/40">
                    No applications submitted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
