"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const TeamSection = () => {
  const team = [
    {
      name: "Alero Thompson",
      role: "Founder & CEO",
      bio: "Founder & CEO of Blue Sands Stem Labs and a standout voice in business, technology, and STEM education.",
      image: "/team/1.png",
      bgColor: "from-purple-200 to-purple-100",
      social: {
        linkedin: "#",
      },
    },
    {
      name: "Kingsley Okechukwu",
      role: "Chief Technology Office",
      bio: "CTO at Blue Sands STEM Labs with 10+ years at the intersection of Information Technology and Marketing/Media Strategy.",
      image: "/team/1.png",
      bgColor: "from-green-200 to-green-100",
      social: {
        linkedin: "#",
      },
    },
    {
      name: "Samuel Dike",
      role: "Chief Operating Office",
      bio: "COO at Blue Sands STEM Labs, where he turns strategy into repeatable execution across people, product, and partnerships.",
      image: "/team/1.png",
      bgColor: "from-pink-200 to-pink-100",
      social: {
        linkedin: "#",
      },
    },
    {
      name: " Michael Shadrack Waltha",
      role: "HR lead",
      bio: "He architects the end-to-end backend for the company’s next-gen learning platform",
      image: "/team/1.png",
      bgColor: "from-yellow-200 to-yellow-100",
      social: {
        linkedin: "#",
      },
    },
    {
      name: "Ifedayo (Michael) Adedeji",
      role: "Lead Backend Developer",
      bio: "Focused on building reliable, user-centred applications with Java, Spring Boot, React, and SQL",
      image: "/team/1.png",
      bgColor: "from-blue-200 to-blue-100",
      social: {
        linkedin: "#",
      },
    },
    {
      name: "Mfoniso Ibokette",
      role: "Lead Product designer",
      bio: "He designs end-to-end digital products that balance business goals with real user needs.",
      image: "/team/1.png",
      bgColor: "from-orange-200 to-orange-100",
      social: {
        linkedin: "#",
      },
    },
    {
      name: "Grace of God Avoseh",
      role: "Chartered Accountant & Finance Manager",
      bio: "She combines analytical rigor with strong stakeholder communication to streamline close cycles.",
      image: "/team/1.png",
      bgColor: "from-teal-200 to-teal-100",
      social: {
        linkedin: "#",
      },
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base font-semibold text-primary uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Meet Our Team
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            We work together, as a seamless remote team
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Our philosophy is simple — hire a team of diverse, passionate people
            and foster a culture that empowers you to do you best work.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-x-8 lg:gap-y-12">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Avatar */}
              <div className="relative mb-5">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${member.bgColor} 
                                p-1 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Info */}
              <h3
                className="text-lg font-bold text-secondary mb-1"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {member.name}
              </h3>

              <p
                className="text-sm font-semibold text-primary mb-3"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {member.role}
              </p>

              <p
                className="text-sm text-gray-600 mb-4 leading-relaxed"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href={member.social.linkedin}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary flex items-center justify-center 
                           text-gray-600 hover:text-white transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
