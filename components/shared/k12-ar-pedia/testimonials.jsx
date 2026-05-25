"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    text: "Students became instantly more engaged during science lessons. The level of curiosity AR Pedia sparked was something we had never seen before.",
    author: "Mrs. Adaeze Okonkwo",
    role: "School Administrator",
    org: "Greenfield Primary School, Lagos",
    initials: "AO",
    bg: "bg-primary",
    stars: 5,
  },
  {
    text: "This is one of the most exciting STEM tools we have ever introduced. The children genuinely look forward to science class now — that is rare.",
    author: "Mr. Chukwuemeka Eze",
    role: "Primary 5 Science Teacher",
    org: "Sunrise STEM Academy, Abuja",
    initials: "CE",
    bg: "bg-secondary",
    stars: 5,
  },
  {
    text: "Parents immediately noticed the difference in their children's enthusiasm and ability to explain what they were learning. That speaks volumes.",
    author: "Mrs. Funke Adeyemi",
    role: "School Director",
    org: "Bright Futures Learning Center, Rivers",
    initials: "FA",
    bg: "bg-[#0D3B5C]",
    stars: 5,
  },
];

function Stars({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative bg-gray-50 py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            What Educators Are Saying
          </h2>
          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <Stars count={5} />
            <span className="text-gray-700 font-semibold text-sm">5.0</span>
            <span className="text-gray-400 text-sm">· Based on early access feedback</span>
          </div>
        </motion.div>

        {/* Quote cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {quotes.map(({ text, author, role, org, initials, bg, stars }, i) => (
            <motion.div
              key={author}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/15 transition-all duration-300 flex flex-col"
            >
              {/* Stars */}
              <div className="mb-4">
                <Stars count={stars} />
              </div>

              {/* Decorative quote mark */}
              <div className="absolute top-4 right-6 text-6xl text-gray-100 font-serif leading-none pointer-events-none select-none">
                &ldquo;
              </div>

              {/* Quote text */}
              <p
                className="text-gray-700 text-base leading-relaxed mb-6 flex-1 relative z-10"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                &ldquo;{text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
                <div>
                  <p
                    className="text-secondary font-bold text-sm"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {author}
                  </p>
                  <p className="text-primary text-xs font-medium">{role}</p>
                  <p className="text-gray-400 text-xs">{org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
