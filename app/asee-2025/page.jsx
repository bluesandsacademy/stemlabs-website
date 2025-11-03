import BenefitsSection from "@/components/shared/asee/benefits";
import RegisterCTA from "@/components/shared/asee/cta";
import EventDetails from "@/components/shared/asee/details";
import AseeHero from "@/components/shared/asee/hero";
import EventHighlight from "@/components/shared/asee/highlight";
import PartnersSection from "@/components/shared/asee/partners";
import PartnershipDesk from "@/components/shared/asee/partnership";
import AseeSection from "@/components/shared/asee/section";
import WhoShouldAttend from "@/components/shared/asee/who";

export default function ASEE2025Page() {
  return (
    <div>
      <AseeHero />
      <AseeSection />
      <WhoShouldAttend />
      <EventHighlight />
      <PartnersSection />
      <BenefitsSection />
      <EventDetails />
      <RegisterCTA />
      <PartnershipDesk />
    </div>
  );
}
