"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

// ── Block type definitions ───────────────────────────────────────────────────
const BLOCK_TYPES = [
  { type: "paragraph",  label: "Paragraph",   icon: "¶",    desc: "Plain text paragraph" },
  { type: "heading",    label: "Heading",      icon: "H",    desc: "Section heading (H2–H4)" },
  { type: "image",      label: "Image",        icon: "🖼",   desc: "Single image with caption" },
  { type: "gallery",    label: "Gallery",      icon: "⊞",   desc: "Multiple images in a grid" },
  { type: "video",      label: "Video",        icon: "▶",    desc: "Upload video or embed YouTube" },
  { type: "quote",      label: "Quote",        icon: "❝",    desc: "Blockquote with attribution" },
  { type: "code",       label: "Code",         icon: "</>",  desc: "Code block with syntax highlighting" },
  { type: "callout",    label: "Callout",      icon: "ℹ",    desc: "Info / warning / success box" },
  { type: "list",       label: "List",         icon: "≡",    desc: "Ordered or unordered list" },
  { type: "divider",    label: "Divider",      icon: "—",    desc: "Visual horizontal separator" },
  { type: "embed",      label: "Embed",        icon: "⊕",   desc: "YouTube, Vimeo, Twitter embed" },
  { type: "html",       label: "Raw HTML",     icon: "<>",   desc: "Custom HTML (advanced)" },
];

const INITIAL_DATA = {
  paragraph: { text: "" },
  heading:   { text: "", level: 2 },
  image:     { url: "", public_id: "", caption: "", alt: "", width: null, height: null },
  gallery:   { images: [], columns: 3 },
  video:     { type: "cloudinary", url: "", public_id: "", poster: "", caption: "", embed_id: "" },
  quote:     { text: "", author: "", cite: "" },
  code:      { code: "", language: "javascript", filename: "" },
  callout:   { variant: "info", title: "", text: "" },
  list:      { style: "unordered", items: [""] },
  divider:   {},
  embed:     { service: "youtube", embed_id: "", caption: "" },
  html:      { html: "" },
};

// ── Tiny ID generator ────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

// ── Upload helper ─────────────────────────────────────────────────────────────
async function uploadFiles(files) {
  const fd = new FormData();
  for (const f of files) fd.append("file", f);
  const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const { files: results } = await res.json();
  return results;
}

