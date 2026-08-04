# Blog Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/blog` a hero with working search, category/tag filters, a rendered featured-post spotlight, and real numbered pagination — so the archive stays navigable at 50–100+ posts.

**Architecture:** A new server-side data helper (`lib/blog-queries.js`) resolves search/filter/sort/pagination against Supabase directly (bypassing `/api/blog`, which stays untouched for the admin dashboard). The `/blog` page (Next.js 15 App Router server component) reads `searchParams`, calls the helper, and composes five presentational pieces: hero (client, debounced search), filters bar (client, category/tag/sort), featured spotlight (server), article grid (existing, extended), and pagination (server, `<Link>`-based).

**Tech Stack:** Next.js 15.5 App Router, React server components, `@supabase/supabase-js` (service-role client), Tailwind v4 (`@theme` tokens: `--color-primary: #0483e2`, `--color-secondary: #02345a`), `lucide-react` icons.

## Global Constraints

- Next.js 15: `searchParams` passed to a page server component is a `Promise` and must be `await`ed — confirmed convention already used for `params` in `app/(user)/blog/[id]/page.jsx`.
- This project has **no test framework configured** (no jest/vitest, no `test` script in `package.json`). Verification in this plan is manual: run `npm run dev`, then check behavior with `curl` (for server-rendered HTML/data) or a throwaway `node -e` snippet (for pure functions). This matches how blog-publishing work was verified earlier in this project. Do not add a test framework as part of this plan — out of scope.
- `/api/blog` (used by the admin dashboard) must not change contract or behavior.
- Do not touch `app/(user)/blog/[id]/page.jsx` (single-post page) or the admin blog pages.
- Reuse existing visual language: `text-primary` / `bg-primary` (#0483e2), `text-secondary` (#02345a), rounded-2xl cards, `lucide-react` icons — do not introduce a new color palette or icon set.
- Page size is fixed at 12 posts per page (4 rows × 3 columns), per spec.

---

### Task 1: `lib/blog-url.js` — shared URL-builder utility

**Files:**
- Create: `lib/blog-url.js`

**Interfaces:**
- Consumes: nothing (pure function, no imports beyond none needed).
- Produces: `buildBlogHref(current, overrides)` — used by Task 3 (pagination), Task 5 (hero), Task 6 (filters bar). `current` and `overrides` are plain objects that may contain any of `{ q, category, tag, sort, page }` (all optional; values are strings except `page`, which may be a string or number). Returns a string like `/blog?q=stem&page=2` or `/blog` when no params are active.

- [ ] **Step 1: Write `lib/blog-url.js`**

```js
// lib/blog-url.js
//
// Builds a /blog URL from the current filter/search/sort/page state plus
// any overrides. Omits params at their default value (empty string / page 1
// / sort=newest) so the URL stays clean, e.g. "/blog" instead of
// "/blog?q=&category=&sort=newest&page=1".

export function buildBlogHref(current = {}, overrides = {}) {
  const merged = { ...current, ...overrides };

  const usp = new URLSearchParams();
  if (merged.q) usp.set("q", merged.q);
  if (merged.category) usp.set("category", merged.category);
  if (merged.tag) usp.set("tag", merged.tag);
  if (merged.sort && merged.sort !== "newest") usp.set("sort", merged.sort);

  const pageNum = Number(merged.page) || 1;
  if (pageNum > 1) usp.set("page", String(pageNum));

  const qs = usp.toString();
  return qs ? `/blog?${qs}` : "/blog";
}
```

- [ ] **Step 2: Manually verify with a throwaway script**

Run:
```bash
node -e '
const { buildBlogHref } = require("./lib/blog-url.js");
const assert = require("assert");

assert.strictEqual(buildBlogHref({}, {}), "/blog");
assert.strictEqual(buildBlogHref({}, { q: "stem" }), "/blog?q=stem");
assert.strictEqual(buildBlogHref({ q: "stem" }, { page: 2 }), "/blog?q=stem&page=2");
assert.strictEqual(buildBlogHref({ q: "stem", page: 2 }, { q: "" }), "/blog?page=2"); // page is caller-owned: buildBlogHref never resets it implicitly
assert.strictEqual(buildBlogHref({}, { sort: "newest" }), "/blog");
assert.strictEqual(buildBlogHref({}, { sort: "popular" }), "/blog?sort=popular");
assert.strictEqual(
  buildBlogHref({ category: "community", sort: "popular" }, { tag: "impact", page: 3 }),
  "/blog?category=community&tag=impact&sort=popular&page=3"
);
console.log("PASS");
'
```

This file uses ESM `export`, so run it through Node with CommonJS interop disabled — if the above fails with a `SyntaxError` about `export`, run instead:

```bash
node --input-type=module -e '
import { buildBlogHref } from "./lib/blog-url.js";
import assert from "node:assert";

assert.strictEqual(buildBlogHref({}, {}), "/blog");
assert.strictEqual(buildBlogHref({}, { q: "stem" }), "/blog?q=stem");
assert.strictEqual(buildBlogHref({ q: "stem" }, { page: 2 }), "/blog?q=stem&page=2");
assert.strictEqual(buildBlogHref({ q: "stem", page: 2 }, { q: "" }), "/blog?page=2"); // page is caller-owned: buildBlogHref never resets it implicitly
assert.strictEqual(buildBlogHref({}, { sort: "newest" }), "/blog");
assert.strictEqual(buildBlogHref({}, { sort: "popular" }), "/blog?sort=popular");
assert.strictEqual(
  buildBlogHref({ category: "community", sort: "popular" }, { tag: "impact", page: 3 }),
  "/blog?category=community&tag=impact&sort=popular&page=3"
);
console.log("PASS");
'
```

Expected: `PASS` printed, no assertion errors.

- [ ] **Step 3: Commit**

```bash
git add lib/blog-url.js
git commit -m "feat: add buildBlogHref URL utility for blog search/filter/pagination"
```

---

### Task 2: `lib/blog-queries.js` — data layer

**Files:**
- Create: `lib/blog-queries.js`

**Interfaces:**
- Consumes: `supabaseAdmin`, `normalisePost`, `POST_SELECT` from `@/lib/supabase-admin` (existing, see `lib/supabase-admin.js`).
- Produces: `async function getBlogPageData({ q, category, tag, sort, page })` — used by Task 8 (`app/(user)/blog/page.jsx`). Returns:
  ```
  {
    posts: NormalisedPost[],       // current page's grid posts (featured post excluded when isDefaultView)
    total: number,                 // total matching published posts
    page: number,                  // clamped current page, 1-based
    totalPages: number,            // >= 1
    categories: [{ name, slug, count }],  // only categories with >=1 published post, sorted by count desc
    tags: [{ name, slug, count }],        // only tags with >=1 published post, sorted by count desc
    isDefaultView: boolean,        // true iff no q/category/tag and page <= 1
    featuredPost: NormalisedPost | null,  // only computed when isDefaultView
  }
  ```
  Also exports `PAGE_SIZE = 12`.

- [ ] **Step 1: Write `lib/blog-queries.js`**

```js
// lib/blog-queries.js
//
// Server-side data layer for the public /blog listing page. Queries
// Supabase directly (this page already did, pre-existing pattern in
// app/(user)/blog/page.jsx) rather than through /api/blog, which exists
// for the admin dashboard's client-side fetches and keeps its own contract.
//
// Filtering by category/tag resolves to a post-ID list BEFORE pagination,
// unlike /api/blog's GET handler (which filters after .range() and would
// silently return wrong/short pages once combined with pagination).

import { supabaseAdmin, normalisePost, POST_SELECT } from "@/lib/supabase-admin";

export const PAGE_SIZE = 12;

// Sentinel UUID that matches no real row — used to force a clean "zero
// results" instead of passing an empty array to `.in()`.
const EMPTY_MATCH_ID = "00000000-0000-0000-0000-000000000000";

async function getPublishedPostIds() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("id")
    .eq("status", "published")
    .is("deleted_at", null);
  return (data || []).map((row) => row.id);
}

async function getCategoryFacets(publishedIds) {
  if (!publishedIds.length) return [];
  const { data } = await supabaseAdmin
    .from("post_categories")
    .select("post_id, categories(id, name, slug)")
    .in("post_id", publishedIds);

  const counts = new Map();
  for (const row of data || []) {
    const c = row.categories;
    if (!c) continue;
    const entry = counts.get(c.slug) || { name: c.name, slug: c.slug, count: 0 };
    entry.count += 1;
    counts.set(c.slug, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

async function getTagFacets(publishedIds) {
  if (!publishedIds.length) return [];
  const { data } = await supabaseAdmin
    .from("post_tags")
    .select("post_id, tags(id, name, slug)")
    .in("post_id", publishedIds);

  const counts = new Map();
  for (const row of data || []) {
    const t = row.tags;
    if (!t) continue;
    const entry = counts.get(t.slug) || { name: t.name, slug: t.slug, count: 0 };
    entry.count += 1;
    counts.set(t.slug, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

async function getPostIdsForCategory(slug) {
  const { data } = await supabaseAdmin
    .from("post_categories")
    .select("post_id, categories!inner(slug)")
    .eq("categories.slug", slug);
  return (data || []).map((row) => row.post_id);
}

async function getPostIdsForTag(slug) {
  const { data } = await supabaseAdmin
    .from("post_tags")
    .select("post_id, tags!inner(slug)")
    .eq("tags.slug", slug);
  return (data || []).map((row) => row.post_id);
}

function applyCommonFilters(query, { q, idFilter }) {
  let out = query.eq("status", "published").is("deleted_at", null);
  if (q) out = out.textSearch("search_vector", q, { type: "websearch" });
  if (idFilter) out = out.in("id", idFilter.length ? idFilter : [EMPTY_MATCH_ID]);
  return out;
}

async function countMatchingPosts({ q, idFilter }) {
  const query = applyCommonFilters(
    supabaseAdmin.from("posts").select("id", { count: "exact", head: true }),
    { q, idFilter }
  );
  const { count, error } = await query;
  if (error) {
    console.error("[blog-queries] countMatchingPosts:", error.message);
    return 0;
  }
  return count || 0;
}

async function fetchMatchingPosts({ q, idFilter, sort, page }) {
  let query = applyCommonFilters(
    supabaseAdmin.from("posts").select(POST_SELECT),
    { q, idFilter }
  );

  if (sort === "oldest") query = query.order("publish_date", { ascending: true });
  else if (sort === "popular") query = query.order("views_count", { ascending: false });
  else query = query.order("publish_date", { ascending: false });

  const offset = (page - 1) * PAGE_SIZE;
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data, error } = await query;
  if (error) {
    console.error("[blog-queries] fetchMatchingPosts:", error.message);
    return [];
  }
  return (data || []).map(normalisePost);
}

async function getFeaturedPost() {
  const { data: featured } = await supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .is("deleted_at", null)
    .eq("featured", true)
    .order("publish_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (featured) return normalisePost(featured);

  const { data: latest } = await supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("publish_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  return latest ? normalisePost(latest) : null;
}

export async function getBlogPageData({ q = "", category = "", tag = "", sort = "newest", page = 1 } = {}) {
  const publishedIds = await getPublishedPostIds();
  const [categories, tags] = await Promise.all([
    getCategoryFacets(publishedIds),
    getTagFacets(publishedIds),
  ]);

  let idFilter = null;
  if (category) {
    idFilter = await getPostIdsForCategory(category);
  }
  if (tag) {
    const tagIds = await getPostIdsForTag(tag);
    idFilter = idFilter ? idFilter.filter((id) => tagIds.includes(id)) : tagIds;
  }

  const isDefaultView = !q && !category && !tag && page <= 1;

  const total = await countMatchingPosts({ q, idFilter });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const fetchedPosts = await fetchMatchingPosts({ q, idFilter, sort, page: currentPage });

  const featuredPost = isDefaultView ? await getFeaturedPost() : null;
  const posts = featuredPost
    ? fetchedPosts.filter((p) => p.id !== featuredPost.id)
    : fetchedPosts;

  return {
    posts,
    total,
    page: currentPage,
    totalPages,
    categories,
    tags,
    isDefaultView,
    featuredPost,
  };
}
```

- [ ] **Step 2: Manually verify against the dev server**

Start the dev server in the background:
```bash
npm run dev > /tmp/bls-dev.log 2>&1 &
sleep 3
grep -oE "Local:\s+http://localhost:[0-9]+" /tmp/bls-dev.log
```

Note the port (likely 3000 or 3001 if 3000 is busy — call it `$PORT` below). This task has no route wired up yet, so verify the module loads and runs correctly via a temporary Node script that imports it directly:

```bash
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2)
ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)
SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2)

NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
NEXT_PUBLIC_SUPABASE_ANON_KEY="$ANON_KEY" \
SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" \
node --input-type=module -e '
import { getBlogPageData } from "./lib/blog-queries.js";

const data = await getBlogPageData({});
console.log("default view:", data.isDefaultView);
console.log("total:", data.total, "totalPages:", data.totalPages, "page:", data.page);
console.log("featuredPost:", data.featuredPost?.title || null);
console.log("categories:", data.categories.map(c => `${c.name}(${c.count})`).join(", "));
console.log("tags:", data.tags.map(t => `${t.name}(${t.count})`).join(", "));
console.log("posts on page:", data.posts.length);

const filtered = await getBlogPageData({ category: data.categories[0]?.slug, page: 1 });
console.log("filtered by", data.categories[0]?.slug, "-> total:", filtered.total, "isDefaultView:", filtered.isDefaultView);

const searched = await getBlogPageData({ q: "STEM" });
console.log("search STEM -> total:", searched.total);

const overPage = await getBlogPageData({ page: 999 });
console.log("page 999 clamped to:", overPage.page, "(expect <= totalPages)");
'
```

Note: `lib/supabase-admin.js` reads env vars via `process.env` at import time, so the inline env prefix above is required since this script runs outside Next.js's automatic `.env.local` loading.

Expected: no errors thrown; `total` matches the number of published posts (from the earlier session, at least the "Inside the Conversation..." post should be included); `featuredPost.title` is set; `page 999 clamped to:` shows a value `<= totalPages`, not `999`.

- [ ] **Step 3: Commit**

```bash
git add lib/blog-queries.js
git commit -m "feat: add getBlogPageData query helper with correct filter-then-paginate order"
```

---

### Task 3: `components/shared/blog/pagination.jsx`

**Files:**
- Create: `components/shared/blog/pagination.jsx`

**Interfaces:**
- Consumes: `buildBlogHref` from `@/lib/blog-url` (Task 1).
- Produces: default export `BlogPagination({ page, totalPages, currentParams })`, used by Task 8. `currentParams` is `{ q, category, tag, sort }` (page is provided separately since this component computes hrefs for *other* pages).

- [ ] **Step 1: Write `components/shared/blog/pagination.jsx`**

```jsx
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
```

- [ ] **Step 2: Manually verify with a throwaway render check**

This is a presentational component with no data dependency beyond props, so verify it compiles and produces sane hrefs by temporarily rendering it in isolation. Add a scratch route, check it, then delete the scratch route:

```bash
mkdir -p app/\(user\)/_scratch-pagination-check
cat > "app/(user)/_scratch-pagination-check/page.jsx" <<'EOF'
import BlogPagination from "@/components/shared/blog/pagination";

export default function ScratchCheck() {
  return (
    <div className="p-10 space-y-10">
      <BlogPagination page={1} totalPages={1} currentParams={{}} />
      <BlogPagination page={5} totalPages={12} currentParams={{ category: "community" }} />
      <BlogPagination page={12} totalPages={12} currentParams={{ q: "stem" }} />
    </div>
  );
}
EOF
npm run dev > /tmp/bls-dev.log 2>&1 &
sleep 3
PORT=$(grep -oE "localhost:[0-9]+" /tmp/bls-dev.log | head -1 | cut -d: -f2)
curl -s "http://localhost:$PORT/_scratch-pagination-check" -o /tmp/pagination-check.html -w "HTTP %{http_code}\n"
grep -o 'href="/blog[^"]*"' /tmp/pagination-check.html
```

Expected: HTTP 200; the first pagination (totalPages=1) renders nothing (check the HTML has no `aria-label="Blog pagination"` for that instance — visually confirm only 2 nav blocks appear); the second shows page links including `/blog?category=community&page=4`, `/blog?category=community&page=6`, etc.; the third shows page 11 and 12 with `q=stem` preserved and no next-page link active.

Then clean up:
```bash
rm -rf "app/(user)/_scratch-pagination-check"
kill %1 2>/dev/null
```

- [ ] **Step 3: Commit**

```bash
git add components/shared/blog/pagination.jsx
git commit -m "feat: add BlogPagination component with Link-based, JS-free page navigation"
```

---

### Task 4: `components/shared/blog/featured-spotlight.jsx`

**Files:**
- Create: `components/shared/blog/featured-spotlight.jsx`

**Interfaces:**
- Consumes: nothing beyond `next/image`, `next/link`, `lucide-react`. Takes a `post` shaped like `normalisePost()`'s return value (`{ id, slug, title, excerpt, image, author, date, tags }` — see `lib/supabase-admin.js`).
- Produces: default export `FeaturedSpotlight({ post })`, used by Task 8. Renders `null` when `post` is falsy.

- [ ] **Step 1: Write `components/shared/blog/featured-spotlight.jsx`**

```jsx
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
```

- [ ] **Step 2: Manually verify with a scratch route**

```bash
mkdir -p "app/(user)/_scratch-spotlight-check"
cat > "app/(user)/_scratch-spotlight-check/page.jsx" <<'EOF'
import FeaturedSpotlight from "@/components/shared/blog/featured-spotlight";

const samplePost = {
  id: "abc", slug: "inside-the-conversation-what-it-really-takes-to-transform-stem-education-in-africa",
  title: "Inside the Conversation: What It Really Takes to Transform STEM Education in Africa",
  excerpt: "Last week, Blue Sands STEM Labs joined a panel conversation on immersive technology and the future of STEM education across Africa.",
  image: "https://res.cloudinary.com/dgjbx9xqq/image/upload/v1785843532/bls/blog/z8bi71betetmhrgbicg8.png",
  author: "Blue Sands Academy", date: "04 Aug 2026",
};

export default function ScratchCheck() {
  return (
    <div className="space-y-10">
      <FeaturedSpotlight post={samplePost} />
      <FeaturedSpotlight post={null} />
    </div>
  );
}
EOF
npm run dev > /tmp/bls-dev.log 2>&1 &
sleep 3
PORT=$(grep -oE "localhost:[0-9]+" /tmp/bls-dev.log | head -1 | cut -d: -f2)
curl -s "http://localhost:$PORT/_scratch-spotlight-check" -o /tmp/spotlight-check.html -w "HTTP %{http_code}\n"
grep -c "Featured" /tmp/spotlight-check.html
grep -o 'href="/blog/[^"]*"' /tmp/spotlight-check.html
```

Expected: HTTP 200; `Featured` badge text present exactly once (the `null` case renders nothing); the href points to `/blog/inside-the-conversation-what-it-really-takes-to-transform-stem-education-in-africa`.

Clean up:
```bash
rm -rf "app/(user)/_scratch-spotlight-check"
kill %1 2>/dev/null
```

- [ ] **Step 3: Commit**

```bash
git add components/shared/blog/featured-spotlight.jsx
git commit -m "feat: add FeaturedSpotlight component for the blog hero section"
```

---

### Task 5: `components/shared/blog/hero.jsx`

**Files:**
- Create: `components/shared/blog/hero.jsx`

**Interfaces:**
- Consumes: `buildBlogHref` from `@/lib/blog-url` (Task 1); `useRouter` from `next/navigation`.
- Produces: default export `BlogHero({ currentParams })`, used by Task 8. `currentParams` is `{ q, category, tag, sort, page }` as read server-side in Task 8.

- [ ] **Step 1: Write `components/shared/blog/hero.jsx`**

```jsx
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
```

- [ ] **Step 2: Manually verify with a scratch route**

```bash
mkdir -p "app/(user)/_scratch-hero-check"
cat > "app/(user)/_scratch-hero-check/page.jsx" <<'EOF'
import BlogHero from "@/components/shared/blog/hero";

export default function ScratchCheck() {
  return <BlogHero currentParams={{ q: "stem", category: "community" }} />;
}
EOF
npm run dev > /tmp/bls-dev.log 2>&1 &
sleep 3
PORT=$(grep -oE "localhost:[0-9]+" /tmp/bls-dev.log | head -1 | cut -d: -f2)
curl -s "http://localhost:$PORT/_scratch-hero-check" -o /tmp/hero-check.html -w "HTTP %{http_code}\n"
grep -o 'value="[^"]*"' /tmp/hero-check.html | head -3
```

Expected: HTTP 200; the rendered input has `value="stem"` (confirms `currentParams.q` seeds the field). For the debounce/URL-update behavior itself (client-side `router.replace`), open `http://localhost:$PORT/_scratch-hero-check` in a real browser, type into the search box, and confirm the address bar updates to `/blog?q=<text>&category=community` about 300ms after you stop typing, and that clicking the X clears both the field and the `q` param.

Clean up:
```bash
rm -rf "app/(user)/_scratch-hero-check"
kill %1 2>/dev/null
```

- [ ] **Step 3: Commit**

```bash
git add components/shared/blog/hero.jsx
git commit -m "feat: add BlogHero component with debounced URL-synced search"
```

---

### Task 6: `components/shared/blog/filters-bar.jsx`

**Files:**
- Create: `components/shared/blog/filters-bar.jsx`

**Interfaces:**
- Consumes: `buildBlogHref` from `@/lib/blog-url` (Task 1); `useRouter` from `next/navigation`.
- Produces: default export `BlogFiltersBar({ categories, tags, currentParams })`, used by Task 8. `categories`/`tags` are `[{ name, slug, count }]` (from `getBlogPageData`, Task 2). `currentParams` is `{ q, category, tag, sort, page }`.

- [ ] **Step 1: Write `components/shared/blog/filters-bar.jsx`**

```jsx
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
```

- [ ] **Step 2: Manually verify with a scratch route**

```bash
mkdir -p "app/(user)/_scratch-filters-check"
cat > "app/(user)/_scratch-filters-check/page.jsx" <<'EOF'
import BlogFiltersBar from "@/components/shared/blog/filters-bar";

const categories = [
  { name: "Community", slug: "community", count: 3 },
  { name: "Case Studies", slug: "case-studies", count: 1 },
];
const tags = Array.from({ length: 10 }, (_, i) => ({
  name: `Tag ${i + 1}`, slug: `tag-${i + 1}`, count: 10 - i,
}));

export default function ScratchCheck() {
  return <BlogFiltersBar categories={categories} tags={tags} currentParams={{ category: "community", sort: "popular" }} />;
}
EOF
npm run dev > /tmp/bls-dev.log 2>&1 &
sleep 3
PORT=$(grep -oE "localhost:[0-9]+" /tmp/bls-dev.log | head -1 | cut -d: -f2)
curl -s "http://localhost:$PORT/_scratch-filters-check" -o /tmp/filters-check.html -w "HTTP %{http_code}\n"
grep -o 'href="/blog[^"]*"' /tmp/filters-check.html
grep -o "+2 more" /tmp/filters-check.html
```

Expected: HTTP 200; hrefs include `/blog?sort=popular` (the "All" pill, since it clears `category` while keeping `sort`), `/blog?category=case-studies&sort=popular` (the inactive category pill), and `/blog` (the active "Community" pill toggling itself off). `+2 more` is present (10 tags − 8 visible = 2 hidden). Open the page in a real browser to confirm clicking "+2 more" reveals the remaining tags and the sort `<select>` shows "Most popular" selected.

Clean up:
```bash
rm -rf "app/(user)/_scratch-filters-check"
kill %1 2>/dev/null
```

- [ ] **Step 3: Commit**

```bash
git add components/shared/blog/filters-bar.jsx
git commit -m "feat: add BlogFiltersBar component for category/tag/sort filtering"
```

---

### Task 7: Extend `components/shared/blog/article.jsx` with results count and a no-results state

**Files:**
- Modify: `components/shared/blog/article.jsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `ArticleGrid` gains two new optional props: `total` (number) and `hasActiveFilters` (boolean), used by Task 8. `ArticleCard` is unchanged.

- [ ] **Step 1: Update `ArticleGrid` in `components/shared/blog/article.jsx`**

Replace the existing `ArticleGrid` function (lines 84–105) with:

```jsx
const ArticleGrid = ({ posts, total, hasActiveFilters }) => {
  const items = posts || [];

  return (
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-8xl mx-auto">
        {items.length === 0 ? (
          hasActiveFilters ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg font-medium">No articles match your search or filters.</p>
              <p className="text-sm mt-1">
                <Link href="/blog" className="text-primary hover:underline">Clear search and filters</Link> to see all articles.
              </p>
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg font-medium">No articles published yet.</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          )
        ) : (
          <>
            {typeof total === "number" && (
              <p className="text-sm text-gray-500 mb-8">
                {total} article{total === 1 ? "" : "s"} found
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {items.map((article, index) => (
                <ArticleCard key={article.id || index} {...article} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
```

`Link` from `next/link` is already imported at the top of this file (used by `ArticleCard`), so no new import is needed.

- [ ] **Step 2: Manually verify with a scratch route**

```bash
mkdir -p "app/(user)/_scratch-grid-check"
cat > "app/(user)/_scratch-grid-check/page.jsx" <<'EOF'
import ArticleGrid from "@/components/shared/blog/article";

export default function ScratchCheck() {
  return (
    <div className="space-y-4">
      <ArticleGrid posts={[]} total={0} hasActiveFilters={true} />
      <ArticleGrid posts={[]} total={0} hasActiveFilters={false} />
      <ArticleGrid
        posts={[{ id: "1", title: "Sample Post", author: "Blue Sands Academy", date: "04 Aug 2026", excerpt: "A sample.", tags: [] }]}
        total={7}
        hasActiveFilters={false}
      />
    </div>
  );
}
EOF
npm run dev > /tmp/bls-dev.log 2>&1 &
sleep 3
PORT=$(grep -oE "localhost:[0-9]+" /tmp/bls-dev.log | head -1 | cut -d: -f2)
curl -s "http://localhost:$PORT/_scratch-grid-check" -o /tmp/grid-check.html -w "HTTP %{http_code}\n"
grep -o "No articles match your search" /tmp/grid-check.html
grep -o "No articles published yet" /tmp/grid-check.html
grep -o "7 articles found" /tmp/grid-check.html
```

Expected: HTTP 200; both empty-state messages present (one per `ArticleGrid` instance); `7 articles found` present for the third instance.

Clean up:
```bash
rm -rf "app/(user)/_scratch-grid-check"
kill %1 2>/dev/null
```

- [ ] **Step 3: Commit**

```bash
git add components/shared/blog/article.jsx
git commit -m "feat: add results count and no-results empty state to ArticleGrid"
```

---

### Task 8: Wire it all together in `app/(user)/blog/page.jsx`

**Files:**
- Modify: `app/(user)/blog/page.jsx`

**Interfaces:**
- Consumes: `getBlogPageData` from `@/lib/blog-queries` (Task 2); `BlogHero` (Task 5); `BlogFiltersBar` (Task 6); `FeaturedSpotlight` (Task 4); `ArticleGrid` (Task 7, updated); `BlogPagination` (Task 3).
- Produces: the complete `/blog` page. Nothing downstream depends on this file.

- [ ] **Step 1: Rewrite `app/(user)/blog/page.jsx`**

```jsx
import { getBlogPageData } from "@/lib/blog-queries";
import BlogHero from "@/components/shared/blog/hero";
import BlogFiltersBar from "@/components/shared/blog/filters-bar";
import FeaturedSpotlight from "@/components/shared/blog/featured-spotlight";
import ArticleGrid from "@/components/shared/blog/article";
import BlogPagination from "@/components/shared/blog/pagination";

export const revalidate = 60;

export default async function BlogPage({ searchParams }) {
  const sp = await searchParams;

  const currentParams = {
    q: sp.q || "",
    category: sp.category || "",
    tag: sp.tag || "",
    sort: sp.sort || "newest",
    page: Number(sp.page) || 1,
  };

  const data = await getBlogPageData(currentParams);
  const hasActiveFilters = Boolean(currentParams.q || currentParams.category || currentParams.tag);

  return (
    <div>
      <BlogHero currentParams={currentParams} />
      <BlogFiltersBar categories={data.categories} tags={data.tags} currentParams={currentParams} />
      {data.isDefaultView && <FeaturedSpotlight post={data.featuredPost} />}
      <ArticleGrid posts={data.posts} total={data.total} hasActiveFilters={hasActiveFilters} />
      <BlogPagination
        page={data.page}
        totalPages={data.totalPages}
        currentParams={{ q: currentParams.q, category: currentParams.category, tag: currentParams.tag, sort: currentParams.sort }}
      />
    </div>
  );
}
```

Note: the original file also imported `NewsletterSection` from `@/components/shared/blog/newsletter`, but never rendered it — pre-existing dead code. This rewrite drops that import entirely rather than carrying it forward.

- [ ] **Step 2: End-to-end manual verification against the live page**

Start (or confirm) the dev server is running, then exercise every scenario from the spec's Testing section:

```bash
npm run dev > /tmp/bls-dev.log 2>&1 &
sleep 3
PORT=$(grep -oE "localhost:[0-9]+" /tmp/bls-dev.log | head -1 | cut -d: -f2)
BASE="http://localhost:$PORT"

echo "-- default view: hero + spotlight + grid, no pagination controls needed if <=12 posts --"
curl -s "$BASE/blog" -o /tmp/blog-default.html -w "HTTP %{http_code}\n"
grep -o "The Blue Sands Blog" /tmp/blog-default.html
grep -o "Featured" /tmp/blog-default.html | head -1

echo "-- search matches title/excerpt/tags via search_vector --"
curl -s "$BASE/blog?q=STEM" -o /tmp/blog-search.html -w "HTTP %{http_code}\n"
grep -o "articles found" /tmp/blog-search.html
grep -c "Featured" /tmp/blog-search.html   # expect 0 -- spotlight hidden when searching

echo "-- category filter combined with pagination stays correct (regression check) --"
CATEGORY_SLUG=$(curl -s "$BASE/blog" | grep -oE 'href="/blog\?category=[a-z-]+' | head -1 | sed 's/.*category=//')
echo "using category: $CATEGORY_SLUG"
curl -s "$BASE/blog?category=$CATEGORY_SLUG&page=1" -o /tmp/blog-cat-p1.html -w "HTTP %{http_code}\n"
grep -o "articles found" /tmp/blog-cat-p1.html

echo "-- page beyond last page clamps instead of showing empty grid --"
curl -s "$BASE/blog?page=999" -o /tmp/blog-overpage.html -w "HTTP %{http_code}\n"
grep -o "No articles published yet" /tmp/blog-overpage.html   # expect NOT present if any posts exist
grep -c 'class="group cursor-pointer"' /tmp/blog-overpage.html # expect > 0 if any published posts exist

echo "-- pagination links work without JS (real hrefs) --"
grep -o 'href="/blog?[^"]*page=2[^"]*"' /tmp/blog-default.html || echo "(no page 2 link -- fine if <=12 published posts total)"
```

Expected:
- `/blog` returns HTTP 200, contains the hero heading `The Blue Sands Blog`, and shows a `Featured` badge (spotlight visible on default view).
- `/blog?q=STEM` returns HTTP 200, shows an `articles found` count line, and has **zero** occurrences of `Featured` (spotlight correctly hidden while searching).
- `/blog?category=<slug>&page=1` returns HTTP 200 with a valid `articles found` count — confirms the filter-then-paginate fix works (no crash, no wrong count).
- `/blog?page=999` returns HTTP 200 and — if any posts are published — does **not** show "No articles published yet" (confirms clamping to the last valid page rather than rendering an empty grid).
- If total published posts exceed 12, a `page=2` link is present in the default view's pagination.

Then open `$BASE/blog` in an actual browser and manually confirm:
- Typing in the search box updates results after ~300ms without a full page reload feel (though it is a real navigation via `router.replace`, so the URL bar updates).
- Clicking a category pill, then a tag chip, both narrow the grid and the spotlight disappears.
- Clicking a category pill a second time deselects it.
- Changing the sort dropdown reorders results.
- Numbered pagination at the bottom navigates between pages and highlights the active page.

- [ ] **Step 3: Commit**

```bash
git add "app/(user)/blog/page.jsx"
git commit -m "feat: wire hero, filters, spotlight, and pagination into the blog listing page"
```

---

## Plan Self-Review

**Spec coverage:**
- Hero with tagline + debounced search → Task 5, wired in Task 8. ✅
- Filters bar (category, tags, sort) → Task 6, wired in Task 8. ✅
- Featured spotlight, shown only on true default view → Task 4, gated in Task 8 via `data.isDefaultView`. ✅
- Results grid with count + distinct empty states → Task 7. ✅
- Numbered, `<Link>`-based, crawlable pagination → Task 3. ✅
- Dedicated query layer, filter-before-paginate fix, total count, real facet computation → Task 2. ✅
- `page` beyond last page clamps → handled in `getBlogPageData` (Task 2, `Math.min(Math.max(1, page), totalPages)`), verified in Task 8 Step 2. ✅
- Category/tag options never include zero-post entries → `getCategoryFacets`/`getTagFacets` only aggregate from `publishedIds`-linked rows, so a category/tag with no published posts never appears. ✅
- `/api/blog` contract untouched → confirmed no task modifies `app/api/blog/**`. ✅

**Placeholder scan:** No "TBD"/"TODO"/"handle edge cases" language; every step has real code or a concrete, runnable verification command.

**Type consistency:** `getBlogPageData` returns `{ posts, total, page, totalPages, categories, tags, isDefaultView, featuredPost }` (Task 2) — Task 8 destructures exactly these fields. `buildBlogHref(current, overrides)` (Task 1) is called with the same two-argument shape in Tasks 3, 5, and 6. `currentParams` consistently means `{ q, category, tag, sort, page }` (or a subset) across Tasks 3, 5, 6, 8.

