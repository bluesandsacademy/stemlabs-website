"use client";

import { teacherfeatures } from "@/lib/data";
import { FeatureCard } from "./card";

export default function FeaturesScrollSection() {
  return (
    <section className="relative py-20 bg-gray-50">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-4">
          For Teachers
        </h2>
        <p className="text-lg text-gray-600">
          All classrooms get shared some of the biggest headaches, science
          education
        </p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-24 pb-32">
        {teacherfeatures.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
