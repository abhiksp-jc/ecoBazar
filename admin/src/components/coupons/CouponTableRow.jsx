import React from "react";
import { Copy, Clock, CheckCircle2, XCircle, Edit2, Trash2 } from "lucide-react";

const CouponTableRow = ({
  coupon,
  copyCode,
  handleToggle,
  openEditModal,
  handleDelete,
}) => {
  const now = new Date();
  const expiry = new Date(coupon.expiryDate);
  const isExpired = expiry <= now;
  const isActive = coupon.isActive && !isExpired;

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Code */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
            {coupon.code}
          </span>
          <button
            type="button"
            onClick={() => copyCode(coupon.code)}
            title="Copy Code"
            className="text-gray-400 hover:text-green-600 transition cursor-pointer"
          >
            <Copy size={14} />
          </button>
        </div>
      </td>

      {/* Discount */}
      <td className="px-5 py-4 text-sm font-bold text-green-700">
        {coupon.discountType === "PERCENTAGE"
          ? `${coupon.discountValue}% OFF`
          : `$${coupon.discountValue} OFF`}
      </td>

      {/* Min Order */}
      <td className="px-5 py-4 text-sm text-gray-600">
        {coupon.minOrderAmount > 0
          ? `$${coupon.minOrderAmount.toFixed(2)}`
          : "No min"}
      </td>

      {/* Expiry Date */}
      <td className="px-5 py-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-700">
          <Clock size={14} className={isExpired ? "text-red-500" : "text-gray-400"} />
          <span>
            {expiry.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            {expiry.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {isExpired && (
          <span className="text-[11px] font-medium text-red-500 block">
            Expired
          </span>
        )}
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => handleToggle(coupon)}
          title="Click to toggle status"
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
            isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : isExpired
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isActive && <CheckCircle2 size={12} />}
          {isExpired && <XCircle size={12} />}
          <span>
            {isActive
              ? "Active"
              : isExpired
              ? "Expired"
              : "Disabled"}
          </span>
        </button>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openEditModal(coupon)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer"
            title="Edit Coupon & Adjust Time"
          >
            <Edit2 size={13} />
            <span>Adjust / Edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(coupon)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
            title="Delete Coupon"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CouponTableRow;
