"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { BiAtom } from "react-icons/bi";
import { img } from "@/lib/cloudinary";

// ─── Module-level constants ────────────────────────────────────────────────────
const REGISTER_URL = "https://app.bluesandstemlabs.com/auth/register";
const SLIDE_INTERVAL = 6000;
const TOTAL_SLIDES = 3;

const ARC_LENGTH = Math.PI * 80;
const COMPLETION_RATE = 87.6;
const ARC_FINAL_OFFSET = ARC_LENGTH * (1 - COMPLETION_RATE / 100);

const DOTS_36 = Array.from({ length: 36 });
const DOTS_30 = Array.from({ length: 30 });

// ─── CSS animation helpers ─────────────────────────────────────────────────────
// --ease-spring-out is defined in globals.css.
// Chrome/Firefox get a true spring via linear(); Safari gets expo-out cubic-bezier.
const SPRING_OUT = "var(--ease-spring-out)";
const EXPO_IN    = "cubic-bezier(0.7, 0, 0.84, 0)";

// Text / CTA — clip-path wipe from left (reading direction)
// fill-mode:both holds the `from` state before delay fires (no flash)
const aLeft = (rm, delay = 0) =>
  rm ? {} : { animation: `hero-enter-left 0.82s ${SPRING_OUT} ${delay}s both` };

// Image containers — translateX + scale sweep from the right
const aRight = (rm, delay = 0.04) =>
  rm ? {} : { animation: `hero-enter-right 1.0s ${SPRING_OUT} ${delay}s both` };

// Floating cards — diagonal corner entries + continuous idle bob chained together.
// Bob delay = enter_delay + enter_duration (0.75s) so bobbing starts only after
// the card has fully settled. Periods 3.5/3.8/4.2s prevent synchronisation.
// Fix #7: stagger tightened from 130ms → 80ms spacing (0.45 / 0.53 / 0.61s).
const aNW = (rm, delay = 0.45) =>
  rm ? {} : {
    animation: [
      `hero-enter-nw 0.75s ${SPRING_OUT} ${delay}s both`,
      `hero-card-bob 3.8s ease-in-out ${delay + 0.75}s infinite`,
    ].join(", "),
  };
const aNE = (rm, delay = 0.53) =>
  rm ? {} : {
    animation: [
      `hero-enter-ne 0.75s ${SPRING_OUT} ${delay}s both`,
      `hero-card-bob 4.2s ease-in-out ${delay + 0.75}s infinite`,
    ].join(", "),
  };
const aSW = (rm, delay = 0.61) =>
  rm ? {} : {
    animation: [
      `hero-enter-sw 0.75s ${SPRING_OUT} ${delay}s both`,
      `hero-card-bob 3.5s ease-in-out ${delay + 0.75}s infinite`,
    ].join(", "),
  };

// Ken Burns idle — pan+zoom on the inner image wrapper, clipped by parent overflow:hidden.
// Starts after the container's enter animation finishes (enter delay 0.04s + duration 1.0s).
// `alternate` makes it breathe back and forth over 14s cycles.
const aKenBurns = (rm, delay = 1.04) =>
  rm ? {} : {
    animation: `hero-ken-burns 14s ease-in-out ${delay}s infinite alternate`,
  };

// Framer Motion easing array — used only for the SVG arc path animation
const FM_EXPO_OUT = [0.16, 1, 0.3, 1];

// Motion-enhanced <Link> — for hover/tap micro-interactions only
const MotionLink = motion(Link);

