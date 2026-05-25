"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { label: "Total Orders", value: 100, suffix: "" },
  { label: "Schools Onboarded", value: 10, suffix: "" },
  { label: "Early Access Slots Remaining", value: 900, suffix: "" },
];

function getTimeLeft() {
  const target = new Date("2026-08-31T23:59:59");
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Pad({ n }) {
  return String(n).padStart(2, "0");
}

export default function CountdownSection() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time?.days ?? 0 },
    { label: "Hours", value: time?.hours ?? 0 },
    { label: "Minutes", value: time?.minutes ?? 0 },
    { label: "Seconds", value: time?.seconds ?? 0 },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0D3B5C] py-16 sm:py-20 lg:py-24">
      {/* CSS grid pattern */}
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

      {/* Radial fade at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-3"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Nigeria National Rollout Countdown
          </h2>
          <p className="text-white/60 text-sm font-medium uppercase tracking-wider">
            First 1,000 Orders Campaign
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-14">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-white/8 border border-white/12 rounded-2xl p-6 text-center backdrop-blur-sm"
            >
              <p
                className="text-4xl sm:text-5xl font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {stat.value.toLocaleString()}
                {stat.suffix}
              </p>
              <p className="text-white/65 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <p
            className="text-white/70 text-base sm:text-lg font-medium text-center"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Early Access National Rollout Ends in August
          </p>

          {/* Timer blocks */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 sm:w-20 lg:w-24 h-14 sm:h-20 lg:h-24 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <span
                      className="text-xl sm:text-3xl lg:text-4xl font-bold text-white tabular-nums"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      <Pad n={unit.value} />
                    </span>
                  </div>
                  <span className="text-white/50 text-[10px] sm:text-sm mt-1.5 sm:mt-2 font-medium uppercase tracking-wider">
                    {unit.label}
                  </span>
                </div>

                {/* Colon separator – hide after last */}
                {i < units.length - 1 && (
                  <span className="text-white/40 text-xl sm:text-3xl font-bold -mt-5 animate-pulse">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
