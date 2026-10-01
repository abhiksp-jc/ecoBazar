import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Brand themed SweetAlert2 instance
export const ecobazarSwal = Swal.mixin({
  customClass: {
    popup: "rounded-2xl shadow-2xl p-6 font-sans border border-gray-100",
    title: "text-xl font-bold text-gray-900 tracking-tight",
    htmlContainer: "text-sm text-gray-600 leading-relaxed",
    confirmButton:
      "bg-[#00B207] hover:bg-[#009406] text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow-md transition-all outline-none mx-1.5 cursor-pointer",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-full text-sm transition-all outline-none mx-1.5 cursor-pointer",
    denyButton:
      "bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all outline-none mx-1.5 cursor-pointer"
  },
  buttonsStyling: false
});

// Toast notification mixin (top right, auto-dismissing)
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "rounded-xl shadow-lg border border-gray-100 text-sm font-sans"
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  }
});

/**
 * Toast notification for quick actions (Cart, Wishlist, Coupon, etc.)
 */
export const showToast = (message, icon = "success", timer = 2500) => {
  return Toast.fire({
    icon,
    title: message,
    timer
  });
};

/**
 * Order Placed Successfully Sweet Alert
 */
export const showOrderSuccessAlert = async (order) => {
  const orderNumber = order?.orderNumber || order?._id || `ECO-${Date.now().toString().slice(-6)}`;
  const totalAmount = Number(order?.grandTotal || order?.total || 0).toFixed(2);
  const itemsCount = order?.items?.length || 1;
  const paymentMethod = order?.paymentMethod === "COD" ? "Cash On Delivery (COD)" : "Online Paid";

  return ecobazarSwal.fire({
    icon: "success",
    title: "Order Placed Successfully! 🎉",
    html: `
      <div style="text-align: left; padding: 4px 0;">
        <p style="margin: 0 0 12px; color: #4b5563; font-size: 13.5px;">
          Thank you for shopping with <strong>Ecobazar</strong>! Your order has been placed and is being prepared for fresh delivery.
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #6b7280; font-size: 12px;">Order Number:</span>
            <strong style="color: #15803d; font-size: 13px; font-family: monospace;">${orderNumber}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #6b7280; font-size: 12px;">Items:</span>
            <span style="color: #1f2937; font-size: 12px; font-weight: 600;">${itemsCount} product${itemsCount > 1 ? "s" : ""}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #6b7280; font-size: 12px;">Payment:</span>
            <span style="color: #1f2937; font-size: 12px; font-weight: 500;">${paymentMethod}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px dashed #86efac;">
            <strong style="color: #15803d; font-size: 13px;">Total Amount:</strong>
            <strong style="color: #15803d; font-size: 15px;">₹${totalAmount}</strong>
          </div>
        </div>
        <p style="margin: 0; color: #9ca3af; font-size: 11.5px; text-align: center;">
          A receipt and tracking details have been sent to your email.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "View My Orders",
    cancelButtonText: "Continue Shopping",
    confirmButtonColor: "#00B207",
    cancelButtonColor: "#64748b"
  });
};

/**
 * Standard confirmation dialog (e.g. Delete, Clear Cart, Logout)
 */
export const showConfirmAlert = async ({
  title = "Are you sure?",
  text = "",
  confirmButtonText = "Yes, proceed",
  cancelButtonText = "Cancel",
  icon = "warning"
} = {}) => {
  return ecobazarSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#00B207",
    cancelButtonColor: "#64748b"
  });
};

/**
 * Success modal alert
 */
export const showSuccessAlert = (title, text = "") => {
  return ecobazarSwal.fire({
    icon: "success",
    title,
    text
  });
};

/**
 * Error modal alert
 */
export const showErrorAlert = (title, text = "") => {
  return ecobazarSwal.fire({
    icon: "error",
    title,
    text
  });
};

/**
 * Warning modal alert
 */
export const showWarningAlert = (title, text = "") => {
  return ecobazarSwal.fire({
    icon: "warning",
    title,
    text
  });
};

export default ecobazarSwal;
