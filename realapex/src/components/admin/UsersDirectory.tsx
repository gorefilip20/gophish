"use client";

import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "./admin-context";
import { shortAddress, formatNumber } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string | null;
  wallet_address: string | null;
  auth_provider: string;
  created_at: string;
  referral_code: string | null;
  presale_transactions: { tokens_purchased: number; currency: string; tx_hash: string }[];
}

export function UsersDirectory() {
  const { authFetch } = useAdmin();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<AdminUser[]> => {
      const res = await authFetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users");
      const json = await res.json();
      return json.users ?? [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-heritage-gold" /> User Directory
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identity</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">$APEX Purchased</TableHead>
                <TableHead className="text-right">Txns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((u) => {
                const tokens = u.presale_transactions.reduce((s, t) => s + Number(t.tokens_purchased), 0);
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs">
                      {u.wallet_address ? shortAddress(u.wallet_address) : u.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.auth_provider === "wallet" ? "slate" : "outline"}>
                        {u.auth_provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-heritage-paper/60">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-medium text-heritage-gold">
                      {formatNumber(Math.floor(tokens))}
                    </TableCell>
                    <TableCell className="text-right">{u.presale_transactions.length}</TableCell>
                  </TableRow>
                );
              })}
              {(data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-heritage-paper/40">
                    No registered users yet.
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