// ─── FloatingCards ────────────────────────────────────────────────────────────
const FloatingCards = memo(({ shouldReduceMotion }) => (
  <>
    {/* Top-left: community count — enters from NW corner */}
    <div
      className="absolute top-6 left-3 sm:top-10 sm:left-8 bg-white rounded-2xl shadow-lg p-3 sm:p-4 w-48 sm:w-64 z-10"
      style={aNW(shouldReduceMotion)}
    >
      <div className="flex -space-x-2 mb-2" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden"
          >
            <Image
              src={img(`/hero/community/${i}.jpg`)}
              alt=""
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
    </div>

    {/* Top-right: completion rate arc — enters from NE corner */}
    <div
      className="absolute top-4 right-4 sm:top-6 sm:right-8 bg-white rounded-2xl shadow-lg p-3 sm:p-4 w-36 sm:w-44 z-10"
      style={aNE(shouldReduceMotion)}
    >
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-28 h-16 sm:w-32 sm:h-20">
          <svg viewBox="0 0 100 60" className="w-full h-full" aria-hidden="true">
            <path d="M10,50 A40,40 0 0,1 90,50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            {/* motion.path — sole remaining Framer Motion usage; SVG stroke cannot be
                animated purely in CSS without JS-computed dashoffset values */}
            <motion.path
              d="M10,50 A40,40 0 0,1 90,50"
              stroke="#0483e2"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={ARC_LENGTH}
              initial={{ strokeDashoffset: ARC_LENGTH }}
              animate={{ strokeDashoffset: ARC_FINAL_OFFSET }}
              transition={{
                duration: shouldReduceMotion ? 0 : 2.2,
                ease: FM_EXPO_OUT,
                delay: shouldReduceMotion ? 0 : 0.65,
              }}
            />
          </svg>
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-1"
            aria-hidden="true"
          >
            <div className="w-2.5 h-2.5 bg-primary rounded-full mb-0.5" />
            <span className="text-sm font-bold text-primary leading-none">87.6%</span>
          </div>
        </div>
        <p className="text-[10px] font-semibold text-[#7A869A] text-center leading-tight">
          Completion rate of our experiments
        </p>
      </div>
    </div>

    {/* Bottom-left: simulations count — enters from SW corner */}
    <div
      className="absolute bottom-6 sm:bottom-12 left-4 sm:left-8 bg-white rounded-2xl shadow-lg p-4 sm:p-5 w-48 sm:w-60 z-10"
      style={aSW(shouldReduceMotion)}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center"
          aria-hidden="true"
        >
          <BiAtom className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-600">Total Simulations</p>
          <p className="text-lg sm:text-2xl font-bold text-foreground">100+</p>
        </div>
      </div>
    </div>
  </>
));
FloatingCards.displayName = "FloatingCards";

// ─── Shared CTA ───────────────────────────────────────────────────────────────
const SlideButton = ({ shouldReduceMotion, children }) => (
  <MotionLink
    href={REGISTER_URL}
    className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-white text-secondary font-bold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
    whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
    whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
  >
    {children}
  </MotionLink>
);

// ─── Slide 1 ───────────────────────────────────────────────────────────────────
// No Ken Burns here — image uses object-contain so panning would reveal
// transparent gaps around the subject. Will-change still applied during transitions.
const Slide1 = ({ shouldReduceMotion, isTransitioning }) => (
  <>
    <div className="space-y-5 md:space-y-6 text-center lg:text-left">
      <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
        style={aLeft(shouldReduceMotion, 0)}
      >
        Empowering Africa&apos;s Next Generation of STEM Innovators
      </h1>

      <p
        className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
        style={aLeft(shouldReduceMotion, 0.1)}
      >
        Bridging the digital divide with world-class virtual laboratory
        experiences. From Lagos to Cape Town, unlock limitless potential in
        Science, Technology, Engineering, and Mathematics.
      </p>

      <div style={aLeft(shouldReduceMotion, 0.2)}>
        <SlideButton shouldReduceMotion={shouldReduceMotion}>Sign Up</SlideButton>
      </div>
    </div>

    <div className="relative w-full mt-6 lg:mt-0">
      <div className="relative w-full aspect-4/5 sm:aspect-3/4 lg:aspect-5/4 max-h-[70vh] flex justify-center items-center">
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{
            ...aRight(shouldReduceMotion),
            willChange: isTransitioning && !shouldReduceMotion ? "transform, opacity" : "auto",
          }}
        >
          <Image
            src={img("/hero/1.jpg")}
            alt="STEM student engaging with a virtual laboratory experiment"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 80vw, 50vw"
            className="object-contain rounded-2xl"
            priority
          />
        </div>
        <FloatingCards shouldReduceMotion={shouldReduceMotion} />
      </div>
    </div>
  </>
);

