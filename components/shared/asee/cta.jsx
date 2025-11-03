/**
 * Register CTA Section
 *
 * Call-to-action section for event registration
 */

import Link from "next/link";

export default function RegisterCTA() {
  return (
    <section className="w-full bg-secondary py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.1) 50px,
            rgba(255,255,255,0.1) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.1) 50px,
            rgba(255,255,255,0.1) 51px
          )`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl relative z-10">
        {/* Content */}
        <div className="text-center space-y-6">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Register to Attend
          </h2>

          {/* Description */}
          <p className="text-white/90 text-base md:text-lg leading-relaxed font-light max-w-3xl mx-auto">
            A convening for teachers, school leaders, students, EdTech founders,
            NGOs, and government education stakeholders to experience immersive
            VR/AR STEM labs, classroom AI tools, and African-aligned digital
            content.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/asee-2025/register">
              <button className="bg-white text-secondary px-10 py-4 rounded-full font-medium text-lg hover:bg-white/95 transition-all hover:scale-105 shadow-xl hover:shadow-2xl">
                Register for Event
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
