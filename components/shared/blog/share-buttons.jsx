"use client";

import { useState } from "react";
import { Link2, Twitter, Linkedin, Check } from "lucide-react";

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shares = [
    {
      label: "X / Twitter",
      icon: <Twitter className="w-4 h-4" />,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-gray-600">Share:</span>
      {shares.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">
          {s.icon} {s.label}
        </a>
      ))}
      <button onClick={copy}
        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
