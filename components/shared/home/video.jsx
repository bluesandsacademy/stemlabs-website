"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { img } from "@/lib/cloudinary";

const VideoSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handlePlayClick = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  return (
    <>
      <section className="py-12 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-8xl mx-auto">
          {/* Video Player Container */}
          <div className="relative w-full max-w-6xl mx-auto">
            {/* Device Frame */}
            {/* Device Frame */}
            <div className="relative rounded-4xl bg-linear-to-t from-black/70 via-black/30 to-transparent">
              {/* Inner Screen */}
              <div className="relative rounded-[1.8rem] overflow-hidden">
                <div className="relative aspect-video rounded-[1.6rem] overflow-hidden">
                  {/* Thumbnail */}
                  <Image
                    src={img("/hero/videothumbnail.jpg")}
                    alt="Blue Sands STEM Labs"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-black/10" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      onClick={handlePlayClick}
                      className="group relative"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                        <FaPlay className="w-6 h-6 text-white ml-1" />
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Shadow */}
          </div>
        </div>
      </section>

      {/* Video Modal/Lightbox */}
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={closeVideo}
        >
          <button
            onClick={closeVideo}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            ×
          </button>

          <div
            className="relative w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* YouTube/Vimeo Embed */}
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/BpGHZHcIG7Q?si=8c3ThfaaVYaLT0Mn"
              title="Blue Sands STEM Labs Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Or use HTML5 Video */}
            {/* <video
              className="w-full h-full rounded-lg"
              controls
              autoPlay
            >
              <source src="/your-video.mp4" type="video/mp4" />
            </video> */}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default VideoSection;
