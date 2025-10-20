"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { PiBookOpenTextFill } from "react-icons/pi";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";

// Move slides data outside to prevent recreation
const slides = [
  {
    title: "Empowering Africa's Next Generation of STEM Innovators",
    description:
      "Bridging the digital divide with world-class virtual laboratory experiences. From Lagos to Cape Town, unlock limitless potential in Science, Technology, Engineering, and Mathematics.",
    image: "/hero/1.jpg",
    background: "primary",
    cta1Text: "Watch Video",
    link1: "/video",
    cta2Text: "Get Pricing",
    link2: "/pricing",
  },
  {
    title:
      "Virtual & Augmented Reality in STEM Education for Secondary & Tertiary Schools.",
    description:
      "Virtual & Augmented Reality in STEM Education for Secondary & Tertiary Schools.",
    image: "/hero/1.jpg",
    background: "secondary",
    cta1Text: "Sign Up",
    link1: "/sign-up",
    cta2Text: "Get Pricing",
    link2: "/pricing",
  },
  {
    title: "Unlock Potential in Your Classroom",
    description:
      "Transform your classroom with Blue Sands STEM Labs. Our virtual labs use VR and AR to give students practical, hands-on science experience, preparing them for a future in innovation.",
    image: "/hero/2.jpg",
    background: "primary",
    cta1Text: "Try a free demo",
    link1: "/demo",
    cta2Text: "See Pricing",
    link2: "/pricing",
  },
];

const backgroundClasses = {
  primary: "bg-[#0483e2]",
  secondary: "bg-[#02345A]",
};

// Memoize floating cards to prevent re-renders
const FloatingCards = memo(() => {
  return (
    <>
      <motion.div
        className="absolute top-8 left-0 bg-white rounded-2xl shadow-xl p-4 w-64 z-10"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="relative w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden"
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
        </div>
        <p
          className="text-sm text-gray-600"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Join our community of <br />
          <span className="font-bold text-foreground">1,200+ Students</span>
        </p>
      </motion.div>

      <motion.div
        className="absolute top-4 right-8 bg-white rounded-2xl shadow-xl p-4 w-56 z-10"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="flex items-start justify-center gap-4">
          <div className="relative w-32 h-24">
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
                transition={{
                  duration: 2,
                  delay: 0.5,
                  ease: "easeOut",
                }}
              />
              <circle cx="50" cy="50" r="5" fill="#0483e2" />
            </svg>
            <div className="absolute w-full flex justify-center top-[78%]">
              <span
                className="text-sm font-bold text-primary"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                87.6%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-8 bg-white rounded-2xl shadow-xl p-5 w-60 z-10"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <PiBookOpenTextFill className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p
              className="text-xs text-gray-600"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Total number of courses
            </p>
            <p
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
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
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  return (
    <section
      className={clsx(
        "relative overflow-hidden min-h-[600px] lg:min-h-max",
        backgroundClasses[slides[currentSlide].background]
      )}
    >
      {/* Grid Background - optimized with will-change */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            willChange: "opacity",
          }}
        />
      </div>

      <div className="max-w-8xl mx-auto px-10 py-16 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-jarkata)" }}
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
                className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl"
                style={{ fontFamily: "var(--font-jarkata)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.6,
                  delay: 0.2,
                }}
              >
                {slides[currentSlide].description}
              </motion.p>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={slides[currentSlide].link1}>
                <motion.button
                  className="px-8 py-4 bg-secondary text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                >
                  <FaPlay className="w-4 h-4" />
                  {slides[currentSlide].cta1Text}
                </motion.button>
              </Link>
              <Link href={slides[currentSlide].link2}>
                <motion.button
                  className="px-8 py-4 bg-white text-primary font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                >
                  {slides[currentSlide].cta2Text}
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-4">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-12 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${currentSlide}`}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[500px] h-[450px] rounded-3xl overflow-hidden shadow-2xl"
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
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                />
              </motion.div>
            </AnimatePresence>

            {currentSlide === 0 && <FloatingCards />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
