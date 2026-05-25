"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, GraduationCap, RefreshCcw } from "lucide-react";

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
    <section className="relative bg-slate-50 py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-500/40">
            <RefreshCcw className="w-4 h-4" />
            Why Make the Switch?
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Traditional Learning Is{" "}
            <span className="text-red-500">No Longer Enough</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-4 max-w-5xl mx-auto items-center">

          {/* Traditional column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20"
            style={{ background: "linear-gradient(160deg, #ef4444 0%, #be123c 100%)" }}
          >
            <div className="px-6 py-5 flex items-center gap-3 border-b border-white/20">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>
              <h3
                className="font-bold text-white text-base"
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
                  className="flex items-center gap-3 p-3 bg-white/15 rounded-2xl border border-white/20"
                >
                  <XCircle className="w-5 h-5 text-red-200 shrink-0" strokeWidth={2} />
                  <span
                    className="text-white text-sm leading-relaxed font-medium"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* VS badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-2xl shrink-0">
              <span
                className="text-white font-black text-lg"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                VS
              </span>
            </div>
          </motion.div>

          {/* AR Pedia column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20"
            style={{ background: "linear-gradient(160deg, #10b981 0%, #0d9488 100%)" }}
          >
            <div className="px-6 py-5 flex items-center gap-3 border-b border-white/20">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>
              <h3
                className="font-bold text-white text-base"
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
                  className="flex items-center gap-3 p-3 bg-white/15 rounded-2xl border border-white/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" strokeWidth={2} />
                  <span
                    className="text-white text-sm leading-relaxed font-bold"
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
          <div
            className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 shadow-xl shadow-secondary/30"
            style={{ background: "linear-gradient(135deg, #02345a, #0483e2)" }}
          >
            <GraduationCap className="w-6 h-6 text-white shrink-0" />
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
