"use client";
import React from "react";
import Image from "next/image";

const Collaborations = () => {
  const partners = [
    {
      name: "24pages",
      logo: "/home/24pages.png",
      url: "https://www.24pagesafrica.com/",
    },
    {
      name: "AITeacha",
      logo: "/home/team/aiteacha.png",
      url: "https://www.24pagesafrica.com/",
    },
  ];

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <p
            className="text-gray-500 font-bold text-3xl sm:text-4xl md:text-4xl lg:text-5xl leading-tight py-12"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Our Partners
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
                  height={140}
                  className="object-contain h-20 sm:h-40 w-auto max-w-[240px]"
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
