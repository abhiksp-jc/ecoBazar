import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
  Loader2,
  CheckCircle,
  Truck,
  CreditCard,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AccountBreadcrumb from "../components/account/AccountBreadcrumb";
import AccountSidebar from "../components/account/AccountSidebar";
import EcobazarNewsletter from "../components/common/EcobazarNewsletter";
import Pagination from "../components/common/Pagination";
import orderService from "../services/orderService";

const DEMO_ORDERS = [
  {
    _id: "4152",
    orderNumber: "4152",
    createdAt: "2021-04-24T10:30:00.000Z",
    paymentMethod: "Paypal",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    subtotal: 365.0,
    shippingFee: 0,
    totalAmount: 84.0,
    items: [
      { name: "Red Capsicum", price: 14.0, quantity: 5, image: "/saleimg.jpg" },
      { name: "Green Capsicum", price: 14.0, quantity: 2, image: "/leaves.jpg" },
      { name: "Green Chilli", price: 26.7, quantity: 10, image: "/maingreen.jpg" }
    ]
  },
  {
    _id: "7382",
    orderNumber: "7382",
    createdAt: "2020-09-08T14:15:00.000Z",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    subtotal: 84.0,
    shippingFee: 0,
    totalAmount: 84.0,
    items: [
      { name: "Green Apple", price: 14.99, quantity: 2, image: "/saleimg.jpg" },
      { name: "Fresh Broccoli", price: 10.5, quantity: 2, image: "/leaves.jpg" }
    ]
  },
  {
    _id: "7032",
    orderNumber: "7032",
    createdAt: "2020-05-24T09:20:00.000Z",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    subtotal: 65.0,
    shippingFee: 0,
    totalAmount: 65.0,
    items: [
      { name: "Chinese Cabbage", price: 12.0, quantity: 2, image: "/leaves.jpg" },
      { name: "Eggplant", price: 14.0, quantity: 1, image: "/maingreen.jpg" }
    ]
  },
  {
    _id: "1304",
    orderNumber: "1304",
    createdAt: "2020-04-22T16:45:00.000Z",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    subtotal: 76.0,
    shippingFee: 0,
    totalAmount: 76.0,
    items: [
      { name: "Big Potatoes", price: 15.0, quantity: 2, image: "/saleimg.jpg" },
      { name: "Fresh Corn", price: 11.0, quantity: 2, image: "/maingreen.jpg" }
    ]
  }
];

const MyOrders = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("ecobazar_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const fetchOrders = async () => {
    setLoading(true);
    if (!currentUser?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const fetched = await orderService.getCustomerOrders(currentUser.email);
      setOrders(fetched || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser?.email]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between">
      <div>
        <TopHeader />

        <div className="sticky top-0 z-40 bg-white shadow-xs">
          <MainHeader
            isMobileNavOpen={mobileNavOpen}
            onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          />
          <Navbar
            isMobileNavOpen={mobileNavOpen}
            onCloseMobileNav={() => setMobileNavOpen(false)}
          />
        </div>

        {/* Breadcrumb */}
        <AccountBreadcrumb
          items={[
            { label: "Account", path: "/account" },
            { label: "Order History", path: null }
          ]}
          currentPath="Order History"
        />

        {/* Main 2-Column Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <AccountSidebar activeTab="orders" />
            </aside>

            {/* Right Orders Content */}
            <div className="flex-1 min-w-0 w-full">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                {/* Header */}
                <div className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 gap-2">
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                      Order History
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {currentUser
                        ? `Logged in as ${currentUser.name || currentUser.firstName || currentUser.email}`
                        : "Showing recent order history"}
                    </p>
                  </div>

                  <Link
                    to="/shop"
                    className="text-xs sm:text-sm font-semibold text-[#00B207] hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Orders Content */}
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin text-[#00B207] mb-2" size={32} />
                    <p className="text-xs sm:text-sm">Loading order history...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center max-w-sm mx-auto">
                    <div className="w-14 h-14 bg-green-50 text-[#00B207] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package size={26} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      No Orders Yet
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      You haven't placed any orders yet. Discover our fresh groceries!
                    </p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-1.5 bg-[#00B207] hover:bg-[#009406] text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs"
                    >
                      <span>Start Shopping</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <th className="py-3.5 px-6">Order ID</th>
                          <th className="py-3.5 px-4">Date</th>
                          <th className="py-3.5 px-4">Total</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-6 text-right sm:text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                        {orders
                          .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
                          .map((ord, idx) => {
                          const orderId = ord.orderNumber ? `#${ord.orderNumber}` : `#${ord._id?.slice(-6) || idx + 1000}`;
                          const rawId = ord._id || ord.orderNumber;
                          const dateStr = ord.createdAt
                            ? new Date(ord.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })
                            : "24 Apr, 2021";
                          const total = Number(ord.totalAmount) || 84.0;
                          const count = ord.items?.length || 3;
                          const isProcessing =
                            (ord.orderStatus || "").toLowerCase().includes("process") ||
                            (ord.orderStatus || "").toLowerCase().includes("pend");

                          return (
                            <tr
                              key={ord._id || idx}
                              className="hover:bg-gray-50/60 transition group"
                            >
                              <td className="py-4 px-6 font-semibold text-gray-800 font-mono whitespace-nowrap">
                                {orderId}
                              </td>

                              <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                                {dateStr}
                              </td>

                              <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                                <span className="font-semibold text-gray-900">
                                  ${total.toFixed(2)}
                                </span>{" "}
                                <span className="text-gray-400 text-xs">
                                  ({count} {count === 1 ? "Product" : "Products"})
                                </span>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <span
                                  className={`text-xs font-medium ${
                                    isProcessing ? "text-[#FF8A00]" : "text-[#00B207]"
                                  }`}
                                >
                                  {ord.orderStatus || "Processing"}
                                </span>
                              </td>

                              <td className="py-4 px-6 text-right sm:text-left whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/account/orders/${rawId}`)}
                                  className="text-[#00B207] hover:text-[#009406] font-semibold text-xs sm:text-sm hover:underline cursor-pointer inline-flex items-center gap-1"
                                >
                                  <span>View Details</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Slide Bar */}
                {Math.ceil(orders.length / ordersPerPage) > 1 && (
                  <div className="p-5 border-t border-gray-100 flex justify-center bg-white">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(orders.length / ordersPerPage)}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <EcobazarNewsletter />
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;
