import CTA from "@/components/shared/about/c";
import AboutHero from "@/components/shared/about/hero";

import CoreValuesSection from "@/components/shared/about/values";
import VisionMissionPurpose from "@/components/shared/about/vision";
import WhoWeAre from "@/components/shared/about/who";

import TeamSection from "@/components/shared/home/team";
import React from "react";

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
