import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as compact USD, e.g. $1.25M */
export function formatUsd(value: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format a large integer with thousands separators */
export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Shorten an EVM address: 0x1234...abcd */
export function shortAddress(address?: string | null, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

/** Generate a short URL-safe referral code */
export function generateReferralCode(seed?: string) {
  const base = (seed ?? crypto.randomUUID()).replace(/[^a-zA-Z0-9]/g, "");
  return `APX-${base.slice(0, 8).toUpperCase()}`;
}

export function clampPercent(n: number) {
  return Math.min(100, Math.max(0, n));
}
