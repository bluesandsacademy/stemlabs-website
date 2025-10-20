"use client";

import React from "react";
import { motion } from "framer-motion";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic Plan",
      price: "₦5,000",
      period: "/term",
      features: [
        "50+ Virtual Labs",
        "Up to 200 Students",
        "Basic LMS Integration",
        "Email Support",
        "Mobile App Access",
      ],
      popular: false,
    },
    {
      name: "University Plan",
      price: "₦65,000",
      period: "/month",
      features: [
        "150+ Virtual Labs",
        "Up to 1,000 Students",
        "Advanced Analytics",
        "Multi-Language Support",
        "Priority Support",
        "Custom Branding",
      ],
      popular: false,
    },
    {
      name: "Enterprise Plan",
      price: null,
      period: null,
      features: [
        "200+ Virtual Labs",
        "Unlimited Students",
        "Custom Lab Development",
        "Dedicated Account Manager",
        "API Access",
        "White-Label Solution",
      ],
      popular: true,
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base font-semibold text-primary uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Pricing
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-4"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Affordable Plans for Secondary School
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Flexible pricing designed for African educational budgets
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 right-6 z-10">
                  <div
                    className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Most popular!
                  </div>
                </div>
              )}

              <div
                className={`h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300
                              ${
                                plan.popular
                                  ? "ring-2 ring-primary scale-105"
                                  : "hover:scale-105"
                              }`}
              >
                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  {plan.price ? (
                    <>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span
                          className="text-4xl sm:text-3xl font-bold text-secondary"
                          style={{ fontFamily: "var(--font-jarkata)" }}
                        >
                          {plan.price}
                        </span>
                        <span
                          className="text-lg text-gray-600"
                          style={{ fontFamily: "var(--font-jarkata)" }}
                        >
                          {plan.period}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      className="text-4xl sm:text-3xl font-bold text-secondary mb-2"
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      Enterprise Plan
                    </div>
                  )}
                  <h3
                    className="text-lg font-semibold text-secondary"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {plan.name}
                  </h3>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className="text-gray-700"
                        style={{ fontFamily: "var(--font-jarkata)" }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300
                                  ${
                                    plan.popular
                                      ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105"
                                      : "bg-primary text-white hover:bg-secondary"
                                  }`}
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  Get started
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
