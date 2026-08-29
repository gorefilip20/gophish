# RealApex ($APEX) — Presale Ecosystem & Admin Control Panel

A production-ready, 4-route Web3 presale platform built with **Next.js 14 (App
Router)**, **Wagmi v2 + RainbowKit**, **Supabase (PostgreSQL)**, **Tailwind +
shadcn UI**, **Framer Motion**, **Recharts**, and **react-pdf**.

Design system: **The Heritage Edit** — dark tactical luxury (deep green `#1E241C`,
slate green `#4A5D43`, muted gold `#D4AF37`, clean paper `#F4F5F0`).

---

## Routes

| Route         | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `/`           | Landing + live presale swap widget, propel cards, whitepaper banner, tokenomics, roadmap |
| `/dashboard`  | Investor portal (wallet-gated): holdings, referral engine, task hub     |
| `/whitepaper` | Embedded PDF reader (zoom + search), chapter sidebar, brand-incubation form |
| `/admin`      | Protected control panel: analytics, presale management, users, applications |

## API routes

| Endpoint                       | Method | Description                                             |
| ------------------------------ | ------ | ------------------------------------------------------ |
| `/api/analytics/track`         | POST   | Ingests `page_view` / `pdf_download` / `wallet_connect` events |
| `/api/analytics/download-pdf`  | GET    | Streams the whitepaper + records a `pdf_download`      |
| `/api/presale/buy`             | POST   | Records an on-chain purchase, provisions user, bumps raised total |
| `/api/brand/apply`             | POST   | Handles brand-incubation lead submissions              |
| `/api/user/portfolio`          | GET    | A wallet's holdings, referral code & referred users    |
| `/api/admin/stats`             | GET    | Aggregated dashboard metrics (admin-only)              |
| `/api/admin/config`            | PATCH  | Update `site_config` (admin-only)                      |
| `/api/admin/users`             | GET    | User directory with purchase history (admin-only)      |
| `/api/admin/applications`      | GET/PATCH | List / toggle brand-application status (admin-only) |

`middleware.ts` logs unique visitor hits (24h cookie) to `analytics_events`
off the critical path.

---

## File structure

```
realapex/
├── middleware.ts                 # unique-visitor logging
├── supabase/migrations/0001_init.sql
├── public/
│   ├── RealApex_Whitepaper_v1.0.pdf   # placeholder — replace with real PDF
│   └── README.md
└── src/
    ├── app/
    │   ├── layout.tsx  providers.tsx  globals.css
    │   ├── page.tsx                    # landing
    │   ├── dashboard/page.tsx
    │   ├── whitepaper/page.tsx
    │   ├── admin/page.tsx
    │   └── api/… (routes above)
    ├── components/
    │   ├── ui/          # shadcn primitives (button, card, table, dialog, …)
    │   ├── shared/      # Navbar, Footer, Logo, ConnectButton, StatCard, PageViewTracker
    │   ├── landing/     # Hero, PresaleWidget, PropelCards, WhitepaperBanner, Tokenomics, Roadmap
    │   ├── dashboard/   # ConnectGate, ReferralEngine, TaskHub
    │   ├── whitepaper/  # PdfReader, ChapterSidebar, IncubateForm
    │   └── admin/       # AdminAuthGate, StatsPanel, PresaleManager, UsersDirectory, ApplicationsManager
    ├── hooks/           # useSiteConfig, usePresale, usePortfolio, useAnalytics, use-toast
    ├── store/           # usePresaleStore (zustand)
    └── lib/             # wagmi, supabase clients, auth, admin-guard, utils, constants, types
```

---

## Setup

### 1. Install

```bash
cd realapex
npm install     # or pnpm install / yarn
```

### 2. Environment variables

Copy `.env.example` → `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server-only.** Used by API routes + middleware. Never expose. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ | From https://cloud.reown.com |
| `NEXT_PUBLIC_CHAIN_ID` | ✅ | `1` mainnet / `11155111` sepolia |
| `NEXT_PUBLIC_RPC_URL` | – | Optional custom RPC |
| `NEXT_PUBLIC_APEX_TOKEN_ADDRESS` | – | $APEX contract (post-launch) |
| `NEXT_PUBLIC_USDT_TOKEN_ADDRESS` | ✅ | USDT ERC-20 for USDT purchases |
| `ADMIN_WALLET_ADDRESSES` | ✅ | Comma-separated lowercase admin wallets |
| `ADMIN_EMAILS` | – | Comma-separated admin emails (Supabase Auth) |
| `ANALYTICS_IP_SALT` | ✅ | Long random string; salts visitor-IP hashing |
| `NEXT_PUBLIC_SITE_URL` | ✅ | e.g. `http://localhost:3000` |

### 3. Database

Run the migration in the Supabase SQL editor (or via the CLI):

```bash
# Supabase CLI
supabase db push
# — or paste supabase/migrations/0001_init.sql into the SQL editor
```

This creates `users`, `presale_transactions`, `analytics_events`,
`brand_applications`, `site_config` (seeded with a singleton row), plus the
`increment_raised` and `daily_analytics` RPCs and RLS policies.

### 4. Whitepaper PDF

Replace `public/RealApex_Whitepaper_v1.0.pdf` with your real document (keep the
exact filename). See `public/README.md`.

### 5. Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
```

---

## Security notes

- **Admin boundary is server-side.** `/api/admin/*` routes verify either a
  Supabase Auth session email in `ADMIN_EMAILS`, or a wallet in
  `ADMIN_WALLET_ADDRESSES` that signed a fresh (30-min) timestamped challenge.
  The `/admin` UI only reveals panels after a request authenticates.
- **Service-role key never reaches the client** — it is imported only in
  `src/lib/supabase/admin.ts` and used from route handlers / middleware.
- **RLS is enabled** on all tables. The anon key can only read `site_config`
  and insert `analytics_events` / `brand_applications`.
- **Presale records** persist the on-chain `tx_hash`. For production, verify the
  hash against the treasury on-chain before crediting the raised total — the
  hook is marked `TODO(production)` in `src/app/api/presale/buy/route.ts`.
- **Visitor IPs are hashed** (SHA-256 + salt), never stored raw.

## Notes on quoting

The presale quote uses an assumed ETH/USD rate (`usePresale.ts`). Wire this to a
Chainlink price feed or a price API before mainnet.
