import Image from "next/image";
import Link from "next/link";

export default function AseeHero() {
  return (
    <section className="relative bg-[#02345a] overflow-hidden">
      {/* Decorative dots pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-60 hidden md:block">
        <div className="grid grid-cols-6 gap-4 h-full items-center pr-8">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
          ))}
        </div>
      </div>

      <div className="max-w-8xl max-h-max mx-auto w-full px-4 sm:px-6 lg:px-16 py-16 md:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ">
          {/* Left Content */}
          <div className="relative z-10 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight">
                ASEE 2025
              </h1>
              <p className="text-white/80 text-base sm:text-lg font-light">
                Powered by Blue Sands STEM Labs
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Africa STEM EdTech Expo
              </h2>

              <p className="text-white/90 text-lg sm:text-xl font-medium">
                The Patron Hotel Km 20 Lekki - Epe Expy, Eti-Osa, Lekki 106104,
                Lagos, Nigeria
              </p>
              <p className="text-white/90 text-lg sm:text-xl font-medium">
                25th November 2025
              </p>
            </div>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              A convening for teachers, school leaders, students, EdTech
              founders, investors, NGOs, and government education stakeholders
              to experience immersive VR/AR education tools, digital STEM labs,
              classroom AI tools, and African-aligned digital content.
            </p>

            <div className="pt-4">
              <Link href="/asee-2025/register">
                <button className="bg-white text-[#02345a] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Register for Event
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative z-10">
            <div className=" absolute top-60 w-64 h-64 bg-[#0483e2] rounded-[100%_90%_80%_60%_/_10%_70%_20%_180%] opacity-75"></div>

            <div className="relative w-full max-w-md  mx-auto lg:max-w-none">
              <Image
                src="/asee/hero.png"
                alt="ASEE 2025 Event Mockup"
                width={600}
                height={600}
                className="w-full h-[550px] rounded-2xl object-contain"
                priority
              />

              {/* Decorative blob */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-[#0483e2] rounded-full blur-3xl opacity-20 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
