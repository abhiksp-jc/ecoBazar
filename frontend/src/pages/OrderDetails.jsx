import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, ShoppingBag } from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AccountBreadcrumb from "../components/account/AccountBreadcrumb";
import AccountSidebar from "../components/account/AccountSidebar";
import OrderAddress from "../components/account/OrderAddress";
import OrderSummary from "../components/account/OrderSummary";
import OrderStatus from "../components/account/OrderStatus";
import OrderProducts from "../components/account/OrderProducts";
import EcobazarNewsletter from "../components/common/EcobazarNewsletter";
import orderService from "../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("ecobazar_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      if (!id) {
        setError("Order ID is required.");
        setLoading(false);
        return;
      }

      try {
        const fetchedOrder = await orderService.getOrderById(id, currentUser?.email);

        // Client-side authentication check if user is logged in
        if (currentUser?.email && fetchedOrder?.customerDetails?.email) {
          const userEmail = currentUser.email.toLowerCase().trim();
          const orderEmail = fetchedOrder.customerDetails.email.toLowerCase().trim();
          if (userEmail !== orderEmail) {
            setError("You are not authorized to view this order.");
            setLoading(false);
            return;
          }
        }

        setOrder(fetchedOrder);
      } catch (err) {
        console.warn("Could not fetch order from API:", err);

        // Check local storage for recent test orders belonging to current user
        try {
          const localOrders = JSON.parse(localStorage.getItem("ecobazar_orders") || "[]");
          const found = localOrders.find(
            (o) =>
              (o._id === id || o.orderNumber === id || `#${o.orderNumber}` === id) &&
              (!currentUser?.email ||
                !o.customerDetails?.email ||
                o.customerDetails.email.toLowerCase() === currentUser.email.toLowerCase())
          );
          if (found) {
            setOrder(found);
            setLoading(false);
            return;
          }
        } catch (_) {}

        if (err.status === 403) {
          setError("You are not authorized to view this order.");
        } else {
          setError("Order not found or no longer available.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, currentUser?.email]);

  // Formatted date and product count
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "April 24, 2021";

  const productCount = order?.items?.length || 3;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between">
      <div>
        {/* 1. Announcement Bar */}
        <TopHeader />

        {/* 2. Main Header & Navbar */}
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

        {/* 3. Breadcrumb Banner */}
        <AccountBreadcrumb
          items={[
            { label: "Account", path: "/account" },
            { label: "Order History", path: "/account/orders" },
            { label: "Order Details", path: null }
          ]}
          currentPath="Order Details"
        />

        {/* 4. Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Sidebar (Order History active) */}
            <aside className="w-full lg:w-64 shrink-0">
              <AccountSidebar activeTab="orders" />
            </aside>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0 w-full">
              {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-xs flex flex-col items-center justify-center text-gray-400">
                  <Loader2 className="animate-spin text-[#00B207] mb-3" size={36} />
                  <p className="text-sm font-medium text-gray-600">
                    Loading order details...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-xs max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                    Order Access Error
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6">{error}</p>
                  <Link
                    to="/account/orders"
                    className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-[#009406] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition shadow-xs"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Order History</span>
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                  {/* Top Order Details Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                          Order Details
                        </h1>
                        <span className="text-xs text-gray-400">&bull;</span>
                        <span className="text-xs sm:text-sm text-gray-500 font-medium">
                          {orderDate} &bull; {productCount} {productCount === 1 ? "Product" : "Products"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Link
                        to="/account/orders"
                        className="text-[#00B207] hover:text-[#009406] text-xs sm:text-sm font-semibold hover:underline transition inline-flex items-center gap-1"
                      >
                        Back to List
                      </Link>
                    </div>
                  </div>

                  {/* 3 Address & Summary Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
                    <OrderAddress order={order} currentUser={currentUser} />
                    <OrderSummary order={order} />
                  </div>

                  {/* Order Progress Tracker */}
                  <OrderStatus status={order?.orderStatus || "Processing"} />

                  {/* Products Table */}
                  <OrderProducts items={order?.items} />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 5. Newsletter Section */}
        <EcobazarNewsletter />
      </div>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
};

export default OrderDetails;
