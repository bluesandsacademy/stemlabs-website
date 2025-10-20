"use client";

import { technicalFeatures } from "@/lib/data";
import { FeatureCard } from "./card";

export default function TechnicalHighlightsSection() {
  return (
    <section className="relative py-20 bg-white">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-4 relative inline-block">
          Technical Highlights
          <svg
            className="absolute -bottom-2 left-0 w-full"
            height="8"
            viewBox="0 0 300 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6C50 2 100 1 150 2C200 3 250 4 298 6"
              stroke="#0483e2"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </h2>
      </div>

      {/* Feature Cards */}
      <div className="space-y-24 pb-32">
        {technicalFeatures.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
