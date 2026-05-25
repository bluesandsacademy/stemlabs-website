"use client";

import { motion } from "framer-motion";
import { BookMarked, FlaskConical, Bot, Monitor, Globe, Target, Microscope, Star } from "lucide-react";

const combines = [
  {
    Icon: BookMarked,
    label: "AR-Powered Books",
    desc: "Physical textbooks enhanced with digital AR layers that activate on scan.",
    bg: "bg-blue-500",
    shadow: "shadow-blue-500/40",
  },
  {
    Icon: FlaskConical,
    label: "Immersive STEM Experiences",
    desc: "Hands-on science simulations without needing physical lab equipment.",
    bg: "bg-violet-500",
    shadow: "shadow-violet-500/40",
  },
  {
    Icon: Bot,
    label: "Interactive Science Learning",
    desc: "AI-guided discovery pathways that adapt to each child's curiosity.",
    bg: "bg-emerald-500",
    shadow: "shadow-emerald-500/40",
  },
  {
    Icon: Monitor,
    label: "Smart Classroom Technology",
    desc: "Integrates seamlessly into any existing school infrastructure.",
    bg: "bg-orange-500",
    shadow: "shadow-orange-500/40",
  },
];

const outcomes = [
  { text: "Visualize abstract concepts in 3D", Icon: Globe, bg: "bg-blue-500" },
  { text: "Stay deeply engaged throughout lessons", Icon: Target, bg: "bg-rose-500" },
  { text: "Build natural curiosity and love for science", Icon: Microscope, bg: "bg-violet-500" },
  { text: "Enjoy the act of learning, not just the results", Icon: Star, bg: "bg-amber-400" },
];

const targetTypes = [
  "Nursery Schools",
  "Primary Schools",
  "Homeschool Programs",
  "STEM Clubs",
  "Learning Labs",
];

export default function WhatIsSection() {
  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fef9c3 0%, #fef3c7 50%, #fde68a 100%)" }}
    >
      {/* Blobs */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-orange-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* CSS shape decorations — no text emoji */}
      <div className="absolute top-10 right-10 w-14 h-14 rounded-full bg-orange-400/15 pointer-events-none" />
      <div className="absolute top-20 right-24 w-5 h-5 rounded-full bg-amber-500/20 pointer-events-none" />
      <div className="absolute bottom-14 left-8 w-10 h-10 rounded-full bg-yellow-500/20 pointer-events-none" />
      <div className="absolute top-1/2 left-4 w-5 h-5 rounded-full bg-orange-400/15 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-400/40">
            <Microscope className="w-4 h-4" />
            What is it?
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Learning Beyond{" "}
            <span className="text-amber-600">Textbooks</span>
          </h2>
          <p
            className="text-gray-700 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Blue Sands K12 AR Pedia merges the physical and digital worlds,
            giving children an entirely new way to explore science and discovery.
          </p>
        </motion.div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left – combines */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="space-y-4"
          >
            <p
              className="text-secondary font-bold text-lg mb-6"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Blue Sands K12 AR Pedia combines:
            </p>
            <div className="space-y-3">
              {combines.map(({ Icon, label, desc, bg, shadow }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.09 }}
                  whileHover={{ x: 6, transition: { duration: 0.15 } }}
                  className={`flex items-start gap-4 p-5 ${bg} rounded-3xl shadow-xl ${shadow} group cursor-default`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-white font-bold text-sm mb-1"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-white/80 text-sm leading-relaxed"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right – outcomes + callout */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p
                className="text-secondary font-bold text-lg"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                To help children:
              </p>
              <div className="space-y-3">
                {outcomes.map(({ text, Icon, bg }, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border-2 border-amber-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0 shadow-md`}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <span
                      className="text-gray-700 text-sm font-medium leading-relaxed"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Age callout */}
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-lg shadow-amber-400/40">
                  5–11
                </div>
                <div>
                  <p
                    className="text-secondary font-bold text-base"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    Designed For Children Ages 5–11
                  </p>
                  <p className="text-gray-500 text-sm">
                    Nursery through Primary school level
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {targetTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1.5 bg-amber-400 text-white rounded-full text-xs font-bold shadow-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
