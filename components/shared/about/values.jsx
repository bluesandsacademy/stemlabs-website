"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { values } from "@/lib/data";

const CoreValuesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 sm:py-24 lg:py-10 px-4 sm:px-6 lg:px-8 bg-primary overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0370c4] opacity-90" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Header (Fixed Content) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center sm:items-start lg:items-start space-y-5 sm:space-y-6"
          >
            <p className="text-sm font-medium text-white/90 uppercase tracking-wider">
              Our Core Values
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold pr-8 text-white leading-tight">
              Staying true to
              <br className="hidden sm:inline" /> our values.
            </h2>

            <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-md">
              Culture is more than just a word to us, it&apos;s a mindset. You
              can see it in all we do.
            </p>
          </motion.div>

          {/* Right Column - Simple Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="border-b border-white/20 last:border-b-0"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-5 flex items-center justify-between text-left group"
                >
                  <span className="text-lg sm:text-xl font-semibold text-white">
                    {value.title}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/90" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-8">
                        <p className="text-white/85 leading-relaxed">
                          {value.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
