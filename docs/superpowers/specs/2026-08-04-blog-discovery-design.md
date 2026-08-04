# Blog Discovery: Hero, Search, Filters & Pagination

**Date:** 2026-08-04
**Status:** Approved for planning

## Problem

`app/(user)/blog/page.jsx` renders every published post as a single unpaginated 3-column grid with no way to search or filter. It already computes a `featuredPost` (explicitly featured, or falls back to the most recent post) but never renders it — the post is silently excluded from the grid with nothing shown in its place. This works today with a handful of posts but breaks down as the archive grows toward 50–100 posts: no way to find older content, no sense of orientation on landing, and a growing page weight with no pagination.

## Goals

- Give the blog a proper hero section with a working search.
- Let visitors filter by category and tag, and sort results.
- Paginate results with real, crawlable URLs (SEO-friendly, works without JS).
- Actually render the featured post instead of silently dropping it.
- Fix a latent correctness bug: filtering-after-pagination would return wrong/short pages once tag/category filters combine with `limit`/`offset`.

## Non-goals

- No redesign of the single-post page (`app/(user)/blog/[id]/page.jsx`).
- No changes to the admin dashboard's blog management page or its `/api/blog` contract — it already has its own client-side search/filter pattern for admin use and stays as-is.
- No autocomplete/typeahead suggestion dropdown for search — full-text search-as-you-type covering title/excerpt/author/tags (via the existing `search_vector`) is sufficient at this scale.
- No infinite scroll — numbered pagination was chosen specifically for SEO/crawlability on a content-marketing blog.

## Design

### Page layout (top to bottom)

1. **Hero** — tagline + prominent search input. Debounced search-as-you-type updates the URL (`?q=...`).
2. **Filters bar** — category pills, top tag chips (with a "more tags" toggle), and a sort dropdown (Newest / Oldest / Most popular). Any change updates the URL and resets to page 1.
3. **Featured spotlight** — a large single-post card for the featured (or most recent) post. Shown **only** on the default view: no `q`, `category`, `tag`, or `page` param active. Once any filter/search/page is active, the spotlight disappears — "the featured post" isn't a meaningful concept inside filtered results.
4. **Results grid** — existing `ArticleGrid` cards, plus a "X articles found" line and a distinct "no results — try clearing your search or filters" empty state (separate from the existing "no articles published yet" state, which stays for the zero-posts-total case).
5. **Pagination** — real `<Link>`-based numbered controls (`?page=N`), 12 posts per page (4 rows × 3 columns), so page 2+ is reachable without JavaScript and is crawlable.

### Data & query layer

The public blog page queries Supabase directly in the server component today (not through `/api/blog`, which exists for the admin dashboard's client-side fetches and keeps its current contract untouched).

Add `lib/blog-queries.js`, used only by the public page:

- Resolves `category` / `tag` slugs to post-ID lists via the junction tables (`post_categories`, `post_tags`) **before** pagination. This is the correctness fix: the existing `/api/blog` route filters by tag/category *after* slicing with `.range()`, which silently returns wrong/short pages once tag/category filtering is combined with pagination. The new helper filters first, then paginates.
- Applies `.textSearch("search_vector", q, { type: "websearch" })` for search when `q` is present — same mechanism `/api/blog` already uses.
- Returns `{ posts, total }` so the page can compute total page count.
- Also returns categories (only those with ≥1 published post) and top tags by usage count among published posts — computed from real data, not the static seed list.
- Reads all state from `searchParams`: `q`, `category`, `tag`, `sort` (`newest` default | `oldest` | `popular`), `page` (default `1`).
- If `page` exceeds the last valid page, clamp to the last page rather than rendering an empty grid.

### Components

- `components/shared/blog/hero.jsx` (new, client) — tagline + search input. Debounces input (~300ms) and updates the URL via `router.replace`, preserving other active filters and resetting `page` to 1.
- `components/shared/blog/filters-bar.jsx` (new, client) — category pills, tag chips + "more" toggle, sort `<select>`. Same URL-sync approach as the hero search.
- `components/shared/blog/featured-spotlight.jsx` (new) — large single-post card. Reuses the site's existing visual language (rounded corners, primary-color accents, same typography scale) at a larger size than a grid card.
- `components/shared/blog/pagination.jsx` (new) — plain `<Link>`-based numbered controls with prev/next and the active page highlighted. No client-side-only routing — must work with JS disabled.
- `components/shared/blog/article.jsx` — existing `ArticleGrid`, extended with a results-count line and a new "no results for this search/filter" empty state (distinct from the current zero-posts state).

### Edge cases

- Zero published posts total → existing "no articles published yet" state stays as-is.
- Search/filter yields zero results → new "no matches, clear filters" state with a link that resets to `/blog`.
- `page` beyond the last page → clamp to the last valid page.
- Category or tag with zero published posts → not offered as a filter option (filtered out of the computed list, not hidden via CSS).

## Testing

- Verify search matches on title, excerpt, author, and tag content (via `search_vector`).
- Verify combining a tag filter with pagination returns correct, non-empty pages (regression test for the filter-after-pagination bug being fixed).
- Verify featured spotlight appears only on the true default view and disappears once any filter/search/page param is set.
- Verify pagination links work with JavaScript disabled (real `href`s, not click-handler-only navigation).
- Verify category/tag options never include ones with zero published posts.
