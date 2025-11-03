import Image from "next/image";

/**
 * Event Highlight Section
 *
 * Displays event highlights with a text list and image gallery grid
 */

export default function EventHighlight() {
  const highlights = [
    "Live VR/AR lab demos (Physics, Chemistry, Biology, Earth Science)",
    "AI Teacher power sessions on AI for planning, marking, and feedback.",
    "Student tech challenge with prizes and a public leaderboard.",
    "Panels/lightning talks on what's working (and what isn't) in African classrooms.",
    "Partner alley for demos, collaborations, and pilots.",
  ];

  const images = [
    {
      id: 1,
      src: "/asee/4.jpg",
      alt: "Interactive lab demo with digital display",
      className: "row-span-2",
    },
    {
      id: 2,
      src: "/asee/5.jpg",
      alt: "Team photo at event",
      className: "",
    },
    {
      id: 3,
      src: "/asee/6.jpg",
      alt: "Hands-on VR demonstration",
      className: "",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-secondary tracking-tight">
              Event Highlight
            </h2>

            {/* Highlights List */}
            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2.5 flex-shrink-0" />
                  <span className="text-foreground/60 text-base md:text-lg leading-relaxed font-light">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Image Grid */}
          <div className="grid grid-cols-2 gap-4 auto-rows-[200px]">
            {/* Large Image - Spans 2 rows */}
            <ImageBox
              image={images[0]}
              className="row-span-2"
              useImage={true}
            />

            {/* Top Right Image */}
            <ImageBox image={images[1]} className="" useImage={true} />

            {/* Bottom Left Image */}
            <ImageBox image={images[2]} className="" useImage={true} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ImageBox Component
 * Renders either a Next.js Image or a placeholder gradient
 */
function ImageBox({ image, className, useImage = false }) {
  // Safety check for undefined image
  if (!image) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-gray-200 ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-xs font-light">No Image</span>
        </div>
      </div>
    );
  }

  const placeholders = [
    "from-primary/20 to-secondary/30",
    "from-secondary/20 to-primary/30",
    "from-primary/30 to-secondary/20",
    "from-secondary/30 to-primary/20",
  ];

  const placeholderGradient = placeholders[image.id - 1] || placeholders[0];

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {useImage ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${placeholderGradient} flex items-center justify-center`}
        >
          <span className="text-secondary/20 text-xs font-light text-center px-4">
            Event Photo {image.id}
          </span>
        </div>
      )}
    </div>
  );
}
