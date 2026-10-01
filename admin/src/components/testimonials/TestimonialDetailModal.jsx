import React from "react";
import { X, Star } from "lucide-react";

const TestimonialDetailModal = ({
  selectedReview,
  setSelectedReview,
  getAvatarUrl,
  handleStatusChange,
}) => {
  if (!selectedReview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Review Details
          </span>
          <button
            onClick={() => setSelectedReview(null)}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl(selectedReview.avatar, selectedReview.name)}
              alt={selectedReview.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{selectedReview.name}</h3>
              <p className="text-xs text-gray-500">{selectedReview.role || "Customer"}</p>
              {selectedReview.email && (
                <p className="text-xs text-gray-400">{selectedReview.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#FF8A00]">
            {[...Array(Math.max(1, Math.min(5, Number(selectedReview.rating) || 5)))].map(
              (_, i) => (
                <Star key={i} size={16} className="fill-[#FF8A00] stroke-none" />
              )
            )}
            <span className="text-xs font-bold text-gray-700 ml-1.5">
              {selectedReview.rating}.0 out of 5
            </span>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed italic">
              "{selectedReview.review}"
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span>Submitted: {new Date(selectedReview.createdAt).toLocaleDateString()}</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                selectedReview.status === "APPROVED"
                  ? "bg-emerald-100 text-emerald-800"
                  : selectedReview.status === "PENDING"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {selectedReview.status === "APPROVED"
                ? "Live on Homepage"
                : selectedReview.status === "PENDING"
                ? "Pending"
                : "Hidden"}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            {selectedReview.status !== "APPROVED" ? (
              <button
                onClick={() => handleStatusChange(selectedReview._id, "APPROVED")}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
              >
                Show on Homepage
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange(selectedReview._id, "REJECTED")}
                className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition"
              >
                Hide from Homepage
              </button>
            )}
            <button
              onClick={() => setSelectedReview(null)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialDetailModal;
