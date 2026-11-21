import { LandingTopbar } from "@/components/landing/LandingTopbar";
import { DeskScrollytellingCinema } from "@/components/landing/DeskScrollytellingCinema";
import { ExpandingToolsStrips } from "@/components/landing/ExpandingToolsStrips";
import { CsMarqueeStrip } from "@/components/landing/CsMarqueeStrip";
import { RealitySwitchSection } from "@/components/landing/RealitySwitchSection";
import { InstructorBrandCard } from "@/components/landing/InstructorBrandCard";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div id="landingView" className="flex-1 flex flex-col w-full">
      <LandingTopbar />

      <main id="top" className="flex-1 w-full">
        <DeskScrollytellingCinema />
        <ExpandingToolsStrips />
        <CsMarqueeStrip />
        <RealitySwitchSection />
        <InstructorBrandCard />
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
