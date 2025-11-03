import FAQSection from "@/components/shared/home/faq";

import React from "react";

import PricingSection from "@/components/shared/home/pricing";

export const metadata = {
  title:
    "Affordable Virtual STEM Lab Plans for Schools and Students in Africa| Blue Sands STEM Labs",
  description:
    "Explore flexible pricing for Blue Sands STEM Labs, affordable virtual science lab solutions for schools, teachers, and students in Nigeria and across Africa.",
};

const Pricingpage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-6 sm:py-16 lg:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center space-y-4 sm:space-y-6">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary leading-tight"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Simple, Scalable, and{" "}
            <span className="text-primary">Affordable Plans</span> for Every
            School and Student in Africa
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            From virtual experiments to real-time assessments and guided
            learning, Blue Sands was built to bring the science lab to every
            Nigerian classroom—no equipment required.
          </p>
        </div>
      </div>
      <PricingSection />
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative max-w-[500px] ">
              <div className="rounded-3xl overflow-hidden border-2 border-white shadow-2xl h-[500px]">
                <img
                  src="/contact/2.jpg"
                  alt="Person working at desk"
                  className="w-full h-full object-cover aspect-video"
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                Payment Options
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-0.5 h-6 bg-white flex-shrink-0 mt-1"></div>
                  <p className="text-lg">
                    Blue Sands STEM Labs supports flexible, secure payment
                    options:
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-0.5 h-6 bg-white flex-shrink-0 mt-1"></div>
                  <p className="text-lg">
                    Debit/Credit Cards (Visa, MasterCard, Verve)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-0.5 h-6 bg-white flex-shrink-0 mt-1"></div>
                  <p className="text-lg">
                    Bank Transfer (via Flutterwave or Paystack gateways)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-0.5 h-6 bg-white flex-shrink-0 mt-1"></div>
                  <p className="text-lg">
                    Mobile Money (MTN MoMo, Opay, Palmpay)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-0.5 h-6 bg-white flex-shrink-0 mt-1"></div>
                  <p className="text-lg">
                    Bulk Payments for Schools (by invoice or direct
                    subscription)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-0.5 h-6 bg-white flex-shrink-0 mt-1"></div>
                  <p className="text-lg">
                    All subscriptions renew termly(quarterly). You can cancel
                    anytime from your dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  );
};

export default Pricingpage;
