"use client";

import { create } from "zustand";
import type { Currency } from "@/lib/constants";

interface PresaleState {
  currency: Currency;
  amountIn: string;
  setCurrency: (c: Currency) => void;
  setAmountIn: (v: string) => void;
  reset: () => void;
}

export const usePresaleStore = create<PresaleState>((set) => ({
  currency: "ETH",
  amountIn: "",
  setCurrency: (currency) => set({ currency }),
  setAmountIn: (amountIn) => set({ amountIn }),
  reset: () => set({ amountIn: "" }),
}));
