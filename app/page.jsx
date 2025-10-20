"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/shared/home/hero";
import SubHero from "@/components/shared/home/sub-hero";

// Lazy load components
const FeaturesSection = dynamic(
  () => import("@/components/shared/home/features"),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const SolutionWorksHero = dynamic(
  () => import("@/components/shared/home/solution"),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const STEMChallengesSection = dynamic(
  () => import("@/components/shared/home/challenges"),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const PricingSection = dynamic(
  () => import("@/components/shared/home/pricing"),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const TeamSection = dynamic(() => import("@/components/shared/home/team"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});

const BlogSection = dynamic(() => import("@/components/shared/home/blog"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});

const TestimonialsSection = dynamic(
  () => import("@/components/shared/home/testimonial"),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const FAQSection = dynamic(() => import("@/components/shared/home/faq"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});

function SectionSkeleton() {
  return (
    <div className="w-full h-96 bg-gray-50 animate-pulse flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Optimized Loading Screen Component
function OptimizedLoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 25; // Faster increment
      });
    }, 100);

    const timer = setTimeout(() => {
      onComplete();
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-60" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Blue Stem Labs"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>

        {/* Simplified text */}
        <h1
          className="text-3xl font-bold text-primary"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          BLUE STEM LABS
        </h1>

        {/* Progress bar only */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const Homepage = () => {
  const [showLoading, setShowLoading] = useState(() => {
    // Only show on first visit using sessionStorage
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("hasVisited");
      return !hasVisited;
    }
    return false;
  });

  const handleLoadingComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true");
    }
    setShowLoading(false);
  };

  // Show loading only on first visit
  if (showLoading) {
    return <OptimizedLoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <SubHero />

      <Suspense fallback={<SectionSkeleton />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SolutionWorksHero />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <STEMChallengesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <PricingSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TeamSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FAQSection />
      </Suspense>
    </div>
  );
};

export default Homepage;
