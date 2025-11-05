import Image from "next/image";

/**
 * Partnership & Event Desk Section
 *
 * Displays contact cards for partnership and event inquiries
 */

export default function PartnershipDesk() {
  const contacts = [
    {
      id: 1,
      name: "Thaddeus Awase",
      role: "Partnerships & Ecosystem",
      phone: "+234 813 307 7505",
      email: "partnerships@bluesandstemlabs.org",
      image: "/home/team/1.png",
    },
    {
      id: 2,
      name: "Cliff Kingsley",
      role: "Events & School Relations",
      phone: "+234 916 431 0578",
      email: "info@bluesandsacademy.org",
      image: "/home/team/1.png",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-secondary tracking-tight text-center mb-12 md:mb-16">
          Partnership & Event Desk
        </h2>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} useImage={true} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Contact Card Component
 */
function ContactCard({ contact, useImage = false }) {
  return (
    <article className="flex flex-col items-start space-y-4 px-4">
      {/* Image */}
      <div className="w-full aspect-[3/3]  rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/10 to-primary/10 relative">
        {useImage ? (
          <Image
            src={contact.image}
            alt={contact.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-secondary/20 mx-auto flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-secondary/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-secondary/30 text-sm font-light block">
                Team Photo
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-3 w-full">
        {/* Name */}
        <h3 className="text-xl md:text-2xl font-medium text-secondary">
          {contact.name}
        </h3>

        {/* Role */}
        <p className="text-primary text-sm md:text-base font-medium">
          {contact.role}
        </p>

        {/* Phone */}
        <a
          href={`tel:${contact.phone.replace(/\s/g, "")}`}
          className="text-foreground/60 text-sm md:text-base hover:text-primary transition-colors block font-light"
        >
          {contact.phone}
        </a>

        {/* Email */}
        <a
          href={`mailto:${contact.email}`}
          className="text-foreground/60 text-sm md:text-base hover:text-primary transition-colors block font-light break-all"
        >
          {contact.email}
        </a>
      </div>
    </article>
  );
}
