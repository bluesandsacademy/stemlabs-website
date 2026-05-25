"use client";

import { motion } from "framer-motion";
import {
  FlaskConical,
  TrendingUp,
  Rocket,
  GraduationCap,
  BookOpenCheck,
  Laptop,
} from "lucide-react";

const benefits = [
  {
    icon: FlaskConical,
    title: "Immersive STEM Learning",
    description:
      "Children learn science through interactive AR experiences that bring textbook concepts to life.",
    iconBg: "bg-blue-100 text-blue-600",
    topBar: "bg-blue-500",
    glow: "hover:shadow-blue-100",
  },
  {
    icon: TrendingUp,
    title: "Higher Classroom Engagement",
    description:
      "Dramatically improves attention, curiosity, and active participation during lessons.",
    iconBg: "bg-emerald-100 text-emerald-600",
    topBar: "bg-emerald-500",
    glow: "hover:shadow-emerald-100",
  },
  {
    icon: Rocket,
    title: "Future-Ready Education",
    description:
      "Prepares learners for AI-driven and digital economies with 21st-century skills.",
    iconBg: "bg-purple-100 text-purple-600",
    topBar: "bg-purple-500",
    glow: "hover:shadow-purple-100",
  },
  {
    icon: GraduationCap,
    title: "Teacher-Friendly System",
    description:
      "Simple deployment, intuitive controls, and guided onboarding so teachers succeed from day one.",
    iconBg: "bg-orange-100 text-orange-600",
    topBar: "bg-orange-500",
    glow: "hover:shadow-orange-100",
  },
  {
    icon: BookOpenCheck,
    title: "Curriculum Support",
    description:
      "Aligns with and enhances modern STEM classroom delivery across nursery and primary levels.",
    iconBg: "bg-rose-100 text-rose-600",
    topBar: "bg-rose-500",
    glow: "hover:shadow-rose-100",
  },
  {
    icon: Laptop,
    title: "Smart Classroom Integration",
    description:
      "Works seamlessly alongside existing digital learning environments and school infrastructure.",
    iconBg: "bg-cyan-100 text-cyan-600",
    topBar: "bg-cyan-500",
    glow: "hover:shadow-cyan-100",
  },
];

export default function BenefitsSection() {
  return (
    <section className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Why Schools Love Blue Sands K12 AR Pedia
          </h2>
          <p
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            A complete solution designed to elevate every aspect of the
            classroom experience.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map(({ icon: Icon, title, description, iconBg, topBar, glow }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg ${glow} transition-all duration-300`}
            >
              {/* Colored top bar */}
              <div className={`h-1 w-full ${topBar}`} />

              <div className="p-7">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3
                  className="text-secondary font-bold text-lg mb-2.5"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
