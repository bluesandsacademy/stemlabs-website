"use client";

import { motion } from "framer-motion";
import { Microscope, TrendingUp, Rocket, GraduationCap, BookOpen, Wifi } from "lucide-react";

const benefits = [
  {
    Icon: Microscope,
    title: "Immersive STEM Learning",
    description:
      "Children learn science through interactive AR experiences that bring textbook concepts to life.",
    color: "bg-blue-500",
    shadow: "shadow-blue-500/25",
  },
  {
    Icon: TrendingUp,
    title: "Higher Classroom Engagement",
    description:
      "Dramatically improves attention, curiosity, and active participation during lessons.",
    color: "bg-emerald-500",
    shadow: "shadow-emerald-500/25",
  },
  {
    Icon: Rocket,
    title: "Future-Ready Education",
    description:
      "Prepares learners for AI-driven and digital economies with 21st-century skills.",
    color: "bg-violet-500",
    shadow: "shadow-violet-500/25",
  },
  {
    Icon: GraduationCap,
    title: "Teacher-Friendly System",
    description:
      "Simple deployment, intuitive controls, and guided onboarding so teachers succeed from day one.",
    color: "bg-orange-500",
    shadow: "shadow-orange-500/25",
  },
  {
    Icon: BookOpen,
    title: "Curriculum Support",
    description:
      "Aligns with and enhances modern STEM classroom delivery across nursery and primary levels.",
    color: "bg-rose-500",
    shadow: "shadow-rose-500/25",
  },
  {
    Icon: Wifi,
    title: "Smart Classroom Integration",
    description:
      "Works seamlessly alongside existing digital learning environments and school infrastructure.",
    color: "bg-cyan-500",
    shadow: "shadow-cyan-500/25",
  },
];

export default function BenefitsSection() {
  return (
    <section className="relative bg-[#FAFBFF] py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #e2e8f018 1px, transparent 1px), linear-gradient(to bottom, #e2e8f018 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Center glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-48 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
            <TrendingUp className="w-4 h-4" />
            Why It Works
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Why Schools Love{" "}
            <span className="text-primary">Blue Sands AR Pedia</span>
          </h2>
          <p
            className="text-gray-500 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            A complete solution designed to elevate every aspect of the
            classroom experience.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ Icon, title, description, color, shadow }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300"
            >
              {/* Top color reveal on hover */}
              <div className={`absolute top-0 inset-x-0 h-1 ${color} rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-5 shadow-lg ${shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>

              <h3
                className="text-secondary font-bold text-lg mb-2.5"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
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
