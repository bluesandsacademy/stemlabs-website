"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CoreValuesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const values = [
    {
      title: "Customers",
      content:
        "We put our customers at the heart of everything we do. Their success is our success, and we're committed to delivering exceptional value and support that helps them achieve their educational goals.",
    },
    {
      title: "Integrity",
      content:
        "We operate with transparency, honesty, and ethical practices in all our interactions. Building trust through consistent actions and keeping our commitments is fundamental to who we are.",
    },
    {
      title: "Growth",
      content:
        "We believe in continuous improvement and learning. We encourage innovation, embrace challenges, and invest in the development of our team, our products, and our impact on education.",
    },
    {
      title: "Tenacity",
      content:
        "We persevere through challenges and remain dedicated to our mission. Our determination to overcome obstacles and find solutions drives us to create lasting change in Nigerian education.",
    },
    {
      title: "People",
      content:
        "We value every individual—our team members, partners, educators, and students. We foster a collaborative, inclusive environment where diverse perspectives are celebrated and everyone can thrive.",
    },
  ];

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
            className="space-y-6"
          >
            <p className="text-sm font-medium text-white/90">Our Core Values</p>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
              Staying true to
              <br />
              our values.
            </h2>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-md pt-2">
              Culture is more than just a word to us, it's a mindset. You can
              see it in all we do.
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
