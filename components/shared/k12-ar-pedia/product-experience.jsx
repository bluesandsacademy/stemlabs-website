"use client";

import { motion } from "framer-motion";
import { Heart, PawPrint, Globe, FlaskConical, Settings, BookOpen, Lightbulb } from "lucide-react";

const modules = [
  {
    Icon: Heart,
    title: "Human Anatomy",
    description: "Explore the human body system by system — from bones to organs — in stunning 3D.",
    gradient: "from-red-400 to-rose-600",
    shadow: "shadow-red-500/40",
  },
  {
    Icon: PawPrint,
    title: "Animals & Nature",
    description: "Encounter wildlife and ecosystems up close through interactive AR overlays.",
    gradient: "from-emerald-400 to-teal-600",
    shadow: "shadow-emerald-500/40",
  },
  {
    Icon: Globe,
    title: "Space & Planets",
    description: "Journey through the solar system, galaxies, and cosmic phenomena.",
    gradient: "from-indigo-400 to-purple-600",
    shadow: "shadow-indigo-500/40",
  },
  {
    Icon: FlaskConical,
    title: "Science Experiments",
    description: "Run safe, interactive lab experiments in AR — no equipment needed.",
    gradient: "from-blue-400 to-cyan-600",
    shadow: "shadow-blue-500/40",
  },
  {
    Icon: Settings,
    title: "Engineering Concepts",
    description: "Build, assemble, and test virtual machines to understand engineering.",
    gradient: "from-amber-400 to-orange-600",
    shadow: "shadow-amber-500/40",
  },
  {
    Icon: BookOpen,
    title: "Interactive Storytelling",
    description: "Stories that leap off the page with AR characters and scene animations.",
    gradient: "from-purple-400 to-fuchsia-600",
    shadow: "shadow-purple-500/40",
  },
  {
    Icon: Lightbulb,
    title: "STEM Discovery",
    description: "Guided challenges that spark curiosity and build critical thinking.",
    gradient: "from-cyan-400 to-blue-600",
    shadow: "shadow-cyan-500/40",
  },
];

export default function ProductExperienceSection() {
  return (
    <section className="relative bg-[#f0f9ff] py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0ea5e925 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-yellow-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* CSS shape decorations — no text emoji */}
      <div className="absolute top-8 left-10 w-10 h-10 rounded-full bg-amber-400/20 pointer-events-none" />
      <div className="absolute top-16 left-20 w-4 h-4 rounded-full bg-amber-400/30 pointer-events-none" />
      <div className="absolute top-10 right-12 w-8 h-8 rounded-full bg-indigo-400/25 pointer-events-none" />
      <div className="absolute bottom-20 left-14 w-6 h-6 rounded-full bg-emerald-400/25 pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-10 h-10 rounded-full bg-rose-400/20 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400 text-white text-sm font-bold shadow-lg shadow-amber-400/40">
            <Globe className="w-4 h-4" />
            Explore the Modules
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            A World of Discovery in{" "}
            <span className="text-amber-500">Every Book</span>
          </h2>
          <p
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Each AR Pedia module sparks genuine curiosity and makes complex
            subjects feel natural and exciting.
          </p>
        </motion.div>

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {modules.map(({ Icon, title, description, gradient, shadow }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              className={`relative bg-linear-to-br ${gradient} rounded-3xl p-6 shadow-xl ${shadow} hover:shadow-2xl transition-shadow duration-300 cursor-default overflow-hidden ${
                i === 6 ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""
              }`}
            >
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/15 rounded-full pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full pointer-events-none" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4 relative z-10">
                <Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/25 mb-3">
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                  AR Module
                </span>
              </div>

              <h3
                className="text-white font-bold text-base mb-2 relative z-10"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {title}
              </h3>
              <p
                className="text-white/85 text-sm leading-relaxed relative z-10"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wave into next section */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
          <path fill="white" d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" />
        </svg>
      </div>
    </section>
  );
}