// ─── Slide 2 ───────────────────────────────────────────────────────────────────
// Ken Burns applied to inner wrapper so the pan is clipped by the rounded container.
const Slide2 = ({ shouldReduceMotion, isTransitioning }) => (
  <>
    <div className="space-y-5 md:space-y-6 text-center lg:text-left">
      <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
        style={aLeft(shouldReduceMotion, 0)}
      >
        Virtual &amp; Augmented Reality in STEM Education for Secondary &amp;
        Tertiary Schools.
      </h1>

      <p
        className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
        style={aLeft(shouldReduceMotion, 0.1)}
      >
        Virtual Science Labs offers students engaging STEM courses accessible on
        tablet or PC anywhere, anytime.
      </p>

      <div style={aLeft(shouldReduceMotion, 0.2)}>
        <SlideButton shouldReduceMotion={shouldReduceMotion}>Sign Up Now</SlideButton>
      </div>
    </div>

    <div className="relative w-full mt-6 lg:mt-0 flex justify-center lg:justify-end">
      {/* Dot grid — purely decorative */}
      <div
        className="hidden lg:grid grid-cols-6 gap-2 absolute top-6 left-0 z-0"
        aria-hidden="true"
      >
        {DOTS_36.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
        ))}
      </div>

      {/* lg:pb-5 lg:pr-5 reserves space for the decorative frame on desktop only */}
      <div className="relative lg:ml-8 lg:pb-5 lg:pr-5">
        <div
          className="relative rounded-2xl overflow-hidden h-[45vh] sm:h-[60vh] lg:h-[72vh] max-h-[560px] aspect-3/4"
          style={{
            zIndex: 2,
            ...aRight(shouldReduceMotion),
            willChange: isTransitioning && !shouldReduceMotion ? "transform, opacity" : "auto",
          }}
        >
          {/* Ken Burns inner wrapper — scales/pans within overflow:hidden boundary */}
          <div className="absolute inset-0" style={aKenBurns(shouldReduceMotion)}>
            <Image
              src={img("/hero/3.jpg")}
              alt="Student in a virtual science lab wearing safety goggles"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 80vw, 50vw"
            />
          </div>
        </div>
        {/* Decorative offset border — desktop only */}
        <div
          className="hidden lg:block absolute border-4 rounded-2xl border-white/70"
          style={{ zIndex: 1, top: 20, left: 20, right: 0, bottom: 0 }}
          aria-hidden="true"
        />
      </div>
    </div>
  </>
);

// ─── Slide 3 ───────────────────────────────────────────────────────────────────
// Ken Burns inside the blob container — the pan is clipped to the organic shape.
const Slide3 = ({ shouldReduceMotion, isTransitioning }) => (
  <>
    <div className="space-y-5 md:space-y-6 text-center lg:text-left">
      <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
        style={aLeft(shouldReduceMotion, 0)}
      >
        Unlock Potential in Your Classroom
      </h1>

      <p
        className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
        style={aLeft(shouldReduceMotion, 0.1)}
      >
        Transform your classroom with Blue Sands STEM Labs. Our virtual labs use
        VR and AR to give students practical, hands-on science experience,
        preparing them for a future in innovation.
      </p>

      <div style={aLeft(shouldReduceMotion, 0.2)}>
        <SlideButton shouldReduceMotion={shouldReduceMotion}>Sign Up Now</SlideButton>
      </div>
    </div>

    <div className="relative w-full mt-6 lg:mt-0 flex justify-center items-center">
      {/* Dot grid — right side, purely decorative */}
      <div
        className="hidden lg:grid grid-cols-5 gap-1.5 absolute right-0 top-1/2 -translate-y-1/2 z-0"
        aria-hidden="true"
      >
        {DOTS_30.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
        ))}
      </div>

      {/* Organic blob-shaped image container */}
      <div
        className="relative overflow-hidden w-full max-w-[560px]"
        style={{
          zIndex: 2,
          height: "min(78vh, 520px)",
          aspectRatio: "5 / 4",
          borderRadius: "42% 58% 65% 35% / 45% 40% 60% 55%",
          ...aRight(shouldReduceMotion),
          willChange: isTransitioning && !shouldReduceMotion ? "transform, opacity" : "auto",
        }}
      >
        {/* Ken Burns inner wrapper — pan is clipped to the blob boundary */}
        <div className="absolute inset-0" style={aKenBurns(shouldReduceMotion)}>
          <Image
            src={img("/hero/2.png")}
            alt="Students collaborating on a laptop using virtual STEM labs in a classroom"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 80vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  </>
);

