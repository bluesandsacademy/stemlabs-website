import EmpoweringFutureSection from "@/components/shared/how-it-works/empower";
import ExperienceSection from "@/components/shared/how-it-works/experience";
import FAQSection from "@/components/shared/how-it-works/faq";
import HeroSection from "@/components/shared/how-it-works/hero";
import ForSchoolsSection from "@/components/shared/how-it-works/schools";

import ForStudentsSection from "@/components/shared/how-it-works/students";
import TeachersSection from "@/components/shared/how-it-works/teachers";

import TechnicalHighlightsSection from "@/components/shared/how-it-works/technical";

import React from "react";

export const metadata = {
  title:
    "How It Works | Virtual STEM Learning Platform by Blue Sands STEM Labs",
  description:
    "See how Blue Sands STEM Labs helps teachers and students perform real science experiments through AI, AR, and VR simulations,even without internet access.",
};
export default function HowItWorksPage() {
  return (
    <div>
      <HeroSection />
      <ExperienceSection />
      <ForStudentsSection />

      <TeachersSection />
      <ForSchoolsSection />

      <TechnicalHighlightsSection />

      <EmpoweringFutureSection />
    </div>
  );
}
