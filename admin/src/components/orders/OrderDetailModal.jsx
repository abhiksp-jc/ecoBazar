import React from "react";
import { X } from "lucide-react";

const OrderDetailModal = ({
  selectedOrder,
  setSelectedOrder,
  getImageUrl,
  handlePaymentStatusChange,
}) => {
  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-mono">
              Order #{selectedOrder.orderNumber}
            </h3>
            <p className="text-xs text-gray-500">
              Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider">
                Customer Information
              </h4>
              <p className="text-sm font-semibold text-gray-900">
                {selectedOrder.customerDetails?.name}
              </p>
              <p className="text-gray-600">{selectedOrder.customerDetails?.email}</p>
              <p className="text-gray-600">{selectedOrder.customerDetails?.phone}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider">
                Shipping &amp; Payment
              </h4>
              <p className="text-gray-800">
                {selectedOrder.customerDetails?.address?.street},{" "}
                {selectedOrder.customerDetails?.address?.city}
              </p>
              <p className="text-gray-800">
                {selectedOrder.customerDetails?.address?.state},{" "}
                {selectedOrder.customerDetails?.address?.zipCode}
              </p>
              <p className="font-medium text-gray-700 pt-1">
                Method: {selectedOrder.paymentMethod} (Status:{" "}
                {selectedOrder.paymentStatus})
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Purchased Items</h4>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {selectedOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100?text=Product";
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {item.name}
                      </p>
                      <p className="text-gray-400">
                        ${item.price?.toFixed(2)} × {item.quantity}{" "}
                        {item.unit || "kg"}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm border border-gray-100">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">
                ${selectedOrder.subtotal?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span className="font-medium text-gray-900">
                ${selectedOrder.shippingFee?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Amount:</span>
              <span className="text-green-700">
                ${selectedOrder.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Payment:</span>
            <button
              onClick={() =>
                handlePaymentStatusChange(
                  selectedOrder._id,
                  selectedOrder.paymentStatus === "Paid" ? "Pending" : "Paid"
                )
              }
              className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 font-medium hover:bg-gray-100 transition cursor-pointer"
            >
              Mark as {selectedOrder.paymentStatus === "Paid" ? "Pending" : "Paid"}
            </button>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="px-5 py-2 text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
