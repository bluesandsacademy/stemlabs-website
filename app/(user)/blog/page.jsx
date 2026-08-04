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
