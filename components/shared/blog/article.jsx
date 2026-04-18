"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ArticleCard = ({ image, author, date, title, description, excerpt, tags, link, id }) => {
  const summary = excerpt || description;
  const href = id ? `/blog/${id}` : (link && link !== "#" ? link : "#");

  return (
    <article className="group cursor-pointer">
      <Link href={href}>
        {/* Image */}
        <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden mb-5">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-primary/40 via-primary/10 to-transparent pointer-events-none" />
        </div>

        {/* Author and Date */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-semibold text-sm">{author}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 text-sm">{date}</span>
        </div>

        {/* Title with Arrow */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight flex-1 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Description */}
        {summary && (
          <p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-3">{summary}</p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
              const label = typeof tag === "string" ? tag : tag.label;
              const color = typeof tag === "object" ? tag.color : "primary";
              return (
                <span
                  key={index}
                  className={`text-sm font-medium ${
                    color === "primary" ? "text-primary"
                    : color === "green" ? "text-green-600"
                    : color === "purple" ? "text-purple-600"
                    : color === "pink" ? "text-pink-600"
                    : "text-gray-700"
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </Link>
    </article>
  );
};

const ArticleGrid = ({ posts }) => {
  const items = posts || [];

  return (
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-8xl mx-auto">
        {items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">No articles published yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {items.map((article, index) => (
              <ArticleCard key={article.id || index} {...article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleGrid;
