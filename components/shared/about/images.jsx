"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const Gallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Spring configuration for smooth animations
  const springConfig = { stiffness: 300, damping: 30 };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Large Image */}
          <GalleryImage
            src="/about/1.jpg"
            alt="Team member presenting go-to-market strategy"
            index={0}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            className="h-[400px] lg:h-[600px]"
            delay={0}
            direction="left"
          />

          {/* Right Column - Two Stacked Images */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <GalleryImage
              src="/about/2.jpg"
              alt="Blue Sands Labs team at event"
              index={1}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              className="h-[250px] lg:h-[285px]"
              delay={0.15}
              direction="right"
            />

            <GalleryImage
              src="/about/3.jpg"
              alt="Presenting to audience with team photos on screen"
              index={2}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              className="h-[250px] lg:h-[285px]"
              delay={0.3}
              direction="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const GalleryImage = ({
  src,
  alt,
  index,
  hoveredIndex,
  setHoveredIndex,
  className,
  delay,
  direction,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left - width / 2) / width;
    const y = (e.clientY - rect.top - height / 2) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredIndex(null);
  };

  const isHovered = hoveredIndex === index;
  const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative ${className} rounded-3xl overflow-hidden group cursor-pointer`}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isOtherHovered ? 0.97 : 1,
        }}
        animate={{
          scale: isHovered ? 1.02 : isOtherHovered ? 0.97 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Image Container */}
        <motion.div
          className="relative w-full h-full"
          animate={{
            filter: isOtherHovered
              ? "brightness(0.7) saturate(0.8)"
              : "brightness(1) saturate(1)",
          }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 ease-out"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Interactive Light Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(4, 131, 226, 0.15) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
        />

        {/* Border Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: isHovered
              ? "0 0 30px rgba(4, 131, 226, 0.3), inset 0 0 0 1px rgba(4, 131, 226, 0.2)"
              : "0 10px 40px rgba(0, 0, 0, 0.15)",
          }}
          animate={{
            boxShadow: isHovered
              ? [
                  "0 0 30px rgba(4, 131, 226, 0.3), inset 0 0 0 1px rgba(4, 131, 226, 0.2)",
                  "0 0 40px rgba(4, 131, 226, 0.4), inset 0 0 0 1px rgba(4, 131, 226, 0.3)",
                  "0 0 30px rgba(4, 131, 226, 0.3), inset 0 0 0 1px rgba(4, 131, 226, 0.2)",
                ]
              : "0 10px 40px rgba(0, 0, 0, 0.15)",
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          <div
            className="h-full w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        </motion.div>

        {/* Corner Accent */}
        <motion.div
          className="absolute top-4 right-4 w-12 h-12 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ duration: 0.4, ease: "backOut" }}
        >
          <div className="w-full h-full border-t-2 border-r-2 border-primary rounded-tr-2xl" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Gallery;
