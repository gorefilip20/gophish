"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "wagmi";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "PLACEHOLDER_PROJECT_ID";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "1");
const activeChain = chainId === 11155111 ? sepolia : mainnet;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

/**
 * RainbowKit + Wagmi v2 config. `getDefaultConfig` wires up injected,
 * WalletConnect, Coinbase & other connectors out of the box.
 */
export const wagmiConfig = getDefaultConfig({
  appName: "RealApex Presale",
  projectId,
  chains: [activeChain],
  transports: {
    [mainnet.id]: http(rpcUrl || undefined),
    [sepolia.id]: http(rpcUrl || undefined),
  },
  ssr: true,
});

export { activeChain };
