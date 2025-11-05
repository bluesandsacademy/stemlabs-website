import React from "react";
import Image from "next/image";

const SubHero = () => {
  const stats = [
    {
      country: "Nigeria",
      stat: "65%",
      flagCode: "ng",
      text: "of Nigerian secondary schools lack adequate lab infrastructure",
    },
    {
      country: "Ghana",
      stat: "60%",
      flagCode: "gh",
      text: "of Ghanian secondary schools lack adequate lab infrastructure",
    },
    {
      country: "Rwanda",
      stat: "74.5%",
      flagCode: "rw",
      text: "of Rwandan secondary schools lack adequate lab infrastructure",
    },
    {
      country: "Kenya",
      stat: "45%",
      flagCode: "ke",
    },
    {
      country: "South Africa",
      stat: "70%",
      flagCode: "za",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
      {/* Header Section */}
      <div className="flex flex-col gap-3 items-center justify-center max-w-4xl w-full text-center mb-12 sm:mb-16">
        <h1
          className="font-bold text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-secondary leading-tight"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Transforming African STEM Education
        </h1>

        <p
          className="font-normal text-base md:text-lg text-gray-600 max-w-3xl"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Addressing the unique challenges facing African universities and
          students
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-10 lg:gap-2 max-w-6xl w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-start gap-4 
                       bg-gray-50/50 rounded-2xl p-2
                       transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Flag Circle */}
            <div className="relative   flex items-center justify-center overflow-hidden">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={`https://flagcdn.com/w80/${stat.flagCode}.png`}
                  alt={`${stat.country} flag`}
                  fill
                  className="object-cover rounded-full"
                  unoptimized
                />
              </div>
            </div>

            {/* Country Name and Percentage */}
            <h3
              className="text-primary text-xl font-bold"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              {stat.stat}
            </h3>

            {/* Description Text */}
          </div>
        ))}
      </div>
      <p
        className="text-gray-600 text-lg text-center leading-relaxed font-normal"
        style={{ fontFamily: "var(--font-jarkata)" }}
      >
        secondary schools lack adequate lab infrastructure
      </p>
    </div>
  );
};

export default SubHero;
