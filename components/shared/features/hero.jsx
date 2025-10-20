export default function FeaturesHero() {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* 3D Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* 3D perspective lines */}
          <g opacity="0.6">
            <line
              x1="0"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="white"
              strokeWidth="1.5"
            />
            <line
              x1="20%"
              y1="0"
              x2="60%"
              y2="100%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="40%"
              y1="0"
              x2="70%"
              y2="100%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="60%"
              y1="0"
              x2="80%"
              y2="100%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="80%"
              y1="0"
              x2="90%"
              y2="100%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="100%"
              y1="0"
              x2="100%"
              y2="100%"
              stroke="white"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-20 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              A Virtual STEM Lab Built for{" "}
              <span className="relative inline-block">
                Real Classrooms
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 300 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6C50 2 100 1 150 2C200 3 250 4 298 6"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-white/90 mb-8 max-w-xl leading-relaxed">
              Blue Sands is a virtual STEM lab built for real classrooms: large
              classes, limited lab supplies, uneven internet, mixed devices.
              Everything below is designed to help you teach more practical
              science, with less friction.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
                Watch Video
              </button>
              <button className="px-8 py-4 bg-primary border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
                Get Pricing
              </button>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="relative lg:ml-auto max-w-md">
            <div className="grid grid-cols-2 gap-3">
              {/* Large Image - spans 2 rows */}
              <div className="row-span-2 rounded-2xl overflow-hidden bg-white shadow-2xl p-1.5">
                <div className="rounded-xl overflow-hidden h-full">
                  <img
                    src="/features/1.jpg"
                    alt="Student using VR headset in lab"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Top Right Image */}
              <div className="rounded-2xl overflow-hidden bg-white shadow-2xl p-1.5">
                <div className="rounded-xl overflow-hidden aspect-square">
                  <img
                    src="/features/2.jpg"
                    alt="Student conducting experiment"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom Right Image */}
              <div className="rounded-2xl overflow-hidden bg-white shadow-2xl p-1.5">
                <div className="rounded-xl overflow-hidden aspect-square">
                  <img
                    src="/features/3.jpg"
                    alt="Student in lab setting"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-2xl"></div>
      </div>
    </section>
  );
}
