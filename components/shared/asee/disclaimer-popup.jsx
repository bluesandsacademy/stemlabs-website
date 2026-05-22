"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AseeDisclaimerPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("asee-disclaimer-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("asee-disclaimer-dismissed", "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-6 z-[1000] mx-auto max-w-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-8"
          >
            <div className="relative rounded-2xl bg-[#02345a] border border-white/10 shadow-2xl overflow-hidden">
              {/* Top accent line */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#f0a500] via-[#f0c040] to-[#f0a500]" />

              <div className="px-6 py-5 sm:px-7 sm:py-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0a500]/15 text-[#f0a500]">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-white/90 uppercase">
                      Important Notice
                    </span>
                  </div>

                  <button
                    onClick={dismiss}
                    aria-label="Dismiss notice"
                    className="mt-0.5 flex-shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <p className="text-sm leading-relaxed text-white/70">
                  All programme elements, speakers, benefits, audiences, venues
                  and dates are{" "}
                  <span className="text-white/90 font-medium">
                    indicative only
                  </span>{" "}
                  and subject to final confirmation, contracting, availability
                  and receipt of payment. Terms and conditions apply.
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xs text-white/30">ASEE 2025</span>
                  <button
                    onClick={dismiss}
                    className="rounded-lg bg-[#f0a500] px-5 py-2 text-xs font-semibold text-[#02345a] transition-opacity hover:opacity-90 active:opacity-80"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
