"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import BlockEditor from "@/components/shared/admin/block-editor";

export default function NewPostModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    author: "",
    publishDate: "",
    tags: [],
    status: "draft",
    featuredImage: null,
    cover_image: "",
    cover_image_public_id: "",
    category: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const processImage = (file) => {
    setFormData((prev) => ({ ...prev, featuredImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processImage(file);
  };

  const submitPost = async (overrideStatus) => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      let cover_image = formData.cover_image;
      let cover_image_public_id = formData.cover_image_public_id;

      if (formData.featuredImage) {
        const fd = new FormData();
        fd.append("file", formData.featuredImage);
        const uploadRes = await fetch("/api/blog/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const { files } = await uploadRes.json();
        cover_image = files[0]?.url || "";
        cover_image_public_id = files[0]?.public_id || "";
      }

      const status = overrideStatus || formData.status;
      const postData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        content: { time: Date.now(), version: "1.0", blocks },
        author: formData.author.trim(),
        publish_date: formData.publishDate
          ? new Date(formData.publishDate).toISOString()
          : (status === "published" ? new Date().toISOString() : undefined),
        tags: formData.tags.map((label) => ({ label, color: "primary" })),
        cover_image,
        cover_image_public_id,
        category: formData.category.trim() || undefined,
        status,
      };

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create post");
      }
      const newPost = await res.json();

      toast.success(status === "published" ? "Post published!" : "Draft saved!");
      onSuccess?.(newPost);
      handleReset();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "", excerpt: "", author: "", publishDate: "",
      tags: [], status: "draft", featuredImage: null,
      cover_image: "", cover_image_public_id: "", category: "",
    });
    setBlocks([]);
    setTagInput("");
    setImagePreview(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-8 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Home</span><span>&gt;</span><span>Blog</span><span>&gt;</span>
            <span className="text-primary font-medium">New Post</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
              <p className="text-sm text-gray-600 mt-1">Create and manage blog post</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50 ${errors.title ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt <span className="text-gray-400 font-normal">(optional — auto-generated if empty)</span>
            </label>
            <input
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Short description shown in article cards..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50"
            />
          </div>

          {/* Content — Block Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 pl-12">
              <BlockEditor value={blocks} onChange={setBlocks} />
            </div>
          </div>

          {/* Author + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Written By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50 ${errors.author ? "border-red-300" : "border-gray-200"}`}
              />
              {errors.author && <p className="text-sm text-red-600 mt-1">{errors.author}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g. Lesson Ideas, STEM Education..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"}`}
            >
              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized={imagePreview.startsWith("data:")} />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-primary font-medium hover:underline">
                      Change Image
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, featuredImage: null, cover_image: "", cover_image_public_id: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) processImage(f); }} className="hidden" />
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Drag and drop or click to upload</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-primary font-medium hover:underline">
                    Choose File
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) processImage(f); }} className="hidden" />
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                placeholder="Add a tag and press Enter..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50"
              />
              <button type="button" onClick={handleAddTag} className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50 appearance-none cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50"
          >
            Reset Form
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => submitPost("draft")}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => submitPost("published")}
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
