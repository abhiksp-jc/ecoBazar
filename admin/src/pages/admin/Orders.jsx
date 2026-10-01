import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  X,
  AlertCircle,
  Loader2,
  Calendar,
  CreditCard,
  User,
  MapPin
} from "lucide-react";
import { getOrders, updateOrderStatus } from "../../services/authService";
import Pagination from "../../components/common/Pagination";
import OrderDetailModal from "../../components/orders/OrderDetailModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async (status = statusFilter, searchQuery = search) => {
    try {
      setLoading(true);
      setError("");
      const data = await getOrders(status, searchQuery);
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(statusFilter, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord
        )
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, { paymentStatus: newPaymentStatus });
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, paymentStatus: newPaymentStatus } : ord
        )
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, paymentStatus: newPaymentStatus }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://placehold.co/100x100?text=Product";
    if (imgPath.startsWith("http")) return imgPath;
    return `http://localhost:5000${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const totalSalesAll = orders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track customer orders, manage fulfilment statuses, and view purchase receipts
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Processing / Pending</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Processing").length}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Delivered Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {orders.filter((o) => o.orderStatus === "Delivered").length}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Net Sales Volume</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalSalesAll.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "Processing", "Delivered", "Pending", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab
                    ? "bg-green-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab === "ALL" ? "All Orders" : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer, email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p className="text-sm">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <ShoppingCart className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-base font-semibold text-gray-700">No Orders Found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Once customers complete checkout on the storefront, their orders will appear here in real-time.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-200 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-900 text-xs sm:text-sm">
                      {ord.orderNumber}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs">
                        <p className="font-semibold text-gray-900">{ord.customerDetails?.name}</p>
                        <p className="text-gray-400">{ord.customerDetails?.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold text-gray-700">
                      {ord.items?.length || 0}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-sm">
                      ${ord.totalAmount?.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{ord.paymentMethod}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : ord.paymentStatus === "Failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 cursor-pointer focus:ring-1 focus:ring-green-500 ${
                          ord.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : ord.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        title="View Order Details"
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Slide Bar */}
          {Math.ceil(orders.length / itemsPerPage) > 1 && (
            <div className="p-4 border-t border-gray-100 flex justify-center bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(orders.length / itemsPerPage)}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
        )}
      </div>

      <OrderDetailModal
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        getImageUrl={getImageUrl}
        handlePaymentStatusChange={handlePaymentStatusChange}
      />

    </div>
  );
};

export default Orders;
