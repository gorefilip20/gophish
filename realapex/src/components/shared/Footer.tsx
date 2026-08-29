import Link from "next/link";
import { Logo } from "./Logo";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-heritage-gold/15 bg-heritage-bg/60">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-heritage-paper/55">{BRAND.tagline}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-heritage-gold/80">
            Navigate
          </h4>
          <ul className="space-y-2 text-sm text-heritage-paper/60">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-heritage-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/whitepaper" className="hover:text-heritage-gold">
                Incubate Your Brand
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-heritage-gold/80">
            Disclaimer
          </h4>
          <p className="text-xs leading-relaxed text-heritage-paper/45">
            {BRAND.ticker} is a utility token. Nothing on this site is financial
            advice. Crypto assets are volatile and you may lose your capital.
            Participate only after reading the whitepaper and applicable risk
            disclosures.
          </p>
        </div>
      </div>
      <div className="border-t border-heritage-gold/10 py-5">
        <p className="container text-center text-xs text-heritage-paper/40">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
