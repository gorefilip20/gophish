import { Hero } from "@/components/landing/Hero";
import { PresaleWidget } from "@/components/landing/PresaleWidget";
import { PropelCards } from "@/components/landing/PropelCards";
import { WhitepaperBanner } from "@/components/landing/WhitepaperBanner";
import { Tokenomics } from "@/components/landing/Tokenomics";
import { Roadmap } from "@/components/landing/Roadmap";
import { PageViewTracker } from "@/components/shared/PageViewTracker";

export default function HomePage() {
  return (
    <>
      <PageViewTracker />
      <Hero aside={<PresaleWidget />} />
      <PropelCards />
      <WhitepaperBanner />
      <Tokenomics />
      <Roadmap />
    </>
  );
}