// ─── Slide registry ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    Component: Slide1,
    label: "Empowering Africa's Next Generation of STEM Innovators",
  },
  {
    Component: Slide2,
    label: "Virtual & Augmented Reality in STEM Education",
  },
  {
    Component: Slide3,
    label: "Unlock Potential in Your Classroom",
  },
];

// ─── HeroSlider ───────────────────────────────────────────────────────────────
const HeroSlider = () => {
  // `activeSlide`     — slide shown in DOM (updates after exit animation)
  // `navSlide`        — slide reflected in nav dots (updates immediately)
  // `isExiting`       — drives the CSS exit animation on the wrapper
  // `isTransitioning` — gates will-change on image containers for the full
  //                     exit+enter window (280ms exit + 1100ms enter)
  const [activeSlide,     setActiveSlide]     = useState(0);
  const [navSlide,        setNavSlide]        = useState(0);
  const [isExiting,       setIsExiting]       = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeRef    = useRef(0);
  const exitingRef   = useRef(false);
  // 1 = forward (exit left), -1 = backward (exit right)
  const directionRef = useRef(1);

  const prefersReducedMotion = useReducedMotion();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    setShouldReduceMotion(!!prefersReducedMotion);
  }, [prefersReducedMotion]);

  // ── Transition orchestrator ──────────────────────────────────────────────────
  const go = useCallback(
    (next, explicitDir = null) => {
      if (exitingRef.current) return;
      exitingRef.current = true;

      directionRef.current = explicitDir ?? (next > activeRef.current ? 1 : -1);
      setNavSlide(next);

      if (shouldReduceMotion) {
        activeRef.current = next;
        setActiveSlide(next);
        exitingRef.current = false;
        return;
      }

      setIsExiting(true);
      setIsTransitioning(true);

      setTimeout(() => {
        activeRef.current = next;
        setActiveSlide(next);   // key change → remount → enter animations fire
        setIsExiting(false);
        // Allow next transition once enter animation is well underway
        setTimeout(() => { exitingRef.current = false; }, 120);
        // Remove will-change after the longest enter animation completes (~1.0s)
        setTimeout(() => { setIsTransitioning(false); }, 1100);
      }, 280);
    },
    [shouldReduceMotion],
  );

  // ── Auto-advance — always forward (direction 1) ──────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      go((activeRef.current + 1) % TOTAL_SLIDES, 1);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [go]);

  const { Component: ActiveSlide } = SLIDES[activeSlide];
  const bgClass = navSlide === 1 ? "bg-[#02345A]" : "bg-[#0483e2]";

  const exitName  = directionRef.current === 1 ? "hero-exit-left" : "hero-exit-right";
  const exitStyle = isExiting
    ? { animation: `${exitName} 0.28s ${EXPO_IN} forwards` }
    : {};

  return (
    <section
      aria-label="Hero"
      aria-roledescription="carousel"
      className={clsx(
        "relative overflow-x-hidden min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] flex items-center transition-colors duration-700",
        bgClass,
      )}
    >
      {/* Screen-reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {SLIDES[navSlide].label}
      </div>

      {/* Decorative grid background */}
      <div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        aria-hidden="true"
      >
        <Image
          src={img("/grid.png")}
          alt=""
          fill
          className="object-cover opacity-90"
          loading="lazy"
        />
      </div>

      <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 sm:pt-20 sm:pb-14 lg:py-14 relative z-10">
        {/* Exit-animation wrapper — stays mounted during exit so the keyframe plays.
            The inner div re-keys on activeSlide to trigger fresh enter animations. */}
        <div style={exitStyle}>
          <div
            key={activeSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={SLIDES[activeSlide].label}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <ActiveSlide
              shouldReduceMotion={shouldReduceMotion}
              isTransitioning={isTransitioning}
            />
          </div>
        </div>

        {/* Slide navigation dots */}
        <nav
          className="flex justify-center lg:justify-start gap-2 mt-8"
          aria-label="Slide navigation"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}: ${slide.label}`}
              aria-current={navSlide === i ? "true" : undefined}
              onClick={() => go(i)}
              className={clsx(
                "h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
                navSlide === i
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </nav>
      </div>
    </section>
  );
};

export default HeroSlider;
