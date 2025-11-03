import CTA from "@/components/shared/about/c";
import AboutHero from "@/components/shared/about/hero";

import CoreValuesSection from "@/components/shared/about/values";
import VisionMissionPurpose from "@/components/shared/about/vision";
import WhoWeAre from "@/components/shared/about/who";

import TeamSection from "@/components/shared/home/team";
import React from "react";

export const metadata = {
  title:
    "About Blue Sands STEM Labs | Africa’s Virtual Science Education Pioneer",
  description:
    "Blue Sands STEM Labs is revolutionizing STEM education across Nigeria and Africa with immersive virtual labs powered by AI, AR, and VR,  making science learning accessible, interactive, and inclusive for all.",
};
export default function Aboutpage() {
  return (
    <div>
      <AboutHero />
      <WhoWeAre />
      <VisionMissionPurpose />
      <CoreValuesSection />
      <TeamSection />
      <CTA />
    </div>
  );
}
