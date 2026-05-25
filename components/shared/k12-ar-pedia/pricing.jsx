"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const packages = [
  {
    id: "explorer",
    badge: "Individual Learner",
    name: "Explorer Pack",
    tagline:
      "For individual children, gifted learners, after-school programs, and STEM clubs.",
    ageRange: "Ages 5–11",
    includes: [
      "1 AR Pedia Tablet",
      "3 Interactive AR Books",
      "Starter STEM Learning Modules",
      "Parent Setup Guide",
    ],
    benefits: [
      "Interactive science exploration",
      "Fun STEM discovery",
      "Improved curiosity & engagement",
      "Learning beyond textbooks",
    ],
    fullUSD: 100,
    fullNGN: 140000,
    depositUSD: 30,
    depositNGN: 42000,
    depositLabel: "30% Deposit",
    popular: false,
  },
  {
    id: "family",
    badge: "Most Popular",
    name: "Smart Family STEM Pack",
    tagline:
      "For parents, homeschool families, and multi-child households wanting quality STEM at home.",
    ageRange: "Whole Family",
    includes: [
      "1 AR Pedia Tablet",
      "5 Interactive AR Books",
      "STEM Challenges & Activities",
      "Parent Support Community",
      "Monthly STEM Challenges",
      "Learning Analytics",
    ],
    benefits: [
      "Shared family learning",
      "Screen time with educational value",
      "Early STEM exposure",
      "AI-era preparation",
    ],
    fullUSD: 150,
    fullNGN: 210000,
    depositUSD: 45,
    depositNGN: 63000,
    depositLabel: "30% Deposit",
    popular: true,
  },
  {
    id: "school",
    badge: "School Starter",
    name: "Smart Classroom Starter",
    tagline:
      "For nursery & primary schools and small STEM academies with 100–300 students.",
    ageRange: "100–300 Students",
    includes: [
      "5–10 AR Pedia Tablets",
      "Classroom AR Book Library",
      "Teacher Orientation",
      "Classroom Deployment Setup",
      "School LMS Access",
      "STEM Showcase Session",
      "Basic Technical Support",
    ],
    benefits: [
      "Classroom transformation",
      "Higher student engagement",
      "STEM positioning advantage",
      "Parent attraction & retention",
    ],
    fullUSD: 300,
    fullNGN: 420000,
    depositUSD: 90,
    depositNGN: 126000,
    depositLabel: "30% Deposit",
    popular: false,
  },
];

export default function K12PricingSection() {
  const [currency, setCurrency] = useState("ngn");

  const formatPrice = (usd, ngn) =>
    currency === "usd"
      ? `$${usd.toLocaleString()}`
      : `₦${ngn.toLocaleString()}`;

  return (
    <section id="pricing" className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4 max-w-3xl mx-auto"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Choose Your Package
          </h2>
          <p
            className="text-gray-600 text-base sm:text-lg"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Flexible packages designed for every learning context — from a
            single child to an entire school.
          </p>

          {/* Currency toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span
              className={`text-sm font-semibold ${currency === "usd" ? "text-secondary" : "text-gray-400"}`}
            >
              USD
            </span>
            <button
              onClick={() => setCurrency(currency === "usd" ? "ngn" : "usd")}
              aria-label="Toggle currency"
              className="relative w-14 h-7 bg-primary rounded-full transition-all duration-300"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  currency === "ngn" ? "translate-x-7" : ""
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold ${currency === "ngn" ? "text-secondary" : "text-gray-400"}`}
            >
              NGN
            </span>
          </div>
        </motion.div>

        {/* Package cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden flex flex-col ${
                pkg.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              <div
                className={`h-full flex flex-col p-6 sm:p-7 rounded-2xl transition-all duration-300 ${
                  pkg.popular
                    ? "bg-primary text-white shadow-xl"
                    : "bg-white text-secondary shadow-md hover:shadow-lg border border-gray-100"
                }`}
              >
                {/* Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      pkg.popular
                        ? "bg-white/20 text-white"
                        : "bg-primary text-white"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>

                {/* Name + tagline */}
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-4 ${pkg.popular ? "text-white/85" : "text-gray-600"}`}
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {pkg.tagline}
                </p>

                {/* Age / size indicator */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 self-start ${
                    pkg.popular ? "bg-white/15 text-white" : "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  {pkg.ageRange}
                </div>

                {/* What's included */}
                <div className="mb-5 flex-1">
                  <p
                    className={`text-xs uppercase tracking-wider font-bold mb-3 ${pkg.popular ? "text-white/60" : "text-gray-400"}`}
                  >
                    Package Includes
                  </p>
                  <ul className="space-y-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <div
                          className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                            pkg.popular ? "bg-white/20" : "bg-primary/10"
                          }`}
                        >
                          <svg
                            className={`w-2.5 h-2.5 ${pkg.popular ? "text-white" : "text-primary"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span
                          className={`text-sm ${pkg.popular ? "text-white/90" : "text-gray-700"}`}
                          style={{ fontFamily: "var(--font-jarkata)" }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div
                  className={`rounded-xl p-4 mb-5 space-y-3 ${
                    pkg.popular ? "bg-white/10" : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${pkg.popular ? "text-white/60" : "text-gray-400"}`}
                      >
                        Pay in Full
                      </p>
                      <p
                        className={`text-2xl font-bold ${pkg.popular ? "text-white" : "text-secondary"}`}
                        style={{ fontFamily: "var(--font-jarkata)" }}
                      >
                        {formatPrice(pkg.fullUSD, pkg.fullNGN)}
                      </p>
                    </div>
                    <Link
                      href="/products/k12-ar-pedia/preorder"
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                        pkg.popular
                          ? "bg-white text-primary hover:bg-gray-50"
                          : "bg-primary text-white hover:bg-secondary"
                      }`}
                    >
                      Pay in Full
                    </Link>
                  </div>

                  <div className="h-px bg-current opacity-10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${pkg.popular ? "text-white/60" : "text-gray-400"}`}
                      >
                        {pkg.depositLabel}
                      </p>
                      <p
                        className={`text-xl font-bold ${pkg.popular ? "text-white/90" : "text-secondary"}`}
                        style={{ fontFamily: "var(--font-jarkata)" }}
                      >
                        {formatPrice(pkg.depositUSD, pkg.depositNGN)}
                      </p>
                    </div>
                    <Link
                      href="/products/k12-ar-pedia/preorder"
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                        pkg.popular
                          ? "border-white/40 text-white hover:bg-white/10"
                          : "border-primary/30 text-primary hover:bg-primary/5"
                      }`}
                    >
                      Pre-Order
                    </Link>
                  </div>
                </div>
              </div>

              {/* Popular ribbon */}
              {pkg.popular && (
                <div className="absolute top-3 right-[-8%] bg-secondary text-white text-[10px] font-bold px-8 py-1.5 shadow-md transform rotate-30">
                  Most Popular
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-500 text-sm mt-8"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Nigeria&apos;s immersive STEM learning ecosystem for the next
          generation. All prices include setup and onboarding support.
        </motion.p>
      </div>
    </section>
  );
}
