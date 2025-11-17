"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/**
 * Event Highlight Section
 *
 * Displays event highlights with a text list and animated image gallery
 */

export default function EventHighlight() {
  const highlights = [
    "Live VR/AR lab demos (Physics, Chemistry, Biology, Earth Science)",
    "AI Teacher power sessions on AI for planning, marking, and feedback.",
    "Student tech challenge with prizes and a public leaderboard.",
    "Panels/lightning talks on what's working (and what isn't) in African classrooms.",
    "Partner alley for demos, collaborations, and pilots.",
  ];

  // Expanded image collection - add more images as needed
  const allImages = [
    {
      id: 1,
      src: "/asee/1.jpg",
      alt: "Interactive lab demo with digital display",
    },
    { id: 2, src: "/asee/5.jpg", alt: "Team photo at event" },
    { id: 3, src: "/asee/6.jpg", alt: "Hands-on VR demonstration" },
    { id: 4, src: "/asee/2.jpg", alt: "Students engaging with technology" },
    { id: 5, src: "/asee/3.jpg", alt: "AI Teacher demonstration" },
    { id: 6, src: "/asee/4.jpg", alt: "Panel discussion session" },
    { id: 7, src: "/asee/7.JPG", alt: "Partner collaboration space" },
    { id: 8, src: "/asee/8.JPG", alt: "Student tech challenge" },
    { id: 9, src: "/asee/9.JPG", alt: "VR experience showcase" },
    { id: 9, src: "/asee/10.JPG", alt: "VR experience showcase" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 3) % allImages.length);
        setIsTransitioning(false);
      }, 500); // Half of transition duration
    }, 4000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  // Get current set of 3 images to display
  const getCurrentImages = () => {
    const images = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % allImages.length;
      images.push(allImages[index]);
    }
    return images;
  };

  const currentImages = getCurrentImages();

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-secondary tracking-tight">
              Event Highlight
            </h2>

            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2.5 shrink-0" />
                  <span className="text-foreground/60 text-base md:text-lg leading-relaxed font-light">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>

            {/* Progress Indicator */}
            <div className="flex gap-2 pt-4">
              {Array.from({ length: Math.ceil(allImages.length / 3) }).map(
                (_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      Math.floor(currentIndex / 3) === idx
                        ? "w-8 bg-primary"
                        : "w-6 bg-primary/20"
                    }`}
                  />
                )
              )}
            </div>
          </div>

          {/* Right Column - Animated Image Grid */}
          <div className="grid grid-cols-2 gap-4 auto-rows-[200px] relative">
            {/* Large Image - Spans 2 rows */}
            <AnimatedImageBox
              image={currentImages[0]}
              className="row-span-2"
              isTransitioning={isTransitioning}
            />

            {/* Top Right Image */}
            <AnimatedImageBox
              image={currentImages[1]}
              className=""
              isTransitioning={isTransitioning}
              delay={100}
            />

            {/* Bottom Right Image */}
            <AnimatedImageBox
              image={currentImages[2]}
              className=""
              isTransitioning={isTransitioning}
              delay={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * AnimatedImageBox Component
 * Renders images with smooth fade transitions
 */
function AnimatedImageBox({ image, className, isTransitioning, delay = 0 }) {
  if (!image) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-gray-200 ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-xs font-light">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden group ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={image.id <= 3}
        />
      </div>

      {/* Overlay on hover */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <p className="text-white text-sm font-light p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {image.alt}
        </p>
      </div> */}
    </div>
  );
}
