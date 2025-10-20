import FAQSection from "@/components/shared/home/faq";
import TestimonialsSection from "@/components/shared/home/testimonial";
import PricingSection from "@/components/shared/pricing/pricing";
import React from "react";
import PricingHeroSection from "./banner";

const Pricingpage = () => {
  return (
    <div>
      <PricingHeroSection />
      <PricingSection />
      <TestimonialsSection />

      <FAQSection />
    </div>
  );
};

export default Pricingpage;
