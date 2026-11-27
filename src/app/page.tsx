import { CompactContactStrip } from "@/components/landing/CompactContactStrip";
import { CsMarqueeStrip } from "@/components/landing/CsMarqueeStrip";
import { ExpandingToolsStrips } from "@/components/landing/ExpandingToolsStrips";
import { InteractiveDeskHero } from "@/components/landing/InteractiveDeskHero";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingTopbar } from "@/components/landing/LandingTopbar";
import { RealitySwitchSection } from "@/components/landing/RealitySwitchSection";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomDock } from "@/components/layout/MobileBottomDock";

export default function HomePage() {
  return (
    <div id="landingView" className="flex-1 flex flex-col w-full">
      <LandingTopbar />

      <main className="flex-1 w-full">
        <InteractiveDeskHero />
        <ExpandingToolsStrips />
        <CsMarqueeStrip />
        <RealitySwitchSection />
        <LandingFaqSection />
        <CompactContactStrip />
      </main>

      <Footer />
      <MobileBottomDock />
    </div>
  );
}
