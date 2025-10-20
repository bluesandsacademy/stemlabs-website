import ContactOptionsForms from "@/components/shared/contact/form";
import ContactHeroSection from "@/components/shared/contact/hero";
import OfficeHours from "@/components/shared/contact/hours";
import ThreeQuickPaths from "@/components/shared/contact/paths";
import React from "react";

const ContactPage = () => {
  return (
    <div>
      <ContactHeroSection />
      <ThreeQuickPaths />
      <ContactOptionsForms />
      <OfficeHours />
    </div>
  );
};

export default ContactPage;
