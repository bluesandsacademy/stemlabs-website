import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedSpotlight({ post }) {
  if (!post) return null;

  const summary = post.excerpt || post.description;
  const href = `/blog/${post.slug || post.id}`;

  return (
    <section className="w-full bg-white px-6 pb-4">
      <div className="max-w-8xl mx-auto">
        <Link
          href={href}
          className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-3xl overflow-hidden p-4 lg:p-6"
        >
          <div className="relative w-full aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-primary/40 via-primary/10 to-transparent pointer-events-none" />
          </div>

          <div className="py-2 lg:py-6 lg:pr-6">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
              Featured
            </span>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-semibold text-sm">{post.author}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-sm">{post.date}</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-secondary leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
              {post.title}
            </h2>

            {summary && (
              <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">{summary}</p>
            )}

            <div className="inline-flex items-center gap-2 font-semibold text-secondary group-hover:text-primary transition-colors duration-300">
              Read article
              <span className="shrink-0 w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
