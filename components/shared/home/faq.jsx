"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is Blue Sands Virtual STEM Labs?",
      answer:
        "Blue Sands Virtual STEM Labs is an online platform that provides interactive, engaging, and educational STEM experiences for students of all ages using VR Headset.",
    },
    {
      question: "How does Blue Sands Virtual STEM Labs work?",
      answer:
        "Our platform uses cutting-edge virtual reality and simulation technology to create immersive laboratory experiences. Students can conduct experiments, explore scientific concepts, and interact with 3D models in a safe, virtual environment accessible from any device with internet connectivity.",
    },
    {
      question: "Is Blue Sands Virtual STEM Labs suitable for all age groups?",
      answer:
        "Yes! Our platform offers content tailored for different educational levels, from primary school through university. Each lab experience is designed to match the curriculum standards and learning objectives appropriate for specific age groups and educational stages.",
    },
    {
      question:
        "Do I need any special equipment to use Blue Sands Virtual STEM Labs?",
      answer:
        "No special equipment is required. Our platform works on standard computers, tablets, and smartphones with a modern web browser. For an enhanced experience, VR headsets are supported but optional. We've optimized our labs to work even with low-bandwidth internet connections common across Africa.",
    },
    {
      question:
        "What STEM subjects are covered in Blue Sands Virtual STEM Labs?",
      answer:
        "We cover a comprehensive range of STEM subjects including Physics, Chemistry, Biology, Mathematics, Engineering, and Computer Science. Each subject includes multiple virtual labs aligned with African curriculum standards, with new experiments and simulations added regularly.",
    },
    {
      question: "Are the virtual labs aligned with educational standards?",
      answer:
        "Absolutely. All our virtual labs are carefully designed to align with major African educational curriculum standards including WAEC, NECO, and university-level requirements. We work closely with educators across the continent to ensure our content meets local educational needs and standards.",
    },
  ];

  const teamMembers = [
    { image: "/home/random/1.jpg", name: "Team Member 1" },
    { image: "/home/random/2.png", name: "Team Member 2" },
    { image: "/home/random/3.jpg", name: "Team Member 3" },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Frequently asked questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-gray-600"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Everything you need to know about the product and billing
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left 
                         hover:bg-gray-50 transition-colors duration-300"
              >
                <span
                  className="text-base sm:text-lg font-semibold text-secondary pr-4"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {faq.question}
                </span>

                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                            ${
                              openIndex === index
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-primary"
                            }
                            transition-all duration-300`}
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        openIndex === index ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                      }
                    />
                  </svg>
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p
                        className="text-gray-600 leading-relaxed"
                        style={{ fontFamily: "var(--font-jarkata)" }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 rounded-3xl p-8 sm:p-10 text-center"
        >
          {/* Team Avatars */}
          <div className="flex justify-center mb-6">
            <div className="flex -space-x-4">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-primary to-secondary"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-xl sm:text-2xl font-bold text-secondary mb-2"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Still have questions?
          </h3>

          {/* Description */}
          <p
            className="text-gray-600 mb-6"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </p>

          {/* CTA Button */}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary 
                     text-white font-semibold rounded-xl transition-colors duration-300"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Get in touch
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
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
