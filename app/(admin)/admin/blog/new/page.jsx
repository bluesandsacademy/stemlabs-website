"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import RichEditor from "@/components/shared/admin/rich-editor";
import PostSidebar from "@/components/shared/admin/post-sidebar";
import { ArrowLeft, Save, Send } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-700",
  scheduled: "bg-blue-100 text-blue-700",
  archived: "bg-orange-100 text-orange-700",
};

export default function NewPostPage() {
  const router = useRouter();

  // Core
  const [content, setContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");

  // Publish
  const [status, setStatus] = useState("draft");
  const [author, setAuthor] = useState("Blue Sands Academy");
  const [publishDate, setPublishDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  // Cover image
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  // Tags & category
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");

  // SEO
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const autoSlug = (t) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (!slug) setSlug(autoSlug(e.target.value));
    if (!metaTitle) setMetaTitle(e.target.value.slice(0, 60));
  };

  const handleSave = useCallback(async (overrideStatus) => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setIsSubmitting(true);
    try {
      let cover_image = "", cover_image_public_id = "";
      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        const r = await fetch("/api/blog/upload", { method: "POST", body: fd });
        if (!r.ok) throw new Error("Cover upload failed");
        const { files } = await r.json();
        cover_image = files[0]?.url || "";
        cover_image_public_id = files[0]?.public_id || "";
      }

      const finalStatus = overrideStatus || status;
      const body = {
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
        seo_description: metaDescription.trim() || excerpt.trim() || undefined,
        canonical_url: canonicalUrl.trim() || undefined,
        publish_date:
          publishDate
            ? new Date(publishDate).toISOString()
            : finalStatus === "published"
            ? new Date().toISOString()
            : undefined,
      };

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to create post"); }
      const created = await res.json();

      if (finalStatus === "published") {
        toast.success("Post published!");
        router.push("/admin/blog");
      } else {
        toast.success("Draft saved!");
        router.push(`/admin/blog/edit/${created.id}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, excerpt, content, author, status, coverFile, tags, category,
      allowComments, featured, metaTitle, metaDescription, canonicalUrl, publishDate, slug, router]);

  // Ctrl+S / Cmd+S → save draft
  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveRef.current("draft");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    // Escape the admin layout's py-8 px-* padding to fill the viewport
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
          {title || "New Post"}
        </span>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className={`hidden sm:inline text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[status] || STATUS_COLORS.draft}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <button
            onClick={() => handleSave("draft")}
            disabled={isSubmitting}
            title="Save draft · Ctrl+S"
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{isSubmitting ? "Saving…" : "Save Draft"}</span>
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{isSubmitting ? "Publishing…" : "Publish"}</span>
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
              onChange={handleTitleChange}
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
              onChange={setContent}
              placeholder="Start writing your post…"
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
            onCoverRemove={() => { setCoverFile(null); setCoverPreview(""); }}
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
