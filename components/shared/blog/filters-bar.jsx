"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { buildBlogHref } from "@/lib/blog-url";

const VISIBLE_TAG_COUNT = 8;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "popular", label: "Most popular" },
];

export default function BlogFiltersBar({ categories, tags, currentParams }) {
  const router = useRouter();
  const [showAllTags, setShowAllTags] = useState(false);

  if (!categories.length && !tags.length) return null;

  const visibleTags = showAllTags ? tags : tags.slice(0, VISIBLE_TAG_COUNT);
  const hiddenTagCount = tags.length - visibleTags.length;

  const handleSortChange = (e) => {
    router.push(buildBlogHref(currentParams, { sort: e.target.value, page: 1 }));
  };

  return (
    <section className="w-full bg-white px-6 pb-10">
      <div className="max-w-8xl mx-auto flex flex-col gap-4">
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildBlogHref(currentParams, { category: "", page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !currentParams.category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => {
              const active = currentParams.category === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={buildBlogHref(currentParams, { category: active ? "" : cat.slug, page: 1 })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name} <span className="opacity-60">({cat.count})</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {visibleTags.map((tag) => {
                const active = currentParams.tag === tag.slug;
                return (
                  <Link
                    key={tag.slug}
                    href={buildBlogHref(currentParams, { tag: active ? "" : tag.slug, page: 1 })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                    }`}
                  >
                    #{tag.name}
                  </Link>
                );
              })}
              {hiddenTagCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllTags(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-primary hover:underline"
                >
                  +{hiddenTagCount} more
                </button>
              )}
            </div>
          )}

          <div className="relative shrink-0">
            <select
              value={currentParams.sort || "newest"}
              onChange={handleSortChange}
              aria-label="Sort articles"
              className="appearance-none pl-4 pr-9 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
