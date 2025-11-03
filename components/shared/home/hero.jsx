"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { PiBookOpenTextFill } from "react-icons/pi";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { slides } from "@/lib/data";

// Slide data

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
        <div className="flex justify-center">
          <div className="relative w-28 h-20 sm:w-32 sm:h-24">
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
            <div className="absolute w-full flex justify-center top-[78%]">
              <span className="text-xs sm:text-sm font-bold text-primary">
                87.6%
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
            <PiBookOpenTextFill className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-600">
              Total number of courses
            </p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">
              100,000+
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
  const totalSlides = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => setCurrentSlide(index), []);

  return (
    <section
      className={clsx(
        "relative overflow-hidden min-h-[600px] sm:min-h-[650px] md:min-h-[700px] flex items-center",
        backgroundClasses[slides[currentSlide].background]
      )}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT: Text Section */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
              >
                {slides[currentSlide].title}
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
                {slides[currentSlide].description}
              </motion.p>
            </AnimatePresence>

            <div className=" gap-4">
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
                className="relative w-full max-w-[500px] md:max-w-[600px] h-[250px] sm:h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={slides[currentSlide].image}
                  alt="STEM Student"
                  fill
                  className="object-cover"
                  priority={currentSlide === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating cards visible only on desktop */}
            <div className="hidden md:block">
              {currentSlide === 0 && <FloatingCards />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
