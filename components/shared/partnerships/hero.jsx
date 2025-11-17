"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PartnershipsHeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#0A7FFF] via-[#0B6FE8] to-[#0D5FD1] py-20 lg:py-24">
      {/* Grid Background Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url('/grid.png')",
          backgroundSize: "contain",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Decorative Dots Pattern - Top Right */}
      <div className="absolute top-8 right-8 lg:top-12 lg:right-32">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          className="opacity-30"
        >
          {/* Create a 6x6 grid of dots */}
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={10 + col * 20}
                cy={10 + row * 20}
                r="3"
                fill="white"
              />
            ))
          )}
        </svg>
      </div>

      {/* Decorative Dots Pattern - Bottom Left */}
      <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-16">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="opacity-30"
        >
          {/* Create a 4x4 grid of dots */}
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={10 + col * 20}
                cy={10 + row * 20}
                r="3"
                fill="white"
              />
            ))
          )}
        </svg>
      </div>

      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6 lg:space-y-8"
          >
            {/* Heading */}
            <h2 className="font-bold text-4xl lg:text-5xl xl:text-6xl leading-tight">
              Partnerships that Power
              <br />
              Innovation in Education
            </h2>

            {/* Description */}
            <p className="text-base lg:text-lg leading-relaxed text-white/90 max-w-xl">
              We work with schools, governments, organizations, and investors to
              scale immersive, technology-driven science learning across Africa,
              ensuring every student has the tools to explore, discover, and
              succeed.
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold text-base lg:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Apply to Partner
            </motion.button>
          </motion.div>

          {/* Right Image */}
          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[500px]">
              {/* Glow background */}
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-[2.5rem] scale-105 pointer-events-none z-0" />
              {/* <div className="bg-red-500 -left-28 h-[375px] rounded-tl-[50%, 40%] w-[300px] hidden md:block absolute inset-0 z-10"></div> */}
              {/* Image container with explicit aspect ratio */}
              <div className="relative w-full pt-[75%] rounded-[2.5rem] overflow-hidden shadow-2xl z-50">
                {/* pt-[75%] = 4:3 aspect ratio (3/4 = 0.75) */}
                <Image
                  src="/partnerships/1.jpg"
                  alt="Partnership - Student presenting in classroom"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Decorative blur orbs */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-xl z-0" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl z-0" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
