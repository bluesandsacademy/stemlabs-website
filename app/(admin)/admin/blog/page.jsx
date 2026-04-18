"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import BlogPostCard from "@/components/shared/admin/card";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";

export default function BlogManagementPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch");
      setPosts(await res.json());
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  let filtered = posts
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => filterStatus === "all" || p.status === filterStatus);

  if (sortBy === "date")   filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortBy === "title")  filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === "author") filtered = [...filtered].sort((a, b) => a.author.localeCompare(b.author));
  if (sortBy === "status") filtered = [...filtered].sort((a, b) => a.status.localeCompare(b.status));

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            />
          </div>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
            <option value="date">Newest first</option>
            <option value="title">Title A–Z</option>
            <option value="author">Author</option>
            <option value="status">Status</option>
          </select>
        </div>

        <Link href="/admin/blog/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0">
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats row */}
      {!isLoading && posts.length > 0 && (
        <div className="flex gap-4 mb-6 text-sm text-gray-500">
          <span><strong className="text-gray-900">{posts.length}</strong> total</span>
          <span><strong className="text-green-600">{posts.filter((p) => p.status === "published").length}</strong> published</span>
          <span><strong className="text-gray-500">{posts.filter((p) => p.status === "draft").length}</strong> drafts</span>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((post) => (
            <BlogPostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {searchQuery || filterStatus !== "all" ? "No posts match" : "No posts yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery || filterStatus !== "all" ? "Try a different search or filter" : "Create your first post to get started"}
          </p>
          {!searchQuery && filterStatus === "all" && (
            <Link href="/admin/blog/new"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Create First Post
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
