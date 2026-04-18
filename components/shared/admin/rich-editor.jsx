"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { getExtensions } from "@/lib/tiptap-extensions";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold, Italic, Underline, Strikethrough, Code, Link, LinkOff,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ListChecks, Image as ImageIcon, Youtube,
  Table as TableIcon, Quote, Code2, Minus, Undo2, Redo2,
  Highlighter, Type, ChevronDown, Maximize2, Minimize2,
  X, Palette, Check, Eraser, Upload,
} from "lucide-react";

// ── Colour palettes ────────────────────────────────────────────────────────────
const TEXT_COLORS = [
  "#111827","#374151","#6B7280","#DC2626","#D97706",
  "#16A34A","#2563EB","#7C3AED","#DB2777","#0891B2",
];
const HIGHLIGHT_COLORS = [
  "#FEF08A","#BBF7D0","#BFDBFE","#DDD6FE",
  "#FBCFE8","#FED7AA","#E0F2FE","transparent",
];

// ── Primitives ─────────────────────────────────────────────────────────────────
function Btn({ onClick, active, disabled, title, children, className = "" }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-sm shrink-0 transition-colors
        ${active ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${className}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />;
}

// ── Colour swatch picker ───────────────────────────────────────────────────────
function ColorPicker({ colors, onSelect, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2.5 z-50 w-32">
      <div className="grid grid-cols-5 gap-1.5">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onSelect(c); onClose(); }}
            title={c === "transparent" ? "Remove" : c}
            className="w-5 h-5 rounded-full border border-gray-300 hover:scale-125 transition-transform focus:outline-none"
            style={{
              background: c === "transparent"
                ? "linear-gradient(135deg,#fff 45%,#f00 45%,#f00 55%,#fff 55%)"
                : c,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main toolbar ───────────────────────────────────────────────────────────────
function Toolbar({ editor, isFullscreen, onToggleFullscreen, imageInputRef, isUploading }) {
  const [popup, setPopup] = useState(null); // "heading"|"link"|"youtube"|"textColor"|"highlight"
  const toolbarRef = useRef(null);

  // Close popup on outside click
  useEffect(() => {
    if (!popup) return;
    const handler = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) setPopup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popup]);

  // ESC closes fullscreen
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isFullscreen) onToggleFullscreen();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen, onToggleFullscreen]);

  if (!editor) return null;

  const toggle = (name) => setPopup((p) => (p === name ? null : name));
  const close = () => setPopup(null);

  const HEADINGS = [
    { label: "Normal text", action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph"), cls: "text-sm" },
    { label: "Heading 1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }), cls: "text-xl font-bold" },
    { label: "Heading 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), cls: "text-lg font-bold" },
    { label: "Heading 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), cls: "text-base font-semibold" },
    { label: "Heading 4", action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), active: editor.isActive("heading", { level: 4 }), cls: "text-sm font-semibold" },
  ];
  const activeHeading = HEADINGS.find((h) => h.active);

  // Link dialog content
  const LinkDialog = () => {
    const [url, setUrl] = useState(editor.getAttributes("link").href || "");
    const apply = () => {
      if (url.trim()) editor.chain().focus().setLink({ href: url.trim(), target: "_blank" }).run();
      else editor.chain().focus().unsetLink().run();
      close();
    };
    return (
      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 w-72">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Insert link</p>
        <div className="flex gap-2">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } if (e.key === "Escape") close(); }}
            placeholder="https://..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
          />
          <button type="button" onMouseDown={(e) => { e.preventDefault(); apply(); }}
            className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
            {url ? "Apply" : "Remove"}
          </button>
        </div>
        {editor.isActive("link") && (
          <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); close(); }}
            className="mt-2 text-xs text-red-500 hover:text-red-700">
            Remove link
          </button>
        )}
      </div>
    );
  };

  const YoutubeDialog = () => {
    const [url, setUrl] = useState("");
    const apply = () => {
      if (url.trim()) editor.commands.setYoutubeVideo({ src: url.trim(), width: 640, height: 360 });
      close();
    };
    return (
      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 w-72">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Embed YouTube / Vimeo</p>
        <div className="flex gap-2">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } if (e.key === "Escape") close(); }}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
          />
          <button type="button" onMouseDown={(e) => { e.preventDefault(); apply(); }}
            className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium">
            Embed
          </button>
        </div>
      </div>
    );
  };

  return (
    <div ref={toolbarRef} className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center gap-0.5 px-3 py-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>

        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo · Ctrl+Z"><Undo2 className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo · Ctrl+Y"><Redo2 className="w-4 h-4" /></Btn>
        <Sep />

        {/* Block type */}
        <div className="relative shrink-0">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); toggle("heading"); }}
            className="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{activeHeading?.label ?? "Normal text"}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          {popup === "heading" && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 w-40">
              {HEADINGS.map(({ label, action, active, cls }) => (
                <button key={label} type="button"
                  onMouseDown={(e) => { e.preventDefault(); action(); close(); }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-800 flex items-center justify-between ${cls}`}>
                  <span>{label}</span>
                  {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <Sep />

        {/* Inline formatting */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold · Ctrl+B"><Bold className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic · Ctrl+I"><Italic className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline · Ctrl+U"><Underline className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code"><Code className="w-4 h-4" /></Btn>
        <Sep />

        {/* Colour */}
        <div className="relative shrink-0">
          <Btn onClick={() => toggle("textColor")} active={popup === "textColor"} title="Text colour">
            <Palette className="w-4 h-4" />
          </Btn>
          {popup === "textColor" && (
            <ColorPicker colors={TEXT_COLORS} onSelect={(c) => editor.chain().focus().setColor(c).run()} onClose={close} />
          )}
        </div>
        <div className="relative shrink-0">
          <Btn onClick={() => toggle("highlight")} active={popup === "highlight"} title="Highlight">
            <Highlighter className="w-4 h-4" />
          </Btn>
          {popup === "highlight" && (
            <ColorPicker
              colors={HIGHLIGHT_COLORS}
              onSelect={(c) => {
                if (c === "transparent") editor.chain().focus().unsetHighlight().run();
                else editor.chain().focus().setHighlight({ color: c }).run();
              }}
              onClose={close}
            />
          )}
        </div>
        <Sep />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left"><AlignLeft className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Center"><AlignCenter className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right"><AlignRight className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify"><AlignJustify className="w-4 h-4" /></Btn>
        <Sep />

        {/* Lists */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Task list"><ListChecks className="w-4 h-4" /></Btn>
        <Sep />

        {/* Link */}
        <div className="relative shrink-0">
          <Btn onClick={() => toggle("link")} active={editor.isActive("link") || popup === "link"} title="Link · Ctrl+K">
            <Link className="w-4 h-4" />
          </Btn>
          {popup === "link" && <LinkDialog />}
        </div>

        {/* Image upload */}
        <Btn onClick={() => imageInputRef.current?.click()} disabled={isUploading} title="Insert image">
          {isUploading ? (
            <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </Btn>

        {/* YouTube */}
        <div className="relative shrink-0">
          <Btn onClick={() => toggle("youtube")} title="Embed video"><Youtube className="w-4 h-4" /></Btn>
          {popup === "youtube" && <YoutubeDialog />}
        </div>

        {/* Table */}
        <Btn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert table">
          <TableIcon className="w-4 h-4" />
        </Btn>
        <Sep />

        {/* Block elements */}
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block"><Code2 className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="w-4 h-4" /></Btn>
        <Sep />

        {/* Clear formatting */}
        <Btn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
          <Eraser className="w-4 h-4" />
        </Btn>

        {/* Fullscreen — pushed to end */}
        <div className="ml-auto shrink-0">
          <Btn onClick={onToggleFullscreen} title={isFullscreen ? "Exit fullscreen · Esc" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Status footer ──────────────────────────────────────────────────────────────
function EditorFooter({ editor, savedAt, isDragOver }) {
  if (!editor) return null;
  const words = editor.storage.characterCount?.words() ?? 0;
  const chars = editor.storage.characterCount?.characters() ?? 0;
  const readMins = Math.max(1, Math.ceil(words / 200));

  return (
    <div className={`flex items-center gap-4 px-4 py-2.5 border-t text-xs transition-colors
      ${isDragOver ? "border-primary/30 bg-primary/5" : "border-gray-100 bg-white"}`}>
      {isDragOver ? (
        <span className="flex items-center gap-1.5 text-primary font-medium">
          <Upload className="w-3.5 h-3.5" /> Drop image to insert
        </span>
      ) : (
        <>
          <span className="text-gray-400">{words.toLocaleString()} words</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">{chars.toLocaleString()} chars</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">{readMins} min read</span>
          {savedAt && (
            <span className="ml-auto flex items-center gap-1 text-green-600">
              <Check className="w-3 h-3" /> Saved {savedAt}
            </span>
          )}
        </>
      )}
    </div>
  );
}

// =============================================================================
// RICH EDITOR
// =============================================================================
export default function RichEditor({ value, onChange, placeholder = "Start writing…", savedAt }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Bubble menu link state
  const [bubbleLinkMode, setBubbleLinkMode] = useState(false);
  const [bubbleLinkUrl, setBubbleLinkUrl] = useState("");
  const bubbleLinkRef = useRef(null);

  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      ...getExtensions(),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value || null,
    editorProps: {
      attributes: { class: "prose-editor focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
    immediatelyRender: false,
  });

  // Sync value from outside (e.g. when editing an existing post)
  useEffect(() => {
    if (!editor || !value) return;
    const current = JSON.stringify(editor.getJSON());
    if (current !== JSON.stringify(value)) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  // Image upload handler (file input)
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { files } = await res.json();
      const url = files[0]?.url;
      if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, [editor]);

  // Drag-and-drop image upload
  const handleDrop = useCallback(async (e) => {
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file?.type.startsWith("image/") || !editor) return;
    e.preventDefault();
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { files } = await res.json();
      const url = files[0]?.url;
      if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      console.error("Drag-drop upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  // Bubble link helpers
  const openBubbleLink = useCallback(() => {
    setBubbleLinkUrl(editor?.getAttributes("link").href || "");
    setBubbleLinkMode(true);
    setTimeout(() => bubbleLinkRef.current?.focus(), 50);
  }, [editor]);

  const applyBubbleLink = useCallback(() => {
    if (!editor) return;
    if (bubbleLinkUrl.trim()) {
      editor.chain().focus().setLink({ href: bubbleLinkUrl.trim(), target: "_blank" }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setBubbleLinkMode(false);
  }, [editor, bubbleLinkUrl]);

  const wrapperClass = isFullscreen
    ? "fixed inset-0 z-50 bg-white flex flex-col"
    : "flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white";

  return (
    <div className={wrapperClass}>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <Toolbar
        editor={editor}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((v) => !v)}
        imageInputRef={imageInputRef}
        isUploading={isUploading}
      />

      {/* Bubble menu on text selection */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            maxWidth: "none",
            onHide: () => setBubbleLinkMode(false),
          }}
          shouldShow={({ state }) => {
            const { empty } = state.selection;
            if (empty) return false;
            if (editor.isActive("image") || editor.isActive("codeBlock")) return false;
            return true;
          }}
        >
          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            {bubbleLinkMode ? (
              /* Inline link input */
              <div className="flex items-center gap-1 px-2 py-1.5">
                <input
                  ref={bubbleLinkRef}
                  value={bubbleLinkUrl}
                  onChange={(e) => setBubbleLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); applyBubbleLink(); }
                    if (e.key === "Escape") { e.preventDefault(); setBubbleLinkMode(false); }
                  }}
                  placeholder="https://..."
                  className="text-xs text-white bg-transparent outline-none w-44 placeholder-gray-500"
                />
                <button type="button" onMouseDown={(e) => { e.preventDefault(); applyBubbleLink(); }}
                  className="text-green-400 hover:text-green-300 transition-colors p-0.5">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); setBubbleLinkMode(false); }}
                  className="text-gray-500 hover:text-gray-300 transition-colors p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Format buttons */
              <div className="flex items-center gap-0 p-1">
                {[
                  { icon: <Bold className="w-3.5 h-3.5" />, cmd: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
                  { icon: <Italic className="w-3.5 h-3.5" />, cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
                  { icon: <Underline className="w-3.5 h-3.5" />, cmd: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), title: "Underline" },
                  { icon: <Strikethrough className="w-3.5 h-3.5" />, cmd: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), title: "Strikethrough" },
                  { icon: <Code className="w-3.5 h-3.5" />, cmd: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code"), title: "Code" },
                ].map(({ icon, cmd, active, title }, i) => (
                  <button key={i} type="button" onMouseDown={(e) => { e.preventDefault(); cmd(); }} title={title}
                    className={`w-7 h-7 flex items-center justify-center rounded transition-colors
                      ${active ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}>
                    {icon}
                  </button>
                ))}
                <div className="w-px h-4 bg-gray-700 mx-0.5" />
                {editor.isActive("link") ? (
                  <button type="button" title="Remove link"
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); }}
                    className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-red-400 transition-colors">
                    <LinkOff className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button type="button" title="Add link"
                    onMouseDown={(e) => { e.preventDefault(); openBubbleLink(); }}
                    className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white transition-colors">
                    <Link className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </BubbleMenu>
      )}

      {/* Editor content — drag-and-drop target */}
      <div
        className={`flex-1 overflow-y-auto px-6 py-5 transition-colors duration-150
          ${isDragOver ? "bg-primary/5" : ""}
          ${isFullscreen ? "" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
        }}
      >
        {isFullscreen && (
          <div className="max-w-[720px] mx-auto">
            <EditorContent editor={editor} />
          </div>
        )}
        {!isFullscreen && <EditorContent editor={editor} />}
      </div>

      <EditorFooter editor={editor} savedAt={savedAt} isDragOver={isDragOver} />
    </div>
  );
}
