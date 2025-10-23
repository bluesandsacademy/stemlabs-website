"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function AfricaStatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      value: "90%",
      description:
        "of African secondary schools lack laboratory infrastructure",
    },
    {
      value: "91%",
      description:
        "of students have NOT had hands-on practice with real lab equipment by end of secondary school - no training or safeguarding",
    },
    {
      value: "40-50%",
      description:
        "Higher dropout engagement when hands-on digital labs are used, especially (ACROSS)",
    },
  ];

  const bottomStats = [
    {
      value: "$50k+",
      description: "Average cost and setup per traditional science lab",
    },
    {
      value: "24/7",
      description:
        "Virtual labs available 24/7, anytime, anywhere, repeatable unlimited access",
    },
  ];

  return (
    <section className="relative bg-primary py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="fade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
          </defs>

          {/* Perspective grid */}
          <g transform="translate(500, 600) rotate(-5) skewY(-20)">
            <rect
              x="-1000"
              y="-500"
              width="2000"
              height="1000"
              fill="url(#grid)"
            />
          </g>

          {/* Fade overlay */}
          <rect width="1000" height="800" fill="url(#fade)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
          Africa
        </h2>

        {/* Dotted World Map */}
        <div className="w-full flex items-center justify-center mb-16">
          <div className="w-full h-[530px] flex items-center justify-center">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
                center: [0, 20],
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <defs>
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="3"
                  height="3"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="1.5"
                    cy="1.5"
                    r="0.6"
                    fill="rgba(255, 255, 255, 1)"
                  />
                </pattern>
              </defs>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="url(#dots)"
                      stroke="none"
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
            </ComposableMap>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-12">
          {/* Top Stats Row */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {stat.value}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed max-w-xs mx-auto">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Stats Row */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {bottomStats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {stat.value}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed max-w-xs mx-auto">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
