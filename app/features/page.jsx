import FAQSection from "@/components/shared/features/faq";
import FeaturesHero from "@/components/shared/features/hero";
import VirtualLabVideoSection from "@/components/shared/features/lab";
import CompareModesSection from "@/components/shared/features/modes";
import ForSchoolsAdminsSection from "@/components/shared/features/schools";
import SimpleSetupSection from "@/components/shared/features/setup";
import ForStudentsSection from "@/components/shared/features/students";
import FeaturesScrollSection from "@/components/shared/features/teachers";
import TechnicalHighlightsSection from "@/components/shared/features/technical";
import TypicalWeekSection from "@/components/shared/features/week";
import React from "react";

const FeaturesPage = () => {
  return (
    <div>
      <FeaturesHero />
      <FeaturesScrollSection />
      <TechnicalHighlightsSection />
      <SimpleSetupSection />

      <ForStudentsSection />
      <VirtualLabVideoSection />
      <ForSchoolsAdminsSection />
      <TypicalWeekSection />
      <CompareModesSection />
      <FAQSection />
    </div>
  );
};

export default FeaturesPage;
