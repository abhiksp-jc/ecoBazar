import React from "react";
import { Star, Send, Sparkles } from "lucide-react";

const FeedbackSubmissionForm = ({
  name,
  setName,
  email,
  setEmail,
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  review,
  setReview,
  handleSubmit,
  loading,
  error,
  RATING_LABELS
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-150 shadow-sm">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-[#00B207] mb-3">
          <Sparkles size={13} /> Your Voice Matters
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Share Your Experience
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          We’d love to hear your honest feedback. Your review helps us improve our fresh products and service.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selector */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
          <label className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-hidden transition-transform hover:scale-125 cursor-pointer"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      active
                        ? "fill-[#FF8A00] text-[#FF8A00]"
                        : "text-gray-300 stroke-gray-300 fill-none"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="mt-2 text-xs sm:text-sm font-semibold text-[#FF8A00]">
            {RATING_LABELS[hoverRating || rating] || "Satisfied"}
          </span>
        </div>

        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#00B207] focus:ring-2 focus:ring-[#00B207]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              Email Address <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#00B207] focus:ring-2 focus:ring-[#00B207]/20 transition"
            />
          </div>
        </div>

        {/* Review Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-gray-700">
              Your Review &amp; Experience <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-400">
              {review.length} characters
            </span>
          </div>
          <textarea
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you liked most (freshness, fast delivery, packaging quality)..."
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#00B207] focus:ring-2 focus:ring-[#00B207]/20 transition resize-y"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-[#00B207] hover:bg-[#009406] text-white font-bold text-sm sm:text-base transition duration-200 shadow-md shadow-[#00B207]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackSubmissionForm;
