"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  PawPrint,
  Globe,
  FlaskConical,
  Wrench,
  BookOpen,
  Lightbulb,
} from "lucide-react";

const modules = [
  {
    icon: HeartPulse,
    title: "Human Anatomy",
    description:
      "Explore the human body system by system — from skeletal structure to organ function — in detailed 3D.",
    gradient: "from-red-500/30 via-red-500/10 to-transparent",
    border: "border-red-200",
    iconBg: "bg-red-500 text-white",
    badge: "bg-red-100 text-red-700",
  },
  {
    icon: PawPrint,
    title: "Animals & Nature",
    description:
      "Encounter wildlife and ecosystems up close through interactive AR overlays on living specimens.",
    gradient: "from-green-500/30 via-green-500/10 to-transparent",
    border: "border-green-200",
    iconBg: "bg-green-500 text-white",
    badge: "bg-green-100 text-green-700",
  },
  {
    icon: Globe,
    title: "Space & Planets",
    description:
      "Take a journey through the solar system, galaxies, and cosmic phenomena with immersive AR.",
    gradient: "from-indigo-500/30 via-indigo-500/10 to-transparent",
    border: "border-indigo-200",
    iconBg: "bg-indigo-500 text-white",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: FlaskConical,
    title: "Science Experiments",
    description:
      "Run safe, interactive lab experiments in AR without the need for physical reagents or equipment.",
    gradient: "from-blue-500/30 via-blue-500/10 to-transparent",
    border: "border-blue-200",
    iconBg: "bg-blue-500 text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    icon: Wrench,
    title: "Engineering Concepts",
    description:
      "Build, assemble, and test virtual machines and structures to understand engineering principles.",
    gradient: "from-amber-500/30 via-amber-500/10 to-transparent",
    border: "border-amber-200",
    iconBg: "bg-amber-500 text-white",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    icon: BookOpen,
    title: "Interactive Storytelling",
    description:
      "Stories that leap off the page with AR characters, scene animations, and narrative exploration.",
    gradient: "from-purple-500/30 via-purple-500/10 to-transparent",
    border: "border-purple-200",
    iconBg: "bg-purple-500 text-white",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    icon: Lightbulb,
    title: "STEM Discovery Modules",
    description:
      "Guided discovery challenges that spark curiosity and build critical thinking one concept at a time.",
    gradient: "from-cyan-500/30 via-cyan-500/10 to-transparent",
    border: "border-cyan-200",
    iconBg: "bg-cyan-500 text-white",
    badge: "bg-cyan-100 text-cyan-700",
  },
];

export default function ProductExperienceSection() {
  return (
    <section className="relative bg-[#eef4ff] py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0483e218 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            A World of Discovery in Every Book
          </h2>
          <p
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Each AR Pedia module is crafted to spark genuine curiosity and make
            complex subjects feel natural and exciting.
          </p>
        </motion.div>

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {modules.map(({ icon: Icon, title, description, gradient, border, iconBg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative bg-linear-to-br ${gradient} border ${border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-default bg-white ${
                i === 6
                  ? "sm:col-span-2 lg:col-span-1 xl:col-span-2"
                  : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-4 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <Icon className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3
                className="text-secondary font-bold text-base mb-2"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {title}
              </h3>
              <p
                className="text-gray-600 text-sm leading-relaxed"
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
