"use client";
import React from "react";
import Image from "next/image";

const Collaborations = () => {
  const partners = [
    {
      name: "Canva",
      logo: "https://cdn.simpleicons.org/canva/00C4CC",
      url: "https://www.canva.com",
    },
    {
      name: "Descript",
      logo: "https://logo.clearbit.com/descript.com",
      url: "https://www.descript.com",
    },
    {
      name: "Apollo.io",
      logo: "https://logo.clearbit.com/apollo.io",
      url: "https://www.apollo.io",
    },
    {
      name: "Strava",
      logo: "https://cdn.simpleicons.org/strava/FC4C02",
      url: "https://www.strava.com",
    },
    {
      name: "Bolt & Branch",
      logo: "https://logo.clearbit.com/bollandbranch.com",
      url: "https://www.bollandbranch.com",
    },
    {
      name: "Atlassian",
      logo: "https://cdn.simpleicons.org/atlassian/0052CC",
      url: "https://www.atlassian.com",
    },
    {
      name: "ARC",
      logo: "https://logo.clearbit.com/arc.net",
      url: "https://arc.net",
    },
    {
      name: "Coda",
      logo: "https://logo.clearbit.com/coda.io",
      url: "https://coda.io",
    },
    {
      name: "Notion",
      logo: "https://cdn.simpleicons.org/notion/000000",
      url: "https://www.notion.so",
    },
    {
      name: "Ironclad",
      logo: "https://logo.clearbit.com/ironclad.com",
      url: "https://www.ironclad.com",
    },
    {
      name: "24pages",
      logo: "/home/team/24pages.png",
      url: "https://www.24pagesafrica.com/",
    },
  ];

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p
            className="text-gray-500 text-sm sm:text-base mb-8 tracking-wide"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Our Current & Past Collaborations
          </p>

          {/* Logos Grid */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                aria-label={`Visit ${partner.name}`}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={140}
                  height={50}
                  className="object-contain h-10 sm:h-12 w-auto max-w-[140px]"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborations;
