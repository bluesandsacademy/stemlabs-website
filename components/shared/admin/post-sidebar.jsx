"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight, X, Upload } from "lucide-react";

// ── Atoms ──────────────────────────────────────────────────────────────────────
export function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:bg-gray-50/80 transition-colors">
        {title}
        {open
          ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function Label({ children, hint }) {
  return (
    <label className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium text-gray-600">{children}</span>
      {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
    </label>
  );
}

function Input({ ...props }) {
  return (
    <input
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
      {...props}
    />
  );
}

function Textarea({ ...props }) {
  return (
    <textarea
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-shadow"
      {...props}
    />
  );
}

function Toggle({ id, checked, onChange, label }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
      <div className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-gray-200"}`}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only" />
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
  );
}

// ── SEO score ──────────────────────────────────────────────────────────────────
function SeoScore({ title, metaTitle, metaDescription, focusKeyword, content }) {
  const checks = [
    { label: "Title present", ok: !!title?.trim() },
    { label: "Meta description ≤ 160 chars", ok: metaDescription?.trim().length > 0 && metaDescription.length <= 160 },
    { label: "Meta title ≤ 60 chars", ok: metaTitle?.trim().length > 0 && metaTitle.length <= 60 },
    { label: "Focus keyword in title", ok: !!focusKeyword && title?.toLowerCase().includes(focusKeyword.toLowerCase()) },
    { label: "Content has headings", ok: content?.content?.some?.((n) => n.type === "heading") },
  ];
  const score = checks.filter((c) => c.ok).length;
  const pct = (score / checks.length) * 100;
  const color = score >= 4 ? "#16a34a" : score >= 2 ? "#d97706" : "#dc2626";
  const label = score >= 4 ? "Good" : score >= 2 ? "Needs work" : "Poor";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">SEO score</span>
        <span className="text-xs font-bold" style={{ color }}>{label} · {score}/{checks.length}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="space-y-1.5">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-2 text-xs">
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${c.ok ? "bg-green-100" : "bg-gray-100"}`}>
              <span className={c.ok ? "text-green-600" : "text-gray-300"}>
                {c.ok ? "✓" : "○"}
              </span>
            </div>
            <span className={c.ok ? "text-gray-700" : "text-gray-400"}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// POST SIDEBAR
// =============================================================================
export default function PostSidebar({
  // Publish
  status, onStatusChange,
  author, onAuthorChange,
  publishDate, onPublishDateChange,
  featured, onFeaturedChange,
  allowComments, onAllowCommentsChange,
  // Cover
  coverPreview, onCoverSelect, onCoverRemove,
  // Tags
  tags, onTagsChange,
  // Category
  category, onCategoryChange,
  // SEO
  title, content,
  slug, onSlugChange,
  metaTitle, onMetaTitleChange,
  metaDescription, onMetaDescriptionChange,
  focusKeyword, onFocusKeywordChange,
  canonicalUrl, onCanonicalUrlChange,
}) {
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [isDragOverCover, setIsDragOverCover] = useState(false);
  const coverInputRef = useRef(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { onTagsChange([...tags, t]); setTagInput(""); }
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setIsDragOverCover(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) onCoverSelect(file);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Status & Publish ─────────────────────────────────────────────── */}
      <Section title="Publish">
        <div>
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <Label>Author</Label>
          <Input
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            placeholder="Author name"
          />
        </div>

        {(status === "scheduled" || status === "published") && (
          <div>
            <Label>Publish date</Label>
            <Input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => onPublishDateChange(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-3 pt-1">
          <Toggle id="featured" checked={featured} onChange={(e) => onFeaturedChange(e.target.checked)} label="Featured post" />
          <Toggle id="allow-comments" checked={allowComments} onChange={(e) => onAllowCommentsChange(e.target.checked)} label="Allow comments" />
        </div>
      </Section>

      {/* ── Cover Image ──────────────────────────────────────────────────── */}
      <Section title="Cover Image">
        {coverPreview ? (
          <div className="relative group">
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={coverPreview}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized={coverPreview.startsWith("blob:")}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
            <button
              type="button"
              onClick={onCoverRemove}
              className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow"
            >
              <X className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="mt-2 w-full text-xs text-gray-500 hover:text-primary text-center transition-colors"
            >
              Replace image
            </button>
          </div>
        ) : (
          <div
            onClick={() => coverInputRef.current?.click()}
            onDrop={handleCoverDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOverCover(true); }}
            onDragLeave={() => setIsDragOverCover(false)}
            className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer gap-2 transition-colors
              ${isDragOverCover ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"}`}
          >
            <Upload className={`w-5 h-5 ${isDragOverCover ? "text-primary" : "text-gray-300"}`} />
            <span className="text-xs text-gray-400">
              {isDragOverCover ? "Drop to upload" : "Click or drag image here"}
            </span>
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onCoverSelect(f); }}
        />
      </Section>

      {/* ── Tags & Category ──────────────────────────────────────────────── */}
      <Section title="Tags & Category">
        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add tag, press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors shrink-0"
            >
              +
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {t}
                  <button
                    type="button"
                    onClick={() => onTagsChange(tags.filter((x) => x !== t))}
                    className="hover:text-primary/60 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          {categories.length > 0 ? (
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          ) : (
            <Input
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="e.g. Lesson Ideas"
            />
          )}
        </div>
      </Section>

      {/* ── SEO & Metadata ───────────────────────────────────────────────── */}
      <Section title="SEO & Metadata" defaultOpen={false}>
        <div>
          <Label>URL Slug</Label>
          <div className="text-[10px] text-gray-400 mb-1 truncate">/blog/<span className="text-gray-600 font-medium">{slug || "auto-generated"}</span></div>
          <Input
            value={slug}
            onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="custom-url-slug"
          />
        </div>

        <div>
          <Label hint={<span className={metaTitle.length > 60 ? "text-red-500 font-medium" : ""}>{metaTitle.length}/60</span>}>
            Meta title
          </Label>
          <Input
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder="SEO title (defaults to post title)"
            maxLength={70}
          />
        </div>

        <div>
          <Label hint={<span className={metaDescription.length > 160 ? "text-red-500 font-medium" : ""}>{metaDescription.length}/160</span>}>
            Meta description
          </Label>
          <Textarea
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="Description for search engines…"
            rows={3}
            maxLength={180}
          />
        </div>

        <div>
          <Label>Focus keyword</Label>
          <Input
            value={focusKeyword}
            onChange={(e) => onFocusKeywordChange(e.target.value)}
            placeholder="e.g. STEM education"
          />
        </div>

        <div>
          <Label>Canonical URL</Label>
          <Input
            value={canonicalUrl}
            onChange={(e) => onCanonicalUrlChange(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <SeoScore
          title={title}
          metaTitle={metaTitle}
          metaDescription={metaDescription}
          focusKeyword={focusKeyword}
          content={content}
        />
      </Section>
    </div>
  );
}
