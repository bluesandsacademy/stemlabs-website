"use client";

import { studentFeatures } from "@/lib/data";
import { FeatureCard } from "./card";
import Image from "next/image";
import { useEffect } from "react";

export default function ForStudentsSection() {
  // Preload critical images on component mount
  useEffect(() => {
    // Preload first 2 student feature images
    studentFeatures.slice(0, 2).forEach((feature) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = feature.image;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <section className="relative py-0 bg-primary overflow-hidden font-sans">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <Image src="/grid.png" alt="" fill className="object-cover" priority />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Feature Cards */}
        <div className="space-y-24 pb-32">
          {studentFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
