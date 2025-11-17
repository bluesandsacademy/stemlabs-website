"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PartnersSection() {
  const partners = [
    {
      id: 1,
      name: "24pages",
      logo: "/home/24pages.png", // Replace with your actual partner logo path
      width: 160,
      height: 60,
    },
    {
      id: 2,
      name: "Aiteacha",
      logo: "/home/team/aiteacha.png", // Replace with your actual partner logo path
      width: 160,
      height: 60,
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-lg lg:text-xl font-medium text-[#6B7280]">
            Our Current & Past Partners
          </h2>
        </motion.div>

        {/* Partners Grid - Centered for 2 partners */}
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex items-center justify-center"
            >
              <div className="relative grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100 cursor-pointer">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={partner.width}
                  height={partner.height}
                  className="object-contain w-auto h-[50px] lg:h-[150px]"
                  quality={95}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional: Add a subtle bottom border like in the reference */}
        <div className="mt-12 lg:mt-16 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
      </div>
    </section>
  );
}
