// ============================================================
// FILE PATH: src/components/ReviewSection.tsx
// ============================================================

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
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
            disabled={!interactive}
          >
            {filled ? (
              <HiStar className="w-6 h-6 text-[#D4AF37]" />
            ) : (
              <HiOutlineStar className="w-6 h-6 text-zinc-600" />
            )}
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
        <HiStar
          key={star}
          className={`w-4 h-4 ${star <= Math.round(avg) ? "text-[#D4AF37]" : "text-zinc-700"}`}
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

  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?startupId=${startupId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating);
      setTotal(data.total);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [startupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting review...");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startupId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit.", { id: toastId });
        return;
      }

      toast.success("Review submitted!", { id: toastId });
      setForm({ name: "", email: "", rating: 0, comment: "" });
      setShowForm(false);
      fetchReviews();

    } catch {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 border-t border-white/5 pt-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            Community Signal
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
            Reviews
          </h2>
          {!loading && total > 0 && avgRating && (
            <div className="flex items-center gap-3 mt-3">
              <AverageStars avg={avgRating} />
              <span className="text-white font-black text-sm">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                {total} {total === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all active:scale-95 shrink-0"
        >
          {showForm ? "Cancel" : "Leave a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 mb-12 space-y-6"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-6">
            Reviewing {startupName}
          </p>

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Your Rating
            </label>
            <StarRating
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
            />
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#4E24CF]/50 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Email <span className="text-zinc-700 normal-case tracking-normal font-normal">(not shown publicly)</span>
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#4E24CF]/50 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Your Review
            </label>
            <textarea
              required
              rows={4}
              placeholder="What do you think about this product? Be honest."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#4E24CF]/50 transition-all placeholder:text-zinc-700 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all disabled:opacity-40 active:scale-[0.98]"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>

          <p className="text-[9px] text-zinc-700 text-center font-black uppercase tracking-widest">
            One review per person per startup.
          </p>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-zinc-600 font-black text-[10px] uppercase tracking-widest animate-pulse">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/5 rounded-[2rem]">
          <p className="text-zinc-600 font-black text-[10px] uppercase tracking-widest">
            No reviews yet. Be the first.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-950 border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar initial */}
                  <div className="w-10 h-10 rounded-full bg-[#4E24CF]/20 border border-[#4E24CF]/30 flex items-center justify-center text-[11px] font-black text-[#4E24CF] flex-shrink-0">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-black text-[11px] uppercase tracking-widest">
                      {review.name}
                    </p>
                    <p className="text-zinc-600 text-[9px] uppercase tracking-widest mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} />
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}