"use client";

import { useState, useEffect } from "react";

export default function Loading() {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearInterval(dotInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-60" />

      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo container with animation */}
        <div className="relative">
          {/* Spinning ring */}
          <div
            className="absolute -inset-8 rounded-full border-2 border-primary/20 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute -inset-6 rounded-full border-2 border-secondary/10 animate-spin"
            style={{ animationDuration: "4s", animationDirection: "reverse" }}
          />

          {/* Actual logo */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Blue Stem Labs"
              className="w-full h-full object-contain animate-pulse drop-shadow-2xl"
              style={{ animationDuration: "2s" }}
            />
          </div>

          {/* Glow effect */}
          <div
            className="absolute inset-0 bg-primary/10 blur-2xl animate-pulse"
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Brand name */}
        <div className="text-center space-y-2">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse"
            style={{
              fontFamily: "var(--font-jarkata)",
              backgroundSize: "200% auto",
              animation: "gradient 3s ease infinite",
            }}
          >
            BLUE STEM LABS
          </h1>
          <p
            className="text-secondary/60 font-medium tracking-wide"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Loading{dots}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>

        {/* Percentage */}
        <div
          className="text-primary/40 text-sm font-semibold tabular-nums"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          {Math.round(Math.min(progress, 100))}%
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
