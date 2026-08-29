"use client";

import { LayoutDashboard } from "lucide-react";
import { AdminProvider } from "@/components/admin/admin-context";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { StatsPanel } from "@/components/admin/StatsPanel";
import { PresaleManager } from "@/components/admin/PresaleManager";
import { UsersDirectory } from "@/components/admin/UsersDirectory";
import { ApplicationsManager } from "@/components/admin/ApplicationsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminAuthGate>
        <div className="container space-y-8 py-12">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-heritage-gold/40 bg-heritage-gold/10 text-heritage-gold">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-heritage-paper">
                Control Panel
              </h1>
              <p className="text-sm text-heritage-paper/55">
                Executive analytics &amp; presale operations
              </p>
            </div>
          </div>

          <Tabs defaultValue="analytics">
            <TabsList className="flex-wrap">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="presale">Presale</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <StatsPanel />
            </TabsContent>
            <TabsContent value="presale">
              <PresaleManager />
            </TabsContent>
            <TabsContent value="users">
              <UsersDirectory />
            </TabsContent>
            <TabsContent value="applications">
              <ApplicationsManager />
            </TabsContent>
          </Tabs>
        </div>
      </AdminAuthGate>
    </AdminProvider>
  );
}
