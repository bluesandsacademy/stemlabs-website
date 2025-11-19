import { partners } from "@/lib/data";
import Image from "next/image";

export default function PartnersSection() {
  return (
    <section className="w-full bg-white py-10 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-secondary tracking-tight">
            Our Partners
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-0 items-center justify-center">
          {partners.map((partner, index) => (
            <PartnerLogo
              key={partner.id}
              partner={partner}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Partner Logo Component
 */
function PartnerLogo({ partner, isFirst }) {
  // 3× the original size (w-40 = 160px, h-24 = 96px → 480×288px)
  const sizeClass = isFirst ? "w-[480px] h-[288px]" : "w-40 h-24";

  return (
    <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer group">
      <div className={`relative ${sizeClass}`}>
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          fill
          className="object-contain group-hover:scale-110 transition-transform duration-300"
          unoptimized
        />
      </div>
    </div>
  );
}
