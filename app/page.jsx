"use client";

import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/shared/home/hero";
import SubHero from "@/components/shared/home/sub-hero";
import Loading from "./loading";
import VirtualLabVideoSection from "@/components/shared/features/lab";
import VirtualLabsSection from "@/components/shared/home/about";
import MilestonesSection from "@/components/shared/home/milestones";
import EmpoweringLearningSection from "@/components/shared/home/learn";
import AfricaStatsSection from "@/components/shared/home/africaStats";

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

const Homepage = () => {
  const [showLoading, setShowLoading] = useState(() => {
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

  if (showLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <VirtualLabsSection />
      <MilestonesSection />
      <EmpoweringLearningSection />

      <SubHero />
      <AfricaStatsSection />
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturesSection />
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
