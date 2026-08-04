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
