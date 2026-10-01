import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, X, Package, Clock, CheckCircle2, Truck, CreditCard, ChevronRight } from "lucide-react";

const DEFAULT_ORDERS = [
  {
    id: "#7382",
    orderNumber: "#7382",
    date: "8 Sep, 2020",
    totalAmount: 84.0,
    productCount: 4,
    status: "Processing",
    items: [
      { name: "Green Apple", price: 14.99, quantity: 2, image: "/saleimg.jpg" },
      { name: "Fresh Broccoli", price: 10.50, quantity: 2, image: "/leaves.jpg" },
      { name: "Organic Orange", price: 20.00, quantity: 1, image: "/maingreen.jpg" },
      { name: "Red Tomatoes", price: 23.52, quantity: 1, image: "/saleimg.jpg" }
    ],
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    paymentMethod: "Credit Card (Stripe)"
  },
  {
    id: "#7032",
    orderNumber: "#7032",
    date: "24 May, 2020",
    totalAmount: 65.0,
    productCount: 3,
    status: "Completed",
    items: [
      { name: "Chinese Cabbage", price: 12.00, quantity: 2, image: "/leaves.jpg" },
      { name: "Green Lettuce", price: 9.00, quantity: 3, image: "/saleimg.jpg" },
      { name: "Eggplant", price: 14.00, quantity: 1, image: "/maingreen.jpg" }
    ],
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    paymentMethod: "Cash on Delivery"
  },
  {
    id: "#1304",
    orderNumber: "#1304",
    date: "22 Apr, 2020",
    totalAmount: 76.0,
    productCount: 4,
    status: "Completed",
    items: [
      { name: "Big Potatoes", price: 15.00, quantity: 2, image: "/saleimg.jpg" },
      { name: "Fresh Corn", price: 11.00, quantity: 2, image: "/maingreen.jpg" },
      { name: "Organic Carrots", price: 12.00, quantity: 2, image: "/leaves.jpg" }
    ],
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    paymentMethod: "PayPal"
  },
  {
    id: "#5611",
    orderNumber: "#5611",
    date: "1 Apr, 2020",
    totalAmount: 52.0,
    productCount: 2,
    status: "Completed",
    items: [
      { name: "Fresh Cauliflower", price: 18.00, quantity: 2, image: "/leaves.jpg" },
      { name: "Green Bell Pepper", price: 16.00, quantity: 1, image: "/saleimg.jpg" }
    ],
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    paymentMethod: "Credit Card"
  },
  {
    id: "#5624",
    orderNumber: "#5624",
    date: "21 Sep, 2020",
    totalAmount: 74.0,
    productCount: 3,
    status: "Completed",
    items: [
      { name: "Organic Bananas", price: 24.00, quantity: 1, image: "/saleimg.jpg" },
      { name: "Red Chili", price: 20.00, quantity: 2, image: "/maingreen.jpg" },
      { name: "Ginger Root", price: 10.00, quantity: 1, image: "/leaves.jpg" }
    ],
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    paymentMethod: "Apple Pay"
  },
  {
    id: "#5417",
    orderNumber: "#5417",
    date: "20 Oct, 2020",
    totalAmount: 65.0,
    productCount: 3,
    status: "Completed",
    items: [
      { name: "Fresh Mint", price: 5.00, quantity: 3, image: "/leaves.jpg" },
      { name: "Cucumber", price: 15.00, quantity: 2, image: "/saleimg.jpg" },
      { name: "Green Capsicum", price: 20.00, quantity: 1, image: "/maingreen.jpg" }
    ],
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    paymentMethod: "Cash on Delivery"
  }
];

