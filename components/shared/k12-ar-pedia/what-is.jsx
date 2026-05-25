"use client";

import { motion } from "framer-motion";
import { BookOpen, Cpu, FlaskConical, Monitor } from "lucide-react";

const combines = [
  {
    icon: BookOpen,
    label: "AR-Powered Books",
    desc: "Physical textbooks enhanced with digital AR layers that activate on scan.",
    color: "bg-blue-500",
    soft: "bg-blue-50 text-blue-600",
  },
  {
    icon: FlaskConical,
    label: "Immersive STEM Experiences",
    desc: "Hands-on science simulations without needing physical lab equipment.",
    color: "bg-purple-500",
    soft: "bg-purple-50 text-purple-600",
  },
  {
    icon: Cpu,
    label: "Interactive Science Learning",
    desc: "AI-guided discovery pathways that adapt to each child's curiosity.",
    color: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Monitor,
    label: "Smart Classroom Technology",
    desc: "Integrates seamlessly into any existing school infrastructure.",
    color: "bg-orange-500",
    soft: "bg-orange-50 text-orange-600",
  },
];

const outcomes = [
  "Visualize abstract concepts in 3D",
  "Stay deeply engaged throughout lessons",
  "Build natural curiosity and love for science",
  "Enjoy the act of learning, not just the results",
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
    <section className="relative bg-[#f8fafc] py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0483e212 1px, transparent 1px)",
          backgroundSize: "28px 28px",
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
            Interactive Learning Beyond Textbooks
          </h2>
          <p
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
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
              {combines.map(({ icon: Icon, label, desc, soft }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.09 }}
                  className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${soft} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-secondary font-bold text-sm mb-0.5"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-gray-500 text-sm leading-relaxed"
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
                {outcomes.map((outcome, i) => (
                  <motion.div
                    key={outcome}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span
                      className="text-gray-700 text-sm leading-relaxed"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {outcome}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Age callout */}
            <div className="bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-primary/30">
                  5–11
                </div>
                <div>
                  <p
                    className="text-secondary font-bold text-base"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    Designed Specifically For Children Ages 5–11
                  </p>
                  <p className="text-gray-500 text-sm">Nursery through Primary school level</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {targetTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1.5 bg-white border border-primary/20 text-secondary rounded-full text-xs font-semibold shadow-sm"
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
