"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-[#0370c7] py-16 sm:py-20 lg:py-24">
      {/* Diagonal stripe overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 60px,
            rgba(255,255,255,0.05) 60px,
            rgba(255,255,255,0.05) 120px
          )`,
        }}
      />

      {/* Dot accent – top left */}
      <div className="absolute top-8 left-8 lg:top-12 lg:left-16 opacity-20 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={10 + col * 20}
                cy={10 + row * 20}
                r="3"
                fill="white"
              />
            )),
          )}
        </svg>
      </div>

      {/* Dot accent – bottom right */}
      <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-16 opacity-20 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={10 + col * 20}
                cy={10 + row * 20}
                r="3"
                fill="white"
              />
            )),
          )}
        </svg>
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Ready To Transform Your Classroom?
          </h2>

          <p
            className="text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Join Nigeria&apos;s immersive STEM education movement. Early access
            slots are filling fast.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="https://calendly.com/REPLACE_WITH_YOUR_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl text-base w-full sm:w-auto text-center"
          >
            Request a Demo
          </a>
          <Link
            href="/products/k12-ar-pedia/preorder"
            className="px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10 text-base w-full sm:w-auto text-center"
          >
            Preorder Now
          </Link>
          <Link
            href="/products/k12-ar-pedia/apply"
            className="px-8 py-4 bg-transparent text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/40 text-base w-full sm:w-auto text-center"
          >
            Become a Partner
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
