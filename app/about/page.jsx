import Gallery from "@/components/shared/about/images";
import Title from "@/components/shared/about/title";
import CoreValuesSection from "@/components/shared/about/values";
import VisionMissionSection from "@/components/shared/about/vision";
import TeamSection from "@/components/shared/home/team";
import React from "react";

const Aboutpage = () => {
  return (
    <div>
      <Title />
      <Gallery />
      <VisionMissionSection />
      <CoreValuesSection />
      <TeamSection />
    </div>
  );
};

export default Aboutpage;
