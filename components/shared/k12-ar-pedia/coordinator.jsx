"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ClipboardList,
  Users,
  Star,
} from "lucide-react";

const responsibilities = [
  "School partnerships",
  "Deployment coordination",
  "STEM demonstrations",
  "Institutional onboarding",
  "Regional growth support",
];

const idealFor = [
  "Educators",
  "STEM advocates",
  "Education consultants",
  "ICT trainers",
  "School solution providers",
];

const perks = [
  "Regional exclusivity opportunities",
  "Competitive commission structure",
  "Deployment incentives",
  "Training & certification",
  "Partnership recognition",
];

const columns = [
  {
    icon: ClipboardList,
    title: "Responsibilities",
    items: responsibilities,
    accent: "bg-white/8",
  },
  {
    icon: Users,
    title: "Ideal For",
    items: idealFor,
    accent: "bg-white/8",
  },
  {
    icon: Star,
    title: "Your Benefits",
    items: perks,
    accent: "bg-white/8",
  },
];

export default function CoordinatorSection() {
  return (
    <section
      id="coordinator"
      className="relative overflow-hidden bg-[#0D3B5C] py-16 sm:py-20 lg:py-24"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Dot accent – top right */}
      <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
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
            Become a State Coordinator
          </h2>
          <p
            className="text-white/75 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Blue Sands STEM Labs is recruiting State Distribution Officers &amp;
            Regional Coordinators to lead our expansion across Nigeria.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-12">
          {columns.map(({ icon: Icon, title, items, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`${accent} border border-white/12 rounded-2xl p-6 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3
                  className="text-white font-bold text-base"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {title}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                    <span
                      className="text-white/80 text-sm leading-relaxed"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center"
        >
          <Link
            href="/products/k12-ar-pedia/apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl text-base"
          >
            Apply Now
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <p className="text-white/45 text-sm mt-3">
            Limited coordinator positions per state
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
