import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildBlogHref } from "@/lib/blog-url";

function pageWindow(page, totalPages) {
  const window = 1; // pages shown on each side of current
  const pages = new Set([1, totalPages, page]);
  for (let i = page - window; i <= page + window; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }
  return [...pages].sort((a, b) => a - b);
}

export default function BlogPagination({ page, totalPages, currentParams }) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 py-12">
      <Link
        href={buildBlogHref(currentParams, { page: Math.max(1, page - 1) })}
        aria-disabled={page === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 transition-colors ${
          page === 1 ? "pointer-events-none opacity-40" : "hover:border-primary hover:text-primary"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && <span className="text-gray-400 px-1">…</span>}
            <Link
              href={buildBlogHref(currentParams, { page: p })}
              aria-current={p === page ? "page" : undefined}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                p === page
                  ? "bg-primary text-white"
                  : "border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {p}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildBlogHref(currentParams, { page: Math.min(totalPages, page + 1) })}
        aria-disabled={page === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 transition-colors ${
          page === totalPages ? "pointer-events-none opacity-40" : "hover:border-primary hover:text-primary"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}
