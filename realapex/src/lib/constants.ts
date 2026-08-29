/** Static brand + presale constants shared across the app. */

export const BRAND = {
  name: "RealApex",
  ticker: "$APEX",
  tagline: "The Premier Brand Incubator & Token Acceleration Protocol.",
  whitepaperFile: "RealApex_Whitepaper_v1.0.pdf",
} as const;

/** Fallback config used before the DB `site_config` row loads (or in dev). */
export const DEFAULT_SITE_CONFIG = {
  current_stage: "Stage 1",
  token_price_usd: 0.025,
  raised_amount_usd: 0,
  target_amount_usd: 2_500_000,
  eth_treasury_address: "0x0000000000000000000000000000000000000000",
  usdt_treasury_address: "0x0000000000000000000000000000000000000000",
  presale_active: true,
} as const;

export type Currency = "ETH" | "USDT";

/** "How RealApex Propels Your Coin" — the 4 pillars. */
export const PROPEL_PILLARS = [
  {
    key: "dex-trending",
    title: "DEX Trending",
    blurb:
      "Engineered visibility across DEXTools, DexScreener & CoinGecko trending boards — putting your ticker in front of the market at peak flow.",
    icon: "TrendingUp",
  },
  {
    key: "kol-raids",
    title: "Syndicated KOL Raids",
    blurb:
      "Coordinated influencer raids across our vetted syndicate of Web3 KOLs — synchronized reach that converts attention into holders.",
    icon: "Megaphone",
  },
  {
    key: "volume-vanguard",
    title: "Volume Vanguard",
    blurb:
      "Automated liquidity & volume programs that sustain healthy on-chain activity and defend chart integrity through launch turbulence.",
    icon: "Waves",
  },
  {
    key: "heritage-positioning",
    title: "Heritage Positioning",
    blurb:
      "Institutional-grade brand architecture — narrative, design, and market posture that makes your project read as a blue-chip, not a meme.",
    icon: "Landmark",
  },
] as const;

/** Tokenomics allocation (percentages sum to 100). */
export const TOKENOMICS = [
  { label: "Presale", value: 35, color: "#D4AF37" },
  { label: "Liquidity & Vanguard", value: 25, color: "#4A5D43" },
  { label: "Ecosystem & Incubation", value: 20, color: "#8AA07E" },
  { label: "Team (vested)", value: 12, color: "#6B7A5E" },
  { label: "Treasury / Reserve", value: 8, color: "#B9A24E" },
] as const;

/** Roadmap phases. */
export const ROADMAP = [
  {
    phase: "Phase I",
    title: "Foundation",
    done: true,
    items: ["Brand & protocol architecture", "Whitepaper v1.0", "Presale infrastructure launch"],
  },
  {
    phase: "Phase II",
    title: "Acceleration",
    done: false,
    items: ["Public presale stages", "First incubated launches", "KOL syndicate onboarding"],
  },
  {
    phase: "Phase III",
    title: "Expansion",
    done: false,
    items: ["$APEX DEX listing", "Volume Vanguard automation live", "Staking & vesting portal"],
  },
  {
    phase: "Phase IV",
    title: "Heritage",
    done: false,
    items: ["Cross-chain incubation", "DAO governance", "Institutional partnerships"],
  },
] as const;

/** Whitepaper chapters for the sidebar (Chapters I–X). */
export const WHITEPAPER_CHAPTERS = [
  { id: "ch-1", roman: "I", title: "Executive Summary" },
  { id: "ch-2", roman: "II", title: "The Incubation Thesis" },
  { id: "ch-3", roman: "III", title: "Protocol Architecture" },
  { id: "ch-4", roman: "IV", title: "The $APEX Token" },
  { id: "ch-5", roman: "V", title: "Tokenomics & Distribution" },
  { id: "ch-6", roman: "VI", title: "Acceleration Engine" },
  { id: "ch-7", roman: "VII", title: "Volume Vanguard" },
  { id: "ch-8", roman: "VIII", title: "Governance & Vesting" },
  { id: "ch-9", roman: "IX", title: "Roadmap" },
  { id: "ch-10", roman: "X", title: "Legal & Risk Disclosures" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/whitepaper", label: "Whitepaper" },
] as const;
