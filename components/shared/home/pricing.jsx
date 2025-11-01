"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PricingSection = () => {
  const [currency, setCurrency] = useState("naira"); // 'dollar' or 'naira' - default to naira
  const [exchangeRate, setExchangeRate] = useState(1600); // Default NGN to USD rate

  // Fetch live exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/892a9ad526f14e1e8f7652e0/latest/USD"
        );
        const data = await response.json();

        // v6 API uses 'conversion_rates' instead of 'rates'
        if (data.conversion_rates && data.conversion_rates.NGN) {
          setExchangeRate(data.conversion_rates.NGN);
          console.log("Exchange rate fetched:", data.conversion_rates.NGN);
        } else if (data.rates && data.rates.NGN) {
          // Fallback for other API versions
          setExchangeRate(data.rates.NGN);
          console.log("Exchange rate fetched:", data.rates.NGN);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        // Keep default rate if fetch fails
      }
    };

    fetchExchangeRate();
  }, []);

  const plans = [
    {
      name: "Basic Plan",
      badge: "Best for Individuals",
      tagline:
        "Perfect for individual learners and students exploring science on their own.",
      priceUSD: 5,
      priceNGN: 5000,
      period: "/Term",
      features: [
        "Access to core Physics, Chemistry, and Biology simulations",
        "Graded assignments, tracking & quizzes",
        "Learn on PC & tablet, offline-ready modules",
        "Email support",
      ],
      buttonText: "Get started",
      buttonStyle: "primary",
      popular: false,
    },
    {
      name: "School Plan",
      badge: "Most Popular!",
      tagline:
        "Empower your whole school with immersive practical science and powerful lessons.",
      priceUSD: 50,
      priceNGN: 50000,
      period: "/Term",
      features: [
        "Multi-user school license (admins, teachers, students)",
        "Teacher dashboard, performance analytics & exports",
        "Auto-graded quizzes, rubrics & reports (CSV/PDF)",
        "Offline Lab Packages & Sync for low connectivity",
        "Priority onboarding & support",
      ],
      buttonText: "Subscribe",
      buttonStyle: "white",
      popular: true,
    },
    {
      name: "Enterprise Plan",
      badge: "Custom Deployment",
      tagline:
        "For multi-campus institutions, ministries, and education networks that need scale and flexibility.",
      priceUSD: null,
      priceNGN: null,
      period: null,
      features: [
        "Scalable deployment across campuses & geographies",
        "Integration with LMS/SSO, data pipelines & SLAs",
        "Advanced analytics & custom dashboards",
        "Curriculum mapping & localization",
        "Dedicated technical account manager",
      ],
      buttonText: "Contact Sales",
      buttonStyle: "primary",
      popular: false,
    },
  ];

  const formatPrice = (usdPrice, ngnPrice) => {
    if (usdPrice === null) return "Custom";

    if (currency === "dollar") {
      return `$${usdPrice}`;
    } else {
      // Use live exchange rate to convert USD to NGN
      const convertedPrice = Math.round(usdPrice * exchangeRate);
      return `₦${convertedPrice.toLocaleString()}`;
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold text-primary uppercase tracking-wider mb-3"
          >
            Pricing
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4"
          >
            Choose Your Plan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 mb-8"
          >
            Flexible pricing designed for African educational budgets
          </motion.p>

          {/* Currency Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <span
              className={`text-sm font-semibold transition-colors ${
                currency === "dollar" ? "text-secondary" : "text-gray-400"
              }`}
            >
              Dollar
            </span>
            <button
              onClick={() =>
                setCurrency(currency === "dollar" ? "naira" : "dollar")
              }
              className="relative w-14 h-7 bg-primary rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  currency === "naira" ? "translate-x-7" : ""
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold transition-colors ${
                currency === "naira" ? "text-secondary" : "text-gray-400"
              }`}
            >
              Naira
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6 mt-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative overflow-hidden"
            >
              <div
                className={`h-full p-8 transition-all overflow-hidden duration-300 ${
                  plan.popular
                    ? "bg-primary text-white shadow-xl scale-105"
                    : "bg-white text-secondary shadow-lg hover:shadow-xl"
                }`}
              >
                {/* Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
                      plan.popular
                        ? "bg-white/20 text-white"
                        : "bg-primary text-white"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                {/* Tagline */}
                <p
                  className={`text-sm mb-6 ${
                    plan.popular ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {plan.tagline}
                </p>

                {/* Price */}
                <div className="mb-8">
                  {plan.priceUSD !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">
                        {formatPrice(plan.priceUSD, plan.priceNGN)}
                      </span>
                      <span
                        className={`text-lg ${
                          plan.popular ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {plan.period}
                      </span>
                    </div>
                  ) : (
                    <span className="text-5xl font-bold">Custom</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 bg-primary/10 rounded-full ${
                          plan.popular ? "text-white" : "text-primary"
                        }`}
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
                        className={`text-sm ${
                          plan.popular ? "text-white/90" : "text-gray-700"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                    plan.buttonStyle === "white"
                      ? "bg-white text-primary hover:bg-secondary hover:text-white"
                      : plan.popular
                      ? "bg-white text-primary hover:bg-gray-50"
                      : "bg-primary text-white hover:bg-secondary"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Most Popular Arrow (only for middle card) */}
              {plan.popular && (
                <div className="absolute top-2  -right-6 bg-white text-primary text-xs font-semibold px-10 py-2 shadow-md transform rotate-[30deg] text-center">
                  <p className="relative pl-10">Most Popular</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
