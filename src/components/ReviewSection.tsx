"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { HiOutlineStar, HiStar } from "react-icons/hi2";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  startupId: string;
  startupName: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button key={star} type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
            disabled={!interactive}
          >
            {filled
              ? <HiStar className="w-6 h-6" style={{ color: "var(--accent)" }} />
              : <HiOutlineStar className="w-6 h-6" style={{ color: "var(--text-tertiary)" }} />
            }
          </button>
        );
      })}
    </div>
  );
}

function AverageStars({ avg }: { avg: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <HiStar key={star} className="w-4 h-4"
          style={{ color: star <= Math.round(avg) ? "var(--accent)" : "var(--text-tertiary)" }}
        />
      ))}
    </div>
  );
}

export function ReviewSection({ startupId, startupName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 0, comment: "" });

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?startupId=${startupId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating);
      setTotal(data.total);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [startupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { toast.error("Please select a star rating."); return; }
    setSubmitting(true);
    const toastId = toast.loading("Submitting...");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startupId }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed.", { id: toastId }); return; }
      toast.success("Review submitted!", { id: toastId });
      setForm({ name: "", email: "", rating: 0, comment: "" });
      setShowForm(false);
      fetchReviews();
    } catch { toast.error("Something went wrong.", { id: toastId }); }
    finally { setSubmitting(false); }
  };

  const inputCls = "w-full ap-input";

  return (
    <section className="mt-16 pt-16" style={{ borderTop: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <p className="ap-label mb-2">Community Signal</p>
          <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ color: "var(--text-primary)" }}>Reviews</h2>
          {!loading && total > 0 && avgRating && (
            <div className="flex items-center gap-3 mt-3">
              <AverageStars avg={avgRating} />
              <span className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{avgRating.toFixed(1)}</span>
              <span className="ap-label">{total} {total === 1 ? "review" : "reviews"}</span>
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? "ap-btn-ghost shrink-0" : "ap-btn-primary shrink-0"}>
          {showForm ? "Cancel" : "Leave a Review"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-[2.5rem] p-8 mb-12 space-y-6"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
        >
          <p className="ap-label pb-6" style={{ borderBottom: "1px solid var(--border)" }}>Reviewing {startupName}</p>
          <div className="space-y-2">
            <label className="ap-label">Your Rating</label>
            <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ap-label">Name</label>
              <input type="text" required placeholder="Jane Smith" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="ap-label">Email <span className="normal-case font-normal tracking-normal text-xs" style={{ color: "var(--text-tertiary)" }}>(not shown)</span></label>
              <input type="email" required placeholder="jane@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="ap-label">Review</label>
            <textarea required rows={4} placeholder="What do you think about this product?" value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className={`${inputCls} resize-none`} style={{ minHeight: "6rem" }} />
          </div>
          <button type="submit" disabled={submitting} className="ap-btn-primary w-full disabled:opacity-40">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          <p className="ap-label text-center">One review per person per product.</p>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="ap-label animate-pulse">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 rounded-[2rem] border border-dashed" style={{ borderColor: "var(--border)" }}>
          <p className="ap-label">No reviews yet. Be the first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-[2rem] p-8 transition-all"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)" }}
                  >
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>{review.name}</p>
                    <p className="ap-label mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
