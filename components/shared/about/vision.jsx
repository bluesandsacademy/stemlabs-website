"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const VisionMissionSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const imageY = useTransform(smoothProgress, [0, 1], [50, -50]);
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const contentY = useTransform(smoothProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative group"
            >
              {/* Decorative Background Element */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl blur-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <motion.div
                  className="relative aspect-[4/3] w-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src="/about/4.jpg"
                    alt="Students engaging with interactive STEM learning technology"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 via-transparent to-transparent" />
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-lg border border-gray-100"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-secondary">
                      Empowering Future Innovators
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Corner Accent Lines */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute -top-3 -right-3 w-24 h-24 pointer-events-none"
              >
                <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-primary to-transparent" />
                <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-primary to-transparent" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            style={{ y: contentY }}
            className="order-1 lg:order-2 space-y-10"
          >
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="group"
            >
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Label */}
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-px w-12 bg-gradient-to-r from-primary to-primary/50"
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  />
                  <motion.span
                    className="text-sm font-bold uppercase tracking-wider text-primary"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Our Vision
                  </motion.span>
                </div>

                {/* Vision Text */}
                <motion.p
                  className="text-lg sm:text-xl leading-relaxed text-gray-700"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  A Nigeria where every student—regardless of location, school
                  funding, or internet access—experiences world-class science
                  education and develops the practical skills to shape our
                  future
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent origin-left"
            />

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="group"
            >
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Label */}
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-px w-12 bg-gradient-to-r from-secondary to-secondary/50"
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  />
                  <motion.span
                    className="text-sm font-bold uppercase tracking-wider text-secondary"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    Our Mission
                  </motion.span>
                </div>

                {/* Mission Text */}
                <motion.p
                  className="text-lg sm:text-xl leading-relaxed text-gray-700"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  To democratize hands-on STEM learning by building interactive,
                  offline-first virtual labs that eliminate cost and safety
                  barriers, empower teachers with actionable insights, and
                  ignite curiosity in every Nigerian classroom.
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
