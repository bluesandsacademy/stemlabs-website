"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null); // { id, author_name }

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blog/${postId}/comments`);
      if (res.ok) setComments(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleNewComment = (comment) => {
    toast.success("Comment submitted! It will appear after moderation.");
    setReplyTo(null);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-secondary mb-8">
        Comments {comments.length > 0 && <span className="text-gray-400 font-normal text-lg">({comments.length})</span>}
      </h2>

      {/* Comment form */}
      <div className="mb-10">
        <CommentForm
          postId={postId}
          parentId={replyTo?.id || null}
          replyTo={replyTo}
          onCancel={() => setReplyTo(null)}
          onSuccess={handleNewComment}
        />
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm italic text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <CommentThread
              key={c.id}
              comment={c}
              postId={postId}
              onReply={(comment) => setReplyTo(comment)}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
              onReplySuccess={handleNewComment}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CommentThread({ comment, postId, onReply, replyTo, onCancelReply, onReplySuccess }) {
  return (
    <div>
      <CommentCard comment={comment} onReply={onReply} />

      {/* Inline reply form when replying to this specific comment */}
      {replyTo?.id === comment.id && (
        <div className="mt-3 ml-12 pl-4 border-l-2 border-primary/30">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            replyTo={replyTo}
            onCancel={onCancelReply}
            onSuccess={onReplySuccess}
            compact
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-4 ml-12 pl-4 border-l-2 border-gray-100 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id}>
              <CommentCard comment={reply} onReply={onReply} isReply />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentCard({ comment, onReply, isReply }) {
  const initials = comment.author_name?.[0]?.toUpperCase() || "?";
  const timeAgo = formatTimeAgo(comment.created_at);

  return (
    <div className={`flex gap-3 ${isReply ? "" : ""}`}>
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm">{comment.author_name}</span>
          <span className="text-gray-400 text-xs">{timeAgo}</span>
          {comment.is_pinned && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Pinned</span>
          )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        {!isReply && (
          <button
            type="button"
            onClick={() => onReply(comment)}
            className="mt-2 text-xs text-gray-400 hover:text-primary transition-colors font-medium"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}

function CommentForm({ postId, parentId, replyTo, onCancel, onSuccess, compact }) {
  const [form, setForm] = useState({ author_name: "", author_email: "", author_website: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const cls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm";

  const validate = () => {
    const e = {};
    if (!form.author_name.trim()) e.author_name = "Name is required";
    if (!form.author_email.trim()) e.author_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.author_email)) e.author_email = "Invalid email";
    if (!form.content.trim()) e.content = "Comment is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, parent_id: parentId || null }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }
      const data = await res.json();
      setForm({ author_name: "", author_email: "", author_website: "", content: "" });
      setErrors({});
      onSuccess?.(data);
    } catch (err) {
      toast.error(err.message || "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {replyTo && (
        <p className="text-sm text-gray-500">
          Replying to <span className="font-medium text-gray-700">{replyTo.author_name}</span>
        </p>
      )}

      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              placeholder="Your name *"
              value={form.author_name}
              onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
              className={`${cls} ${errors.author_name ? "border-red-300" : ""}`}
            />
            {errors.author_name && <p className="text-xs text-red-500 mt-1">{errors.author_name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email (not published) *"
              value={form.author_email}
              onChange={(e) => setForm((p) => ({ ...p, author_email: e.target.value }))}
              className={`${cls} ${errors.author_email ? "border-red-300" : ""}`}
            />
            {errors.author_email && <p className="text-xs text-red-500 mt-1">{errors.author_email}</p>}
          </div>
        </div>
      )}

      {compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              placeholder="Your name *"
              value={form.author_name}
              onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
              className={`${cls} ${errors.author_name ? "border-red-300" : ""}`}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email *"
              value={form.author_email}
              onChange={(e) => setForm((p) => ({ ...p, author_email: e.target.value }))}
              className={`${cls} ${errors.author_email ? "border-red-300" : ""}`}
            />
          </div>
        </div>
      )}

      <div>
        <textarea
          placeholder={replyTo ? "Write your reply…" : "Share your thoughts…"}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          rows={compact ? 3 : 4}
          className={`${cls} resize-none ${errors.content ? "border-red-300" : ""}`}
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : replyTo ? "Post Reply" : "Post Comment"}
        </button>
        {replyTo && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        )}
        {!replyTo && (
          <p className="text-xs text-gray-400">Comments are moderated before appearing.</p>
        )}
      </div>
    </form>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
