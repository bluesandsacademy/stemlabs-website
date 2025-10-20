"use client";

import React, { memo } from "react";
import Title from "@/components/common/title";
import { FeatureCard } from "./featureCard";
import { features } from "@/lib/data";

// Memoize to prevent unnecessary re-renders
const FeaturesSection = memo(() => {
  return (
    <div className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Title
          title="Built for African Universities"
          subText="Addressing infrastructure challenges while delivering world-class education"
        />

        <div className="space-y-[40vh]">
          {features.map((feature, index) => (
            <FeatureCard
              key={`feature-${index}`}
              feature={feature}
              index={index}
              total={features.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
