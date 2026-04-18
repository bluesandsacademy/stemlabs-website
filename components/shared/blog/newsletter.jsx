"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const NewsletterSection = ({ featuredPost }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      toast.success("You're subscribed! Check your inbox soon.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[#f8f9fa] py-20 px-6">
      <div className="max-w-8xl mx-auto">
        {/* Newsletter Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6 leading-tight">
            Practical STEM ideas you
            <br />
            can use next lesson
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Lesson-ready walkthroughs, analytics tips, offline teaching
            strategies, and updates from the Blue Sands Virtual STEM Lab.
          </p>

          {/* Email Subscription Form */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center gap-4 max-w-xl mx-auto"
          >
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug || featuredPost.id}`}
            className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group max-w-6xl mx-auto block"
          >
            <div className="relative h-[500px] md:h-[600px] bg-gray-900">
              {featuredPost.cover_image ? (
                <Image
                  src={featuredPost.cover_image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 1152px"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/30 to-secondary/60" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-primary font-semibold text-sm md:text-base">
                  {featuredPost.author}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-white/80 text-sm md:text-base">
                  {featuredPost.date}
                </span>
              </div>

              <div className="flex items-end justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight line-clamp-2">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                  )}
                </div>

                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <ArrowUpRight className="w-6 h-6 md:w-7 md:h-7" />
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
