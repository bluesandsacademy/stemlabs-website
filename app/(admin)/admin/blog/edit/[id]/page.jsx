"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import RichEditor from "@/components/shared/admin/rich-editor";
import PostSidebar from "@/components/shared/admin/post-sidebar";
import { ArrowLeft, Save, Send, ExternalLink } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-700",
  scheduled: "bg-blue-100 text-blue-700",
  archived: "bg-orange-100 text-orange-700",
};

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [postSlug, setPostSlug] = useState("");

  // Core
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");

  // Publish
  const [status, setStatus] = useState("draft");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  // Cover image
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [existingCover, setExistingCover] = useState("");
  const [existingCoverId, setExistingCoverId] = useState("");

  // Tags & category
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");

  // SEO
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  // Load existing post
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        if (!res.ok) throw new Error("Not found");
        const post = await res.json();

        setTitle(post.title || "");
        setExcerpt(post.excerpt || "");
        setAuthor(post.author || "");
        setStatus(post.status || "draft");
        setPublishDate(post.publish_date ? post.publish_date.slice(0, 16) : "");
        setExistingCover(post.cover_image || "");
        setExistingCoverId(post.cover_image_public_id || "");
        if (post.cover_image) setCoverPreview(post.cover_image);
        setPostSlug(post.slug || "");
        setSlug(post.slug || "");
        setMetaTitle(post.seo_title || post.title || "");
        setMetaDescription(post.seo_description || post.excerpt || "");
        setCanonicalUrl(post.canonical_url || "");
        setTags((post.tags || []).map((t) => (typeof t === "string" ? t : t.label)));
        setCategory(post.categories?.[0]?.name || "");
        setAllowComments(post.allow_comments !== false);
        setFeatured(post.featured || false);
        if (post.content?.type === "doc") setContent(post.content);
      } catch {
        toast.error("Post not found");
        router.push("/admin/blog");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, router]);

  const buildBody = useCallback(async (overrideStatus) => {
    let cover_image = existingCover;
    let cover_image_public_id = existingCoverId;
    if (coverFile) {
      const fd = new FormData();
      fd.append("file", coverFile);
      const r = await fetch("/api/blog/upload", { method: "POST", body: fd });
      if (!r.ok) throw new Error("Cover upload failed");
      const { files } = await r.json();
      cover_image = files[0]?.url || "";
      cover_image_public_id = files[0]?.public_id || "";
      setCoverFile(null);
      setExistingCover(cover_image);
      setExistingCoverId(cover_image_public_id);
    }
    const finalStatus = overrideStatus || status;
    return {
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content || { type: "doc", content: [] },
      author: author.trim() || "Blue Sands Academy",
      cover_image, cover_image_public_id,
      status: finalStatus,
      tags: tags.map((label) => ({ label, color: "primary" })),
      category: category.trim() || undefined,
      allow_comments: allowComments,
      featured,
      seo_title: metaTitle.trim() || title.trim(),
      seo_description: metaDescription.trim() || undefined,
      canonical_url: canonicalUrl.trim() || undefined,
      publish_date:
        publishDate
          ? new Date(publishDate).toISOString()
          : finalStatus === "published"
          ? new Date().toISOString()
          : undefined,
    };
  }, [title, excerpt, content, author, status, coverFile, existingCover, existingCoverId,
      tags, category, allowComments, featured, metaTitle, metaDescription, canonicalUrl, publishDate]);

  const save = useCallback(async (overrideStatus, silent = false) => {
    if (!title.trim()) { if (!silent) toast.error("Title is required"); return; }
    setIsSubmitting(true);
    try {
      const body = await buildBody(overrideStatus);
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setIsDirty(false);
      if (!silent && overrideStatus) {
        toast.success(overrideStatus === "published" ? "Post published!" : "Saved!");
        if (overrideStatus === "published") setStatus("published");
      }
    } catch (err) {
      if (!silent) toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [id, title, buildBody]);

  // Auto-save every 45 seconds when there are unsaved changes
  useEffect(() => {
    if (isLoading || !isDirty) return;
    const timer = setInterval(() => save(undefined, true), 45_000);
    return () => clearInterval(timer);
  }, [isLoading, isDirty, save]);

  // Mark dirty whenever editable state changes (after load)
  useEffect(() => {
    if (!isLoading) setIsDirty(true);
  }, [title, excerpt, content, author, status, coverFile, tags, category,
      allowComments, featured, metaTitle, metaDescription, canonicalUrl, publishDate]);

  // Ctrl+S / Cmd+S → save
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveRef.current(undefined, false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 -mb-8 flex items-center justify-center bg-white" style={{ minHeight: "calc(100vh - 4rem)" }}>
        <div className="space-y-4 w-full max-w-xl px-6 animate-pulse">
          <div className="h-10 bg-gray-100 rounded-xl w-3/4" />
          <div className="h-5 bg-gray-100 rounded w-1/2" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 -mb-8 flex flex-col bg-white" style={{ minHeight: "calc(100vh - 4rem)" }}>

      {/* ── Action bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 shrink-0">
        <Link
          href="/admin/blog"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> Blog
        </Link>
        <div className="h-5 w-px bg-gray-200" />
        <span className="text-sm text-gray-400 truncate hidden sm:block max-w-60">
          {title || "Edit Post"}
        </span>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          {postSlug && (
            <Link
              href={`/blog/${postSlug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Preview
            </Link>
          )}
          <span className={`hidden sm:inline text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[status] || STATUS_COLORS.draft}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {isDirty && !isSubmitting && (
            <span className="hidden sm:inline text-xs text-gray-400">Unsaved</span>
          )}
          <button
            onClick={() => save(undefined, false)}
            disabled={isSubmitting}
            title="Save · Ctrl+S"
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{isSubmitting ? "Saving…" : "Save"}</span>
          </button>
          <button
            onClick={() => save("published", false)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isSubmitting ? "Saving…" : status === "published" ? "Update" : "Publish"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Editor column */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[720px] mx-auto px-4 sm:px-10 pt-10 pb-20">

            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title…"
              className="w-full text-4xl font-extrabold text-gray-900 bg-transparent outline-none placeholder-gray-200 leading-tight mb-4"
            />

            {/* Excerpt */}
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Add a short excerpt or summary…"
              rows={2}
              className="w-full text-lg text-gray-500 bg-transparent outline-none placeholder-gray-300 resize-none leading-relaxed mb-6"
            />

            <div className="border-t border-gray-100 mb-6" />

            {/* Rich editor */}
            <RichEditor
              value={content}
              onChange={(v) => { setContent(v); }}
              placeholder="Start writing your post…"
              savedAt={savedAt}
            />
          </div>
        </div>

        {/* Settings sidebar */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 border-l border-gray-100 bg-gray-50/50 overflow-y-auto">
          <PostSidebar
            status={status} onStatusChange={setStatus}
            author={author} onAuthorChange={setAuthor}
            publishDate={publishDate} onPublishDateChange={setPublishDate}
            featured={featured} onFeaturedChange={setFeatured}
            allowComments={allowComments} onAllowCommentsChange={setAllowComments}
            coverPreview={coverPreview}
            onCoverSelect={(file) => { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }}
            onCoverRemove={() => { setCoverFile(null); setCoverPreview(""); setExistingCover(""); setExistingCoverId(""); }}
            tags={tags} onTagsChange={setTags}
            category={category} onCategoryChange={setCategory}
            title={title} content={content}
            slug={slug} onSlugChange={setSlug}
            metaTitle={metaTitle} onMetaTitleChange={setMetaTitle}
            metaDescription={metaDescription} onMetaDescriptionChange={setMetaDescription}
            focusKeyword={focusKeyword} onFocusKeywordChange={setFocusKeyword}
            canonicalUrl={canonicalUrl} onCanonicalUrlChange={setCanonicalUrl}
          />
        </aside>
      </div>
    </div>
  );
}
