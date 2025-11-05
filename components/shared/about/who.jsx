import React from "react";
import Image from "next/image";

const WhoWeAre = () => {
  return (
    <section className="bg-[#172B4D] py-10 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image with Decorative Blob */}
          <div className="relative flex justify-center lg:justify-start">
            {/* Decorative Blob Background */}
            <div className="relative">
              {/* Blue Blob Shape */}
              <svg
                className="absolute -left-8 -top-8 w-[120%] h-[120%] -z-0"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="blobGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#0483e2" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0483e2" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#blobGradient)"
                  d="M56.9,-61.8C72.3,-49.7,82.3,-31.1,85.7,-11.3C89.1,8.5,85.9,29.5,74.5,45.8C63.1,62.1,43.5,73.7,23.3,78.8C3.1,83.9,-17.7,82.5,-35.8,75.3C-53.9,68.1,-69.3,55.1,-77.5,38.5C-85.7,21.9,-86.7,1.7,-82.3,-16.2C-77.9,-34.1,-68.1,-49.7,-54.3,-62C-40.5,-74.3,-23.7,-83.3,-4.9,-77.6C13.9,-71.9,41.5,-73.9,56.9,-61.8Z"
                  transform="translate(200 200)"
                />
              </svg>

              {/* Image Container */}
              <div className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/about/2.jpg"
                  alt="Student using VR headset for virtual science lab"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="text-white space-y-3">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Who We Are
            </h2>

            <p
              className="text-base sm:text-base leading-relaxed text-white/90"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Blue Sands Academy is a forward-thinking EdTech and STEM
              innovation company redefining how science and technology education
              is experienced in Africa. Through immersive technologies like
              Virtual Reality (VR), Augmented Reality (AR), and Artificial
              Intelligence (AI), we make practical learning accessible,
              engaging, and equitable for every student, regardless of location
              or resources.
            </p>

            <p
              className="text-base sm:text-base leading-relaxed text-white/90"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Our flagship product, Blue Sands STEM Labs, is a virtual science
              laboratory solution designed to empower secondary school students
              to conduct Physics, Chemistry, and Biology experiments anytime,
              anywhere, even with limited internet access or laboratory
              infrastructure.
            </p>

            <p
              className="text-base sm:text-lg leading-relaxed text-white/90"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              We are driven by a single belief: every learner deserves the
              opportunity to explore, experiment, and innovate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
