import React from "react";

const SubHero = () => {
  const stats = [
    {
      stat: "68%",
      text: "Of African universities lack adequate lab equipment",
    },
    {
      stat: "45%",
      text: "Higher student engagement with virtual labs",
    },
    {
      stat: "₦2M+",
      text: "Average cost savings per institution annually",
    },
    {
      stat: "24/7",
      text: "Access from anywhere within Africa seamlessly",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-white to-blue-50/30">
      {/* Header Section */}
      <div className="flex flex-col gap-1 items-center justify-center max-w-4xl w-full text-center mb-6 sm:mb-8 lg:mb-10">
        <h1
          className="font-bold text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl text-secondary leading-tight"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Completely Leverage Product
        </h1>

        <p
          className="font-extralight text-base md:text-lg text-gray-600 max-w-5xl leading-loose"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Addressing the unique challenges facing African universities and
          students
        </p>

        {/* Decorative divider */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 max-w-7xl w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-3 
                       transition-all duration-300  group"
          >
            {/* Stat Number */}
            <h2
              className="text-primary text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-bold "
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              {stat.stat}
            </h2>

            {/* Divider */}

            {/* Stat Text */}
            <p
              className="text-gray-600 text-sm sm:text-base text-center leading-relaxed font-light"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              {stat.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubHero;