// =============================================================================
// BLOCK EDITOR
// =============================================================================
export default function BlockEditor({ value = [], onChange }) {
  const [blocks, setBlocks] = useState(
    value.length ? value : [{ id: uid(), type: "paragraph", data: { text: "" } }]
  );
  const [addMenuAt, setAddMenuAt] = useState(null); // index where the add menu is open
  const [uploading, setUploading] = useState({});

  const update = useCallback((newBlocks) => {
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  }, [onChange]);

  const updateBlock = (id, data) => {
    update(blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b)));
  };

  const addBlock = (type, atIndex) => {
    const newBlock = { id: uid(), type, data: { ...INITIAL_DATA[type] } };
    const next = [...blocks];
    next.splice(atIndex + 1, 0, newBlock);
    update(next);
    setAddMenuAt(null);
  };

  const removeBlock = (id) => {
    if (blocks.length === 1) {
      update([{ id: uid(), type: "paragraph", data: { text: "" } }]);
    } else {
      update(blocks.filter((b) => b.id !== id));
    }
  };

  const moveBlock = (id, dir) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === blocks.length - 1) return;
    const next = [...blocks];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    update(next);
  };

  const handleUpload = async (id, files, onResult) => {
    setUploading((prev) => ({ ...prev, [id]: true }));
    try {
      const results = await uploadFiles(Array.from(files));
      onResult(results);
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-1">
      {blocks.map((block, idx) => (
        <div key={block.id} className="group relative">
          {/* Block controls */}
          <div className="absolute -left-10 top-2 hidden group-hover:flex flex-col items-center gap-1 z-10">
            <button
              type="button"
              onClick={() => moveBlock(block.id, "up")}
              disabled={idx === 0}
              className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-25 flex items-center justify-center shadow-sm text-xs"
              title="Move up"
            >↑</button>
            <button
              type="button"
              onClick={() => moveBlock(block.id, "down")}
              disabled={idx === blocks.length - 1}
              className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-25 flex items-center justify-center shadow-sm text-xs"
              title="Move down"
            >↓</button>
            <button
              type="button"
              onClick={() => removeBlock(block.id)}
              className="w-7 h-7 rounded bg-white border border-gray-200 text-red-400 hover:text-red-600 flex items-center justify-center shadow-sm text-xs"
              title="Delete block"
            >✕</button>
          </div>

          {/* Block content */}
          <BlockRenderer
            block={block}
            onChange={(data) => updateBlock(block.id, data)}
            uploading={!!uploading[block.id]}
            onUpload={(files, onResult) => handleUpload(block.id, files, onResult)}
          />

          {/* Add block between */}
          <div className="flex items-center gap-2 my-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex-1 h-px bg-gray-200" />
            <button
              type="button"
              onClick={() => setAddMenuAt(addMenuAt === idx ? null : idx)}
              className="text-xs text-gray-400 hover:text-primary border border-dashed border-gray-300 hover:border-primary rounded px-2 py-0.5 transition-colors"
            >
              + Add block
            </button>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Block type picker */}
          {addMenuAt === idx && (
            <BlockTypePicker onSelect={(type) => addBlock(type, idx)} onClose={() => setAddMenuAt(null)} />
          )}
        </div>
      ))}

      {/* Add block at end */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setAddMenuAt(blocks.length - 1)}
          className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:text-primary hover:border-primary transition-colors"
        >
          + Add a block
        </button>
        {addMenuAt === blocks.length - 1 && (
          <BlockTypePicker onSelect={(type) => addBlock(type, blocks.length - 1)} onClose={() => setAddMenuAt(null)} />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// BLOCK TYPE PICKER
// =============================================================================
function BlockTypePicker({ onSelect, onClose }) {
  return (
    <div className="relative z-20">
      <div className="absolute top-1 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="col-span-full flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Choose block type</span>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        {BLOCK_TYPES.map((bt) => (
          <button
            key={bt.type}
            type="button"
            onClick={() => onSelect(bt.type)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary text-left transition-colors border border-transparent hover:border-primary/20"
          >
            <span className="text-lg w-6 text-center shrink-0">{bt.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{bt.label}</p>
              <p className="text-xs text-gray-400 leading-tight">{bt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// BLOCK RENDERER  — renders the edit UI for each block type
// =============================================================================
function BlockRenderer({ block, onChange, uploading, onUpload }) {
  const { type, data } = block;
  const fileRef = useRef(null);

  const cls = "w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm";

  switch (type) {
    // ── Paragraph ────────────────────────────────────────────────────────────
    case "paragraph":
      return (
        <textarea
          value={data.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Start writing…"
          rows={3}
          className={`${cls} resize-y`}
        />
      );

    // ── Heading ──────────────────────────────────────────────────────────────
    case "heading":
      return (
        <div className="flex gap-2">
          <select
            value={data.level}
            onChange={(e) => onChange({ level: parseInt(e.target.value) })}
            className="shrink-0 border border-gray-200 rounded-lg bg-gray-50 px-2 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
          </select>
          <input
            type="text"
            value={data.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Heading text…"
            className={`${cls} flex-1 font-bold text-lg`}
          />
        </div>
      );

    // ── Image ────────────────────────────────────────────────────────────────
    case "image":
      return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {data.url ? (
            <div className="relative">
              <div className="relative w-full h-56">
                <Image src={data.url} alt={data.alt || ""} fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => onChange({ url: "", public_id: "" })}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-700"
              >✕</button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors gap-2"
            >
              {uploading ? (
                <span className="text-sm text-gray-500 animate-pulse">Uploading…</span>
              ) : (
                <>
                  <span className="text-3xl text-gray-300">🖼</span>
                  <span className="text-sm text-gray-400">Click to upload image</span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files;
              if (f?.length) {
                onUpload(f, ([r]) => onChange({ url: r.url, public_id: r.public_id, width: r.width, height: r.height }));
              }
            }}
          />
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-gray-200 bg-white">
            <input className={cls} placeholder="Caption…" value={data.caption} onChange={(e) => onChange({ caption: e.target.value })} />
            <input className={cls} placeholder="Alt text (for accessibility)…" value={data.alt} onChange={(e) => onChange({ alt: e.target.value })} />
          </div>
        </div>
      );

    // ── Gallery ──────────────────────────────────────────────────────────────
    case "gallery":
      return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Gallery</span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Columns:</label>
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange({ columns: n })}
                  className={`w-7 h-7 rounded text-xs font-medium border transition-colors ${data.columns === n ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-300 hover:border-primary"}`}
                >{n}</button>
              ))}
            </div>
          </div>

          {/* Existing images */}
          {data.images?.length > 0 && (
            <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${data.columns || 3}, 1fr)` }}>
              {data.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded overflow-hidden group">
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => onChange({ images: data.images.filter((_, j) => j !== i) })}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Add images */}
          <div
            onClick={() => fileRef.current?.click()}
            className="h-20 flex items-center justify-center cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary text-sm text-gray-400 hover:text-primary transition-colors gap-2"
          >
            {uploading ? (
              <span className="animate-pulse">Uploading…</span>
            ) : (
              <>⊞ Add images</>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const f = e.target.files;
              if (f?.length) {
                onUpload(f, (results) => {
                  const newImages = results.map((r) => ({ url: r.url, public_id: r.public_id, caption: "", alt: "" }));
                  onChange({ images: [...(data.images || []), ...newImages] });
                });
              }
            }}
          />
        </div>
      );

    // ── Video ────────────────────────────────────────────────────────────────
    case "video":
      return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Source:</label>
            {["cloudinary", "youtube", "vimeo"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ type: s, url: "", embed_id: "", public_id: "" })}
                className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${data.type === s ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-300 hover:border-primary"}`}
              >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>

          {data.type === "cloudinary" ? (
            <div>
              {data.url ? (
                <div className="relative rounded overflow-hidden bg-black">
                  <video src={data.url} controls poster={data.poster || undefined} className="w-full max-h-64" />
                  <button
                    type="button"
                    onClick={() => onChange({ url: "", public_id: "", poster: "" })}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs"
                  >✕</button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="h-36 flex flex-col items-center justify-center cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors gap-1"
                >
                  {uploading ? (
                    <span className="text-sm text-gray-500 animate-pulse">Uploading video…</span>
                  ) : (
                    <>
                      <span className="text-3xl">▶</span>
                      <span className="text-sm text-gray-400">Click to upload video</span>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files;
                  if (f?.length) {
                    onUpload(f, ([r]) => onChange({ url: r.url, public_id: r.public_id, poster: r.thumbnail_url || "" }));
                  }
                }}
              />
            </div>
          ) : (
            <input
              className={cls}
              placeholder={data.type === "youtube" ? "YouTube video ID (e.g. dQw4w9WgXcQ)" : "Vimeo video ID"}
              value={data.embed_id}
              onChange={(e) => onChange({ embed_id: e.target.value })}
            />
          )}
          <input className={cls} placeholder="Caption (optional)…" value={data.caption} onChange={(e) => onChange({ caption: e.target.value })} />
        </div>
      );

    // ── Quote ────────────────────────────────────────────────────────────────
    case "quote":
      return (
        <div className="border-l-4 border-primary pl-4 bg-primary/5 rounded-r-lg p-3 space-y-2">
          <textarea
            value={data.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Quote text…"
            rows={2}
            className={`${cls} resize-none italic`}
          />
          <div className="grid grid-cols-2 gap-2">
            <input className={cls} placeholder="— Author name" value={data.author} onChange={(e) => onChange({ author: e.target.value })} />
            <input className={cls} placeholder="Source / citation" value={data.cite} onChange={(e) => onChange({ cite: e.target.value })} />
          </div>
        </div>
      );

    // ── Code ─────────────────────────────────────────────────────────────────
    case "code":
      return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-900">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
            <input
              className="bg-transparent text-gray-400 text-xs outline-none placeholder-gray-600 flex-1 min-w-0"
              placeholder="filename.js"
              value={data.filename}
              onChange={(e) => onChange({ filename: e.target.value })}
            />
            <select
              value={data.language}
              onChange={(e) => onChange({ language: e.target.value })}
              className="bg-gray-700 text-gray-300 text-xs rounded px-2 py-1 outline-none ml-2"
            >
              {["javascript","typescript","python","html","css","sql","bash","json","jsx","tsx","go","rust","java","php","ruby","swift","kotlin","c","cpp","csharp"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <textarea
            value={data.code}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="// Paste your code here…"
            rows={6}
            className="w-full bg-gray-900 text-green-400 font-mono text-sm px-4 py-3 outline-none resize-y"
            spellCheck={false}
          />
        </div>
      );

    // ── Callout ──────────────────────────────────────────────────────────────
    case "callout": {
      const variantStyles = {
        info:    "border-blue-300 bg-blue-50 text-blue-800",
        warning: "border-yellow-300 bg-yellow-50 text-yellow-800",
        success: "border-green-300 bg-green-50 text-green-800",
        danger:  "border-red-300 bg-red-50 text-red-800",
      };
      const icons = { info: "ℹ", warning: "⚠", success: "✓", danger: "✕" };
      return (
        <div className={`border-l-4 rounded-r-lg p-3 space-y-2 ${variantStyles[data.variant]}`}>
          <div className="flex items-center gap-2">
            {["info","warning","success","danger"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange({ variant: v })}
                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${data.variant === v ? "ring-2 ring-offset-1 ring-current" : "opacity-50 hover:opacity-100"}`}
              >{icons[v]} {v}</button>
            ))}
          </div>
          <input className={cls} placeholder="Title (optional)…" value={data.title} onChange={(e) => onChange({ title: e.target.value })} />
          <textarea className={`${cls} resize-none`} rows={2} placeholder="Callout content…" value={data.text} onChange={(e) => onChange({ text: e.target.value })} />
        </div>
      );
    }

    // ── List ─────────────────────────────────────────────────────────────────
    case "list":
      return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            {["unordered","ordered"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ style: s })}
                className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${data.style === s ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-300 hover:border-primary"}`}
              >{s === "unordered" ? "• Bullet" : "1. Ordered"}</button>
            ))}
          </div>
          <div className="space-y-1.5">
            {(data.items || [""]).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-400 text-sm w-5 shrink-0">
                  {data.style === "ordered" ? `${i + 1}.` : "•"}
                </span>
                <input
                  className={`${cls} flex-1`}
                  value={item}
                  placeholder={`Item ${i + 1}…`}
                  onChange={(e) => {
                    const next = [...data.items];
                    next[i] = e.target.value;
                    onChange({ items: next });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const next = [...data.items];
                      next.splice(i + 1, 0, "");
                      onChange({ items: next });
                    }
                    if (e.key === "Backspace" && item === "" && data.items.length > 1) {
                      e.preventDefault();
                      onChange({ items: data.items.filter((_, j) => j !== i) });
                    }
                  }}
                />
                {data.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onChange({ items: data.items.filter((_, j) => j !== i) })}
                    className="text-gray-300 hover:text-red-400 text-xs"
                  >✕</button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({ items: [...(data.items || []), ""] })}
              className="text-xs text-primary hover:underline mt-1"
            >+ Add item</button>
          </div>
        </div>
      );

    // ── Divider ──────────────────────────────────────────────────────────────
    case "divider":
      return (
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 border-t-2 border-dashed border-gray-200" />
          <span className="text-xs text-gray-300">divider</span>
          <div className="flex-1 border-t-2 border-dashed border-gray-200" />
        </div>
      );

    // ── Embed ────────────────────────────────────────────────────────────────
    case "embed":
      return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Platform:</label>
            {["youtube","vimeo","twitter"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ service: s, embed_id: "" })}
                className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${data.service === s ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-300 hover:border-primary"}`}
              >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
          <input
            className={cls}
            placeholder={
              data.service === "youtube" ? "YouTube video ID (e.g. dQw4w9WgXcQ)"
              : data.service === "vimeo"   ? "Vimeo video ID (e.g. 123456789)"
              : "Tweet URL or ID"
            }
            value={data.embed_id}
            onChange={(e) => onChange({ embed_id: e.target.value })}
          />
          {data.service === "youtube" && data.embed_id && (
            <div className="aspect-video rounded overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${data.embed_id}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <input className={cls} placeholder="Caption (optional)…" value={data.caption} onChange={(e) => onChange({ caption: e.target.value })} />
        </div>
      );

    // ── Raw HTML ─────────────────────────────────────────────────────────────
    case "html":
      return (
        <div className="border border-orange-200 rounded-lg overflow-hidden">
          <div className="bg-orange-50 px-3 py-1.5 border-b border-orange-200 flex items-center gap-2">
            <span className="text-xs font-mono text-orange-600 font-semibold">&lt;HTML&gt;</span>
            <span className="text-xs text-orange-500">Raw HTML block — handle with care</span>
          </div>
          <textarea
            value={data.html}
            onChange={(e) => onChange({ html: e.target.value })}
            placeholder="<div>Your custom HTML here…</div>"
            rows={5}
            className="w-full font-mono text-sm bg-white px-4 py-3 outline-none resize-y"
            spellCheck={false}
          />
        </div>
      );

    default:
      return (
        <div className="border border-gray-200 rounded p-3 text-sm text-gray-400 bg-gray-50">
          Unknown block type: {type}
        </div>
      );
  }
}
