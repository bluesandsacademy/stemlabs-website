export default function VirtualLabsSection() {
  return (
    <section className="bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-medium mb-3 tracking-wide">
            About Blue STEM5 Stem Labs
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Virtual Science Labs Built for African Classrooms
          </h1>
          <p className="text-foreground/70 max-w-4xl mx-auto text-base leading-relaxed">
            Blue Sands STEM Labs, developed by Blue Sands Academy Limited,
            delivers Curriculum-aligned Physics, Chemistry, and Biology
            experiments to students and teachers across Africa. IP-Lightmight
            works offline with zero- and limited internet/age-loads no PDRA and
            works confidently.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - What makes us different */}
          <div className="lg:col-span-2 bg-primary rounded-lg p-8 md:p-10 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              What make us different
            </h2>

            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {/* Card 1 */}
              <div className="bg-white rounded-xl p-8 text-secondary">
                <h3 className="text-lg font-bold mb-3">Access for All</h3>
                <p className="text-sm leading-relaxed text-secondary/80">
                  Affordable virtual labs designed to work offline ensure every
                  learner can participate.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl p-8 text-secondary">
                <h3 className="text-lg font-bold mb-3">Teacher-Centered</h3>
                <p className="text-sm leading-relaxed text-secondary/80">
                  Dashboards, lesson plans, and training assessments reduce prep
                  time and boost outcomes.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl p-8 text-secondary">
                <h3 className="text-lg font-bold mb-3">
                  Scalable & Affordable
                </h3>
                <p className="text-sm leading-relaxed text-secondary/80">
                  Cloud-hosted or centralized exam deployment lets schools
                  achieve real results.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-8">
              <button className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
                Book a demo
              </button>
              <button className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Explore experiments
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Features */}
          <div className="space-y-6">
            {/* 7,000+ learner card */}
            <div className="bg-primary rounded-2xl p-6 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                7,000+ learner
              </h3>
              <p className="text-sm text-white/90">
                Already exploring hands-on science with Blue Sands.
              </p>
            </div>

            {/* Built for low-connectivity card */}
            <div className="bg-primary rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">
                Built for low-connectivity
              </h3>
              <p className="text-sm text-white/90 mb-1">
                Offline Lab Manager & Sync for rural and
              </p>
              <p className="text-sm text-white/90">under-resourced schools.</p>
            </div>

            {/* Aligned to African curricula card */}
            <div className="bg-primary rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                Aligned to African curricula
              </h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>WAEC • NECO • IGCSE</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Physics • Chemistry • Biology</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Teacher training & onboarding included</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
