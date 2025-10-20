"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const STEMChallengesSection = () => {
  const [activeChallenge, setActiveChallenge] = useState(0);

  const challenges = [
    {
      title: "Infrastructure Gaps",
      description:
        "Many African universities struggle with outdated or non-existent laboratory facilities. Blue Sands provides state-of-the-art virtual labs accessible from any device.",
    },
    {
      title: "Brain Drain Prevention",
      description:
        "Keep top talent in Africa by providing world-class educational tools that rival international institutions.",
    },
    {
      title: "Rural Student Access",
      description:
        "Bridge the urban-rural divide with mobile-optimized virtual labs that work on low-bandwidth connections.",
    },
    {
      title: "Curriculum Localization",
      description:
        "Content tailored to African contexts with locally relevant examples and case studies.",
    },
    {
      title: "Large Class Sizes",
      description:
        "Scale quality education to thousands of students without compromising on hands-on learning.",
    },
    {
      title: "Maintenance-Free",
      description:
        "No expensive equipment maintenance, chemical supplies, or laboratory upkeep needed.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary via-[#024570] to-secondary relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#0483e2 1px, transparent 1px), linear-gradient(90deg, #0483e2 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-12 sm:mb-16 "
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Solving Real African STEM Challenges
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[38%] sm:w-[40%] z-10">
              <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[9/19] bg-gradient-to-br from-cyan-400 to-blue-500 relative">
                  <Image
                    src="/home/challenges/1.jpg"
                    alt="Student using mobile app"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 38vw, 20vw"
                  />
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] sm:w-[40%] z-20">
              <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="aspect-[9/19] bg-gradient-to-br from-green-400 to-emerald-600 relative">
                  <Image
                    src="/home/challenges/2.jpg"
                    alt="Student with VR headset"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 38vw, 20vw"
                  />
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[38%] sm:w-[40%] z-10">
              <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[9/19] bg-gradient-to-br from-purple-400 to-pink-500 relative">
                  <Image
                    src="/home/challenges/3.jpg"
                    alt="Student in lab"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 38vw, 20vw"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/20" />

            <motion.div
              className="absolute left-0 w-[2px] bg-primary"
              initial={false}
              animate={{
                top: `${(activeChallenge / challenges.length) * 100}%`,
                height: `${100 / challenges.length}%`,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            <div className="space-y-0">
              {challenges.map((challenge, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveChallenge(index)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`w-full text-left relative pl-8 transition-all duration-300 ${
                    activeChallenge === index
                      ? "bg-primary/90 backdrop-blur-sm rounded-2xl py-6 pr-6 sm:py-8 sm:pr-8"
                      : "py-5 pr-4 hover:bg-white/5"
                  }`}
                >
                  {/* Dot on the line */}
                  <div
                    className={`absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                      activeChallenge === index
                        ? "bg-primary scale-150"
                        : "bg-white/40"
                    }`}
                  />

                  <div>
                    <h3
                      className={`text-lg sm:text-xl lg:text-2xl font-bold text-white transition-all duration-300 ${
                        activeChallenge === index ? "mb-3" : ""
                      }`}
                      style={{ fontFamily: "var(--font-jarkata)" }}
                    >
                      {challenge.title}
                    </h3>

                    {/* Animated Description */}
                    <AnimatePresence>
                      {activeChallenge === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p
                            className="text-sm sm:text-base text-white/90 leading-relaxed"
                            style={{ fontFamily: "var(--font-jarkata)" }}
                          >
                            {challenge.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default STEMChallengesSection;
