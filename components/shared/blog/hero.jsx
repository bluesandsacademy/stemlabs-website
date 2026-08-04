"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { buildBlogHref } from "@/lib/blog-url";

export default function BlogHero({ currentParams }) {
  const router = useRouter();
  const [value, setValue] = useState(currentParams.q || "");
  const timerRef = useRef(null);

  // Keep the input in sync if the URL changes from elsewhere (e.g. a filter
  // pill clears the search, or the back button is used).
  useEffect(() => {
    setValue(currentParams.q || "");
  }, [currentParams.q]);

  const scheduleNavigate = (nextValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      router.replace(buildBlogHref(currentParams, { q: nextValue, page: 1 }));
    }, 300);
  };

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);
    scheduleNavigate(next);
  };

  const handleClear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setValue("");
    router.replace(buildBlogHref(currentParams, { q: "", page: 1 }));
  };

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <section className="w-full bg-white pt-16 pb-8 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary mb-4"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          The Blue Sands Blog
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mb-8">
          Stories, lessons, and updates on bringing immersive STEM education to schools across Africa.
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full pl-12 pr-11 py-3.5 rounded-full border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