const RecentOrdersTable = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiOrders = async () => {
      if (!userEmail) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/orders/customer-orders?email=${encodeURIComponent(userEmail.trim())}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.orders && data.orders.length > 0) {
            // Map backend orders to table format
            const formatted = data.orders.slice(0, 6).map((ord) => ({
              id: ord.orderNumber ? `#${ord.orderNumber}` : `#${ord._id.slice(-6)}`,
              orderNumber: ord.orderNumber ? `#${ord.orderNumber}` : `#${ord._id.slice(-6)}`,
              date: new Date(ord.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }),
              totalAmount: Number(ord.grandTotal ?? ord.totalAmount ?? 0),
              productCount: ord.items?.length || 1,
              status: ord.orderStatus === "Delivered" ? "Completed" : ord.orderStatus || "Processing",
              items: ord.items || [],
              address: ord.customerDetails?.address?.street
                ? `${ord.customerDetails.address.street}, ${ord.customerDetails.address.city || ""}`
                : "Customer Delivery Address",
              paymentMethod: `${ord.paymentMethod || "Online"} (${ord.paymentStatus || "Paid"})`
            }));
            setOrders(formatted);
          } else {
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApiOrders();
  }, [userEmail]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-5 sm:px-6 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Recent Order History
        </h2>
        <Link
          to="/my-orders"
          className="text-xs sm:text-sm font-semibold text-[#00B207] hover:text-[#009406] hover:underline transition"
        >
          View All
        </Link>
      </div>

      {/* Table for Desktop & Tablet */}
      {loading ? (
        <div className="py-12 text-center text-gray-400 text-xs">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 px-4">
          <div className="w-12 h-12 bg-green-50 text-[#00B207] rounded-full flex items-center justify-center mx-auto mb-3">
            <Package size={22} />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">No Orders Yet</h4>
          <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
            You haven't placed any orders yet. Fresh organic groceries are waiting for you!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B207] hover:bg-[#009406] text-white text-xs font-semibold rounded-full shadow-xs transition"
          >
            Start Shopping
            <ChevronRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-5 sm:px-6">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 sm:px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {orders.map((order, idx) => {
              const isProcessing =
                order.status.toLowerCase().includes("process") ||
                order.status.toLowerCase().includes("pending");

              return (
                <tr
                  key={order.id || idx}
                  className="hover:bg-gray-50/60 transition group"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-5 sm:px-6 font-semibold text-gray-800 whitespace-nowrap">
                    {order.orderNumber || order.id}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                    {order.date}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>{" "}
                    <span className="text-gray-400 text-xs">
                      ({order.productCount} {order.productCount === 1 ? "Product" : "Products"})
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs font-medium ${
                        isProcessing
                          ? "text-[#FF8A00]"
                          : "text-[#00B207]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-5 sm:px-6 text-right sm:text-left whitespace-nowrap">
                    <Link
                      to={`/account/orders/${(order.orderNumber || order.id || "").replace("#", "")}`}
                      className="text-[#00B207] hover:text-[#009406] font-semibold text-xs sm:text-sm hover:underline cursor-pointer"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-150 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition cursor-pointer p-1"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-50 text-[#00B207] flex items-center justify-center shrink-0">
                <Package size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Order Details: {selectedOrder.orderNumber || selectedOrder.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Placed on {selectedOrder.date} &bull;{" "}
                  <span
                    className={`font-semibold ${
                      selectedOrder.status.toLowerCase().includes("process")
                        ? "text-[#FF8A00]"
                        : "text-[#00B207]"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Tracking Progress Bar */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Order Tracking Status
              </div>
              <div className="flex items-center justify-between text-xs font-semibold relative">
                <div className="flex items-center gap-1.5 text-[#00B207]">
                  <CheckCircle2 size={16} />
                  <span>Order Placed</span>
                </div>
                <div className="flex-1 h-[2px] bg-green-200 mx-2" />
                <div
                  className={`flex items-center gap-1.5 ${
                    selectedOrder.status.toLowerCase().includes("process")
                      ? "text-[#FF8A00]"
                      : "text-[#00B207]"
                  }`}
                >
                  <Clock size={16} />
                  <span>Processing</span>
                </div>
                <div
                  className={`flex-1 h-[2px] mx-2 ${
                    selectedOrder.status === "Completed"
                      ? "bg-green-200"
                      : "bg-gray-200"
                  }`}
                />
                <div
                  className={`flex items-center gap-1.5 ${
                    selectedOrder.status === "Completed"
                      ? "text-[#00B207]"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Items In This Order ({selectedOrder.productCount})
              </h4>
              <div className="space-y-2.5 divide-y divide-gray-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between pt-2.5 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/saleimg.jpg"}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-150 p-1 shrink-0"
                        onError={(e) => {
                          e.target.src = "/saleimg.jpg";
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          ${Number(item.price).toFixed(2)} &times; {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs text-gray-600 mb-5 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Shipping Address:</span>
                <span className="font-medium text-gray-800 text-right max-w-xs truncate">
                  {selectedOrder.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Payment Method:</span>
                <span className="font-medium text-gray-800">
                  {selectedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-[#00B207]">
                  ${Number(selectedOrder.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/my-orders"
                className="bg-[#00B207] hover:bg-[#009406] text-white px-5 py-2 rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <span>View Full Order History</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
