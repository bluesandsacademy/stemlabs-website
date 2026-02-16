"use client";

import { PopupButton } from "react-calendly";
import { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendlyButton({ buttonText = "Book a Demo" }) {
  const [rootElement, setRootElement] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const root = document.getElementById("__next") || document.body;
    setRootElement(root);
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleEventScheduled = () => {
    setShowSuccess(true);
  };

  // Don't render until mounted on client
  if (!isMounted || !rootElement) {
    return (
      <button
        disabled
        className="bg-white text-primary px-10 py-4 rounded-xl font-semibold text-lg shadow-xl opacity-50 cursor-not-allowed"
        style={{ fontFamily: "var(--font-jarkata)" }}
      >
        {buttonText}
      </button>
    );
  }

  return (
    <>
      <PopupButton
        url="https://calendly.com/admin-bluesandstemlabs/30min"
        rootElement={rootElement}
        text={buttonText}
        className="bg-white text-primary px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
        styles={{
          fontFamily: "var(--font-jarkata)",
        }}
        onEventScheduled={handleEventScheduled}
      />

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowSuccess(false)}
            />

            {/* Success Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="text-center space-y-4">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                </motion.div>

                {/* Text */}
                <div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    Demo Booked Successfully!
                  </h3>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    We'll send you a confirmation email shortly.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
