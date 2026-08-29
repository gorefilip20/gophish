"use client";

import * as React from "react";

export interface AdminAuthHeaders {
  "x-admin-address": string;
  "x-admin-message": string;
  "x-admin-signature": string;
}

interface AdminContextValue {
  headers: AdminAuthHeaders | null;
  setHeaders: (h: AdminAuthHeaders | null) => void;
  /** fetch wrapper that injects the admin auth headers */
  authFetch: (input: string, init?: RequestInit) => Promise<Response>;
}

const AdminContext = React.createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [headers, setHeaders] = React.useState<AdminAuthHeaders | null>(null);

  const authFetch = React.useCallback(
    (input: string, init: RequestInit = {}) => {
      return fetch(input, {
        ...init,
        headers: {
          ...(init.headers ?? {}),
          ...(headers ?? {}),
        },
      });
    },
    [headers],
  );

  return (
    <AdminContext.Provider value={{ headers, setHeaders, authFetch }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = React.useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within <AdminProvider>");
  return ctx;
}
