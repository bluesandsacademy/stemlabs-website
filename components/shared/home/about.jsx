import VideoSection from "./video";

export default function VirtualLabsSection() {
  return (
    <section className="bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-2xl font-semibold mb-3 tracking-wide font-sans">
            About Blue Sands STEM Labs
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-black mb-4 font-sans">
            Virtual Science Labs Built for African Classrooms
          </h1>
          <p className="text-foreground/60 max-w-4xl mx-auto text-xl leading-relaxed font-inter">
            Blue Sands STEM Labs, developed by Blue Sands Academy Limited,
            delivers curriculum-aligned Physics, Chemistry, and Biology
            experiments to students and teachers across Africa.
          </p>
        </div>

        <VideoSection />
      </div>
    </section>
  );
}
