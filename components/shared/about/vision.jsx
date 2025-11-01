import React from "react";
import { Monitor, BookOpen, Users } from "lucide-react";

const VisionMissionPurpose = () => {
  const cards = [
    {
      icon: Monitor,
      title: "Our Vision",
      description:
        "To become Africa's leading digital science and technology education ecosystem, empowering a generation of young innovators who will solve the continent's most pressing challenges through STEM.",
    },
    {
      icon: BookOpen,
      title: "Our Mission",
      description:
        "To democratize access to quality science education by integrating immersive technology, creative learning methods, and data-driven insights into classrooms and communities across Africa.",
    },
    {
      icon: Users,
      title: "Our Purpose",
      description:
        "We exist to bridge the educational divide in science and technology, empowering schools with digital tools that spark curiosity, creativity, and problem-solving skills in learners.",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-primary backdrop-blur-sm rounded-3xl p-8 lg:p-10 
                           flex flex-col items-center text-center
                           transition-all duration-300 hover:bg-primary/90 hover:shadow-2xl 
                           hover:-translate-y-2 border border-primary/80"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg">
                  <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p
                  className="text-white/90 text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VisionMissionPurpose;
