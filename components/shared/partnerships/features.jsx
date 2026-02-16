"use client";

import { FeatureCard } from "@/components/shared/partnerships/card";
import { featuresData } from "@/lib/data";
import { useEffect } from "react";

export default function FeaturesSection() {
  // Preload critical images on component mount
  useEffect(() => {
    // Preload first 2 feature images
    featuresData.slice(0, 2).forEach((feature) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = feature.image;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50/30 to-white py-10 lg:py-12">
      {/* Section Header */}

      {/* Feature Cards with Sticky Scroll */}
      <div className="container mx-auto px-6">
        <div className="space-y-12 lg:space-y-16">
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Spacing for Last Card Animation */}
    </section>
  );
}
