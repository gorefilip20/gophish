/** Shared DB row types (mirror the Supabase schema). */

export type AuthProvider = "email" | "wallet";

export interface UserRow {
  id: string;
  email: string | null;
  wallet_address: string | null;
  auth_provider: AuthProvider;
  created_at: string;
  referral_code: string | null;
  referred_by: string | null;
}

export type PresaleCurrency = "ETH" | "USDT";

export interface PresaleTransactionRow {
  id: string;
  user_id: string | null;
  wallet_address: string;
  amount_spent: number;
  currency: PresaleCurrency;
  tokens_purchased: number;
  tx_hash: string;
  timestamp: string;
  stage: string;
}

export type AnalyticsEventType = "page_view" | "pdf_download" | "wallet_connect";

export interface AnalyticsEventRow {
  id: string;
  event_type: AnalyticsEventType;
  user_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  path: string | null;
  timestamp: string;
}

export type TokenStatus = "Idea" | "Pre-launch" | "Live";
export type ApplicationStatus = "Pending" | "Contacted" | "Approved";

export interface BrandApplicationRow {
  id: string;
  project_name: string;
  contact_email: string;
  telegram_handle: string | null;
  token_status: TokenStatus;
  budget_usd: number | null;
  services_needed: string | null;
  status: ApplicationStatus;
  created_at: string;
}

export interface SiteConfigRow {
  id: number;
  current_stage: string;
  token_price_usd: number;
  raised_amount_usd: number;
  target_amount_usd: number;
  eth_treasury_address: string;
  usdt_treasury_address: string;
  presale_active: boolean;
  updated_at: string;
}

export interface AdminStats {
  totalVisitors: number;
  totalUsers: number;
  totalPdfDownloads: number;
  totalRaisedUsd: number;
  dailyVisitors: { date: string; count: number }[];
  dailyDownloads: { date: string; count: number }[];
}
