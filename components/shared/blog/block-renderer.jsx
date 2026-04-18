import Image from "next/image";

export default function BlockRenderer({ blocks = [] }) {
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}

function Block({ block }) {
  const { type, data } = block;

  switch (type) {
    case "paragraph":
      return data.text ? (
        <p className="text-gray-700 leading-relaxed mb-5 whitespace-pre-wrap">{data.text}</p>
      ) : null;

    case "heading": {
      const Tag = `h${data.level || 2}`;
      const sizes = { 2: "text-3xl", 3: "text-2xl", 4: "text-xl" };
      return (
        <Tag className={`${sizes[data.level] || "text-3xl"} font-bold text-secondary mt-8 mb-4 leading-tight`}>
          {data.text}
        </Tag>
      );
    }

    case "image":
      return data.url ? (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <Image
              src={data.url}
              alt={data.alt || data.caption || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{data.caption}</figcaption>
          )}
        </figure>
      ) : null;

    case "gallery":
      return data.images?.length > 0 ? (
        <figure className="my-8">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${data.columns || 3}, 1fr)` }}
          >
            {data.images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.alt || img.caption || ""}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            ))}
          </div>
        </figure>
      ) : null;

    case "video":
      if (data.type === "youtube" && data.embed_id) {
        return (
          <figure className="my-8">
            <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${data.embed_id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {data.caption && (
              <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{data.caption}</figcaption>
            )}
          </figure>
        );
      }
      if (data.url) {
        return (
          <figure className="my-8">
            <video controls className="w-full rounded-xl" poster={data.poster || undefined}>
              <source src={data.url} />
            </video>
            {data.caption && (
              <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{data.caption}</figcaption>
            )}
          </figure>
        );
      }
      return null;

    case "quote":
      return (
        <blockquote className="my-8 pl-6 border-l-4 border-primary">
          <p className="text-xl text-gray-700 italic leading-relaxed">&ldquo;{data.text}&rdquo;</p>
          {data.author && (
            <footer className="mt-3 text-sm text-gray-500">
              — <cite>{data.author}</cite>
              {data.cite && <span className="ml-1 text-gray-400">({data.cite})</span>}
            </footer>
          )}
        </blockquote>
      );

    case "code":
      return (
        <div className="my-6">
          {data.filename && (
            <div className="bg-gray-700 text-gray-300 text-xs px-4 py-2 rounded-t-lg font-mono">
              {data.filename}
            </div>
          )}
          <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm leading-relaxed ${data.filename ? "rounded-b-lg" : "rounded-lg"}`}>
            <code className={`language-${data.language || "text"}`}>{data.code}</code>
          </pre>
        </div>
      );

    case "callout": {
      const variants = {
        info:    { bg: "bg-blue-50",   border: "border-blue-300",  text: "text-blue-800",  icon: "ℹ" },
        warning: { bg: "bg-amber-50",  border: "border-amber-300", text: "text-amber-800", icon: "⚠" },
        success: { bg: "bg-green-50",  border: "border-green-300", text: "text-green-800", icon: "✓" },
        error:   { bg: "bg-red-50",    border: "border-red-300",   text: "text-red-800",   icon: "✕" },
      };
      const v = variants[data.variant] || variants.info;
      return (
        <div className={`my-6 flex gap-3 p-4 rounded-xl border ${v.bg} ${v.border}`}>
          <span className={`text-lg shrink-0 ${v.text}`}>{v.icon}</span>
          <div>
            {data.title && <p className={`font-semibold mb-1 ${v.text}`}>{data.title}</p>}
            <p className={`text-sm ${v.text}`}>{data.text}</p>
          </div>
        </div>
      );
    }

    case "list":
      return data.items?.filter(Boolean).length > 0 ? (
        data.style === "ordered" ? (
          <ol className="my-5 pl-6 space-y-1 list-decimal text-gray-700">
            {data.items.filter(Boolean).map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ol>
        ) : (
          <ul className="my-5 pl-6 space-y-1 list-disc text-gray-700">
            {data.items.filter(Boolean).map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        )
      ) : null;

    case "divider":
      return <hr className="my-10 border-gray-200" />;

    case "embed": {
      const embedUrls = {
        youtube: (id) => `https://www.youtube.com/embed/${id}`,
        vimeo:   (id) => `https://player.vimeo.com/video/${id}`,
      };
      const src = embedUrls[data.service]?.(data.embed_id);
      return src ? (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={src}
              title={`${data.service} embed`}
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{data.caption}</figcaption>
          )}
        </figure>
      ) : null;
    }

    case "html":
      return data.html ? (
        <div className="my-6" dangerouslySetInnerHTML={{ __html: data.html }} />
      ) : null;

    default:
      return null;
  }
}
