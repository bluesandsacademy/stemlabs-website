"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { statistics, stats } from "@/lib/data";
import { img } from "@/lib/cloudinary";

const SubHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const leftStatVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20, duration: 1 },
    },
  };

  const rightStatVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const topFlagVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  return (
    <div className="w-full overflow-x-hidden bg-[#f8f9fb] py-16 sm:py-20 lg:py-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-secondary leading-tight mb-4">
            Transforming African STEM Education
          </h1>
          <p className="font-normal text-xl text-gray-600 max-w-3xl mx-auto">
            Addressing the unique challenges facing African schools and students
          </p>
        </motion.div>

        {/*
         * Responsive grid strategy:
         *   mobile  (< lg): 2-col — flag columns sit side-by-side like a 2×3 card grid;
         *                           text / map / stats each span both columns (col-span-2)
         *   desktop (lg+):  5-col — all five panels in one row
         *
         * This replaced the broken grid-cols-1 / sm:grid-cols-2 mix that left the two
         * flag blocks stacked in a single column at mobile and misaligned at tablet.
         */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_2fr] gap-6 sm:gap-10 lg:gap-8 items-center"
        >
          {/* Column 1 — Left Flags (Nigeria, Ghana, Rwanda) */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col items-center gap-6"
          >
            {stats.slice(0, 3).map((stat, index) => (
              <motion.div
                key={index}
                variants={leftStatVariants}
                whileHover={{ x: -6, transition: { duration: 0.3 } }}
                className="flex flex-col items-center gap-3 w-full"
              >
                <motion.div
                  className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 shadow-md"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Image
                    src={`https://flagcdn.com/w160/${stat.flagCode}.png`}
                    alt={`${stat.country} flag`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
                <motion.h3
                  className="text-primary text-sm sm:text-base lg:text-lg font-bold text-center"
                >
                  {stat.stat}
                </motion.h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Column 2 — Extra Flags (Kenya, South Africa, Uganda) */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col items-center gap-6"
          >
            {stats.slice(3).map((stat, index) => (
              <motion.div
                key={index}
                variants={topFlagVariants}
                whileHover={{ y: -8 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Image
                    src={`https://flagcdn.com/w160/${stat.flagCode}.png`}
                    alt={`${stat.country} flag`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
                <motion.h3
                  className="text-primary text-sm sm:text-base lg:text-lg font-bold text-center"
                >
                  {stat.stat}
                </motion.h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Column 3 — Descriptor text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="col-span-2 lg:col-span-1 flex items-center justify-center"
          >
            <p
              className="text-gray-600 text-sm sm:text-base text-center leading-relaxed font-normal max-w-[220px]"
            >
              of secondary schools lack adequate laboratory infrastructure
            </p>
          </motion.div>

          {/* Column 4 — Africa Map */}
          <motion.div
            variants={mapVariants}
            className="col-span-2 lg:col-span-1 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[180px] sm:max-w-60 aspect-4/5">
              <Image
                src={img("/map.png")}
                alt="Africa map"
                fill
                className="object-contain"
                priority
                sizes="240px"
              />
            </div>
          </motion.div>

          {/* Column 5 — Key Statistics */}
          <motion.div
            variants={containerVariants}
            className="col-span-2 lg:col-span-1 flex flex-col items-start gap-6 w-full max-w-sm lg:max-w-none mx-auto lg:mx-0"
          >
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                variants={rightStatVariants}
                whileHover={{ x: 6 }}
                className="flex items-start gap-3 w-full"
              >
                <motion.h3
                  className="text-primary text-lg sm:text-xl lg:text-2xl font-bold shrink-0 min-w-20 sm:min-w-[90px] lg:min-w-[110px]"
                >
                  {stat.percentage}
                </motion.h3>
                <motion.p
                  className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal pt-1"
                >
                  {stat.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubHero;
