"use client";

import { motion } from "framer-motion";
import { img } from "@/lib/cloudinary";
import Image from "next/image";

const pillars = [
  {
    number: "01",
    title: "Modernize STEM Learning",
    description:
      "Replace passive memorization with hands-on AR exploration that creates lasting understanding.",
  },
  {
    number: "02",
    title: "Improve Experiential Education",
    description:
      "Every child deserves to experience science, not just read about it.",
  },
  {
    number: "03",
    title: "Build Future-Ready Classrooms",
    description:
      "Equip Nigerian schools with the digital infrastructure needed for the AI era.",
  },
  {
    number: "04",
    title: "Empower African Innovators",
    description:
      "Inspire the next generation of African scientists, engineers, and inventors from an early age.",
  },
];

export default function VisionSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary via-[#0369c4] to-secondary py-16 sm:py-20 lg:py-24">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <Image src={img("/grid.png")} alt="" fill className="object-cover" />
      </div>

      {/* Diagonal stripe overlay */}
      <div
        className="absolute inset-0 opacity-8 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 60px,
            rgba(255,255,255,0.04) 60px,
            rgba(255,255,255,0.04) 120px
          )`,
        }}
      />

      {/* Dot accent */}
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={10 + col * 20}
                cy={10 + row * 20}
                r="3"
                fill="white"
              />
            )),
          )}
        </svg>
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            More Than Devices — A National STEM Movement
          </h2>
          <p
            className="text-white/80 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Blue Sands K12 AR Pedia is part of a broader mission to transform
            how an entire generation of Nigerian children experiences education.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {pillars.map(({ number, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-white/8 border border-white/12 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/12 transition-all duration-300 group"
            >
              {/* Number */}
              <p className="text-4xl font-black text-white/20 mb-3 group-hover:text-white/30 transition-colors duration-300">
                {number}
              </p>

              <h3
                className="text-white font-bold text-base mb-2"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {title}
              </h3>
              <p
                className="text-white/70 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
