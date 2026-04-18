import { tiptapToHtml } from "@/lib/tiptap-to-html";

// Server-safe: converts TipTap JSON → HTML without touching the DOM
export default function RichRenderer({ content }) {
  if (!content || content.type !== "doc" || !content.content?.length) {
    return <p className="text-gray-400 italic">No content yet.</p>;
  }

  const html = tiptapToHtml(content);

  return (
    <div
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
