import React from "react";
import { Star, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

const TestimonialTableRow = ({
  item,
  getAvatarUrl,
  setSelectedReview,
  handleStatusChange,
  handleDelete,
}) => {
  const isApproved = item.status === "APPROVED";
  const isPending = item.status === "PENDING";
  const rating = Number(item.rating) || 5;

  return (
    <tr className="hover:bg-gray-50/70 transition">
      {/* Customer Info */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(item.avatar, item.name)}
            alt={item.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                item.name || "User"
              )}&background=00B207&color=fff&size=100`;
            }}
          />
          <div>
            <p className="font-semibold text-gray-900 text-xs sm:text-sm">
              {item.name}
            </p>
            <p className="text-[11px] text-gray-400">
              {item.email || item.role || "Customer"}
            </p>
          </div>
        </div>
      </td>

      {/* Rating */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-[#FF8A00]">
          <Star size={14} className="fill-[#FF8A00] stroke-none" />
          <span className="text-xs font-bold text-gray-700">{rating}.0</span>
        </div>
      </td>

      {/* Review message excerpt */}
      <td className="px-5 py-4">
        <p
          onClick={() => setSelectedReview(item)}
          className="text-xs text-gray-700 italic line-clamp-2 cursor-pointer hover:text-gray-900"
          title="Click to view full review"
        >
          "{item.review}"
        </p>
      </td>

      {/* Date */}
      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
        {new Date(item.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>

      {/* Homepage Visibility Status */}
      <td className="px-5 py-4 whitespace-nowrap text-center">
        {isPending ? (
          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() => handleStatusChange(item._id, "APPROVED")}
              title="Approve and show on homepage"
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle size={12} />
              Approve
            </button>
            <button
              onClick={() => handleStatusChange(item._id, "REJECTED")}
              title="Reject and hide"
              className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-600 text-[11px] font-semibold transition cursor-pointer"
            >
              Reject
            </button>
          </div>
        ) : isApproved ? (
          <button
            onClick={() => handleStatusChange(item._id, "REJECTED")}
            title="Click to hide from homepage"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition cursor-pointer"
          >
            <CheckCircle size={12} />
            <span>Live on Homepage</span>
          </button>
        ) : (
          <button
            onClick={() => handleStatusChange(item._id, "APPROVED")}
            title="Click to show on homepage"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
          >
            <XCircle size={12} />
            <span>Hidden</span>
          </button>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setSelectedReview(item)}
            title="View Full Review"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            title="Delete Review"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TestimonialTableRow;
