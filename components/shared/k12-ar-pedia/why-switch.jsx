"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const traditional = [
  "Passive memorization",
  "Static, outdated textbooks",
  "One-size-fits-all instruction",
  "Low student engagement",
  "Abstract, hard-to-visualize concepts",
];

const withArPedia = [
  "Hands-on AR exploration",
  "Dynamic, visual content",
  "Adaptive immersive experiences",
  "High curiosity and participation",
  "Concepts come alive in 3D",
];

export default function WhySwitchSection() {
  return (
    <section className="relative bg-gray-50 py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Subtle top/bottom decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

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
            Traditional Learning Is No Longer Enough
          </h2>
          <p
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Today&apos;s children grow up with smartphones, YouTube, AI, and
            interactive media. Yet many classrooms still rely on passive
            memorization and static textbooks.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Traditional column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="bg-white rounded-3xl border border-red-100 overflow-hidden shadow-sm"
          >
            {/* Column header */}
            <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <X className="w-4 h-4 text-red-500" strokeWidth={2.5} />
              </div>
              <h3
                className="font-bold text-red-700 text-base"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Traditional Classroom
              </h3>
            </div>

            <ul className="p-6 space-y-3">
              {traditional.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <X className="w-3 h-3 text-red-500" strokeWidth={2.5} />
                  </div>
                  <span
                    className="text-gray-600 text-sm sm:text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* AR Pedia column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="bg-white rounded-3xl border border-primary/20 overflow-hidden shadow-sm"
          >
            {/* Column header */}
            <div className="bg-primary/6 border-b border-primary/12 px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
              </div>
              <h3
                className="font-bold text-primary text-base"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Blue Sands K12 AR Pedia
              </h3>
            </div>

            <ul className="p-6 space-y-3">
              {withArPedia.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 w-5 h-5 rounded-full bg-primary/12 flex items-center justify-center mt-0.5">
                    <Check
                      className="w-3 h-3 text-primary"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span
                    className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-secondary rounded-2xl px-8 py-4">
            <p
              className="text-white font-bold text-base sm:text-lg"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Blue Sands K12 AR Pedia transforms classrooms into immersive
              learning environments.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
