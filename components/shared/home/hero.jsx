"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { slides } from "@/lib/data";
import { BiAtom } from "react-icons/bi";

const backgroundClasses = {
  primary: "bg-[#0483e2]",
  secondary: "bg-[#02345A]",
};

// Floating Cards (memoized for performance)
const FloatingCards = memo(() => {
  return (
    <>
      {/* Top-left card */}
      <motion.div
        className="absolute top-6 left-3 sm:top-10 sm:left-8 bg-white rounded-2xl shadow-lg p-3 sm:p-4 w-48 sm:w-64 z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex -space-x-2 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden"
            >
              <Image
                src={`/hero/community/${i}.jpg`}
                alt="Student"
                fill
                className="object-cover"
                sizes="40px"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Join our community of <br />
          <span className="font-bold text-foreground">1,200+ Students</span>
        </p>
      </motion.div>

      {/* Top-right progress arc */}
      <motion.div
        className="absolute top-4 right-4 sm:top-6 sm:right-8 bg-white rounded-2xl shadow-lg p-3 sm:p-4 w-44 sm:w-56 z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex flex-col items-center pb-8">
          <div className="relative w-32 h-20 sm:w-32 sm:h-24 flex flex-col">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <path
                d="M10,50 A40,40 0 0,1 90,50"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <motion.path
                d="M10,50 A40,40 0 0,1 90,50"
                stroke="#0483e2"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={Math.PI * 80}
                initial={{ strokeDashoffset: Math.PI * 80 }}
                animate={{
                  strokeDashoffset: Math.PI * 80 * (1 - 87.6 / 100),
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute w-full flex flex-col items-center justify-center top-[48%]">
              <div className="w-3 h-3 bg-primary rounded-full my-2"></div>

              <span className="text-xs sm:text-sm font-bold text-primary">
                87.6%
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#7A869A]">
                Completion rate of our experiments
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom-left course card */}
      <motion.div
        className="absolute bottom-6 sm:bottom-12 left-4 sm:left-8 bg-white rounded-2xl shadow-lg p-4 sm:p-5 w-48 sm:w-60 z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <BiAtom className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-600">
              Total Simulations
            </p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">
              100+
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
});
FloatingCards.displayName = "FloatingCards";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Add ASEE slide as first slide
  const aseeSlide = {
    title: "ASEE 2025",
    subtitle: "Powered by Blue Sands STEM Labs",
    description:
      "A convening for teachers, school leaders, students, EdTech founders, investors, NGOs, and government education stakeholders to experience immersive VR/AR education tools, digital STEM labs, classroom AI tools, and African-aligned digital content.",
    image: "/asee/hero.jpg",
    background: "secondary",
    location: "Comfort Hall Okeira Bridge Bus Stop, off Addo Road, Ajah, Lagos",
    date: "25th November 2025",
    ctaText: "Register for Event",
    ctaLink: "/asee-2025/register",
    isAsee: true,
  };

  const allSlides = [aseeSlide, ...slides];
  const totalSlides = allSlides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => setCurrentSlide(index), []);

  const currentSlideData = allSlides[currentSlide];
  const isAseeSlide = currentSlide === 0;

  return (
    <section
      className={clsx(
        "relative overflow-hidden min-h-[600px] sm:min-h-[650px] md:min-h-[700px] flex items-center",
        backgroundClasses[currentSlideData.background]
      )}
    >
      {/* Grid Line Vector Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src="/grid.png"
          alt="Grid background pattern"
          fill
          className="object-cover opacity-80"
          priority
          quality={100}
        />
      </div>

      {/* Decorative dots pattern (only for ASEE slide) */}
      {isAseeSlide && (
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-60 hidden md:block z-[1]">
          <div className="grid grid-cols-6 gap-4 h-full items-center pr-8">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT: Text Section */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            {/* ASEE Slide Content */}
            {isAseeSlide ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key="asee-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-2"
                  >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight">
                      {currentSlideData.title}
                    </h1>
                    <p className="text-white/80 text-base sm:text-lg font-light">
                      {currentSlideData.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key="asee-headline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-3"
                  >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      Africa STEM EdTech Expo
                    </h2>

                    <p className="text-white/90 text-lg sm:text-xl font-medium">
                      {currentSlideData.location}
                    </p>

                    <p className="text-white/90 text-lg sm:text-xl font-medium">
                      {currentSlideData.date}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key="asee-desc"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                  >
                    {currentSlideData.description}
                  </motion.p>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="pt-4"
                >
                  <Link href={currentSlideData.ctaLink}>
                    <button className="bg-white text-[#02345a] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-block">
                      {currentSlideData.ctaText}
                    </button>
                  </Link>
                </motion.div>
              </>
            ) : (
              /* Regular Slide Content */
              <>
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`title-${currentSlide}`}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
                  >
                    {currentSlideData.title}
                  </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${currentSlide}`}
                    className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {currentSlideData.description}
                  </motion.p>
                </AnimatePresence>

                <div className="gap-4">
                  <Link href="https://app.bluesandstemlabs.com/auth/register">
                    <motion.button
                      className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-secondary font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              </>
            )}

            {/* Slide Indicators */}
            <div className="flex justify-center lg:justify-start items-center gap-2 pt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-10 sm:w-12 bg-white"
                      : "w-2 sm:w-3 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex justify-center items-center mt-10 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${currentSlide}`}
                className={`relative w-full ${
                  isAseeSlide
                    ? "max-w-md mx-auto lg:max-w-none h-[550px]"
                    : "max-w-[500px] md:max-w-[600px] h-[250px] sm:h-[350px] md:h-[450px]"
                } rounded-3xl overflow-hidden shadow-2xl`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={currentSlideData.image}
                  alt={isAseeSlide ? "ASEE 2025 Event" : "STEM Student"}
                  fill
                  className={isAseeSlide ? "object-contain" : "object-cover"}
                  priority={currentSlide === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating cards visible only on desktop for non-ASEE slides */}
            <div className="hidden md:block">
              {currentSlide === 1 && <FloatingCards />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
