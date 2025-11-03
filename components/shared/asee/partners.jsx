import Image from "next/image";

/**
 * Partners Section
 *
 * Displays partner/sponsor logos using Clearbit Logo API
 * This API provides company logos automatically from their domain
 */

export default function PartnersSection() {
  const partners = [
    {
      id: 1,
      name: "Canva",
      domain: "canva.com",
      logo: "https://logo.clearbit.com/canva.com",
    },
    {
      id: 2,
      name: "Descript",
      domain: "descript.com",
      logo: "https://logo.clearbit.com/descript.com",
    },
    {
      id: 3,
      name: "Apollo.io",
      domain: "apollo.io",
      logo: "https://logo.clearbit.com/apollo.io",
    },
    {
      id: 4,
      name: "Strava",
      domain: "strava.com",
      logo: "https://logo.clearbit.com/strava.com",
    },
    {
      id: 5,
      name: "Boll & Branch",
      domain: "bollandbranch.com",
      logo: "https://logo.clearbit.com/bollandbranch.com",
    },
    {
      id: 6,
      name: "Atlassian",
      domain: "atlassian.com",
      logo: "https://logo.clearbit.com/atlassian.com",
    },
    {
      id: 7,
      name: "ARC",
      domain: "arc.net",
      logo: "https://logo.clearbit.com/arc.net",
    },
    {
      id: 8,
      name: "Coda",
      domain: "coda.io",
      logo: "https://logo.clearbit.com/coda.io",
    },
    {
      id: 9,
      name: "Notion",
      domain: "notion.so",
      logo: "https://logo.clearbit.com/notion.so",
    },
    {
      id: 10,
      name: "Ironclad",
      domain: "ironcladapp.com",
      logo: "https://logo.clearbit.com/ironcladapp.com",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-secondary tracking-tight mb-4">
            Our Partners / Friends of ASEE
          </h2>
          <p className="text-foreground/60 text-base md:text-lg font-light">
            Want to be on this wall? → see partnership contacts below.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
          {partners.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Partner Logo Component
 * Uses Clearbit Logo API for automatic logo fetching
 */
function PartnerLogo({ partner }) {
  return (
    <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer group">
      <div className="relative w-28 h-12">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          fill
          className="object-contain group-hover:scale-110 transition-transform duration-300"
          unoptimized // For external logos
        />
      </div>
    </div>
  );
}
