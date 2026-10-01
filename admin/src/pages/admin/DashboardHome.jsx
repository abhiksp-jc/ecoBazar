import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Grid2X2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye,
  Loader2
} from "lucide-react";
import { getDashboardStats } from "../../services/authService";

const DashboardHome = () => {
  const { products = [], categories = [] } = useOutletContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    totalProducts: products.length,
    totalCategories: categories.length,
    lowStockCount: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        if (data.stats) {
          setStats((prev) => ({
            ...prev,
            ...data.stats,
            totalProducts: data.stats.totalProducts || products.length,
            totalCategories: data.stats.totalCategories || categories.length
          }));
        }
        setRecentOrders(data.recentOrders || []);
        setRecentCustomers(data.recentCustomers || []);
        setLowStockProducts(data.lowStockProducts || []);
      } catch (err) {
        const fallbackLow = products.filter((p) => Number(p.stock) <= 10);
        setLowStockProducts(fallbackLow);
        setStats((prev) => ({
          ...prev,
          totalProducts: products.length,
          totalCategories: categories.length,
          lowStockCount: fallbackLow.length
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [products.length, categories.length]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time overview of sales, orders, customers, and inventory performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-xs"
          >
            <ShoppingCart size={15} /> View Orders
          </Link>
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold px-4 py-2 rounded-xl text-xs transition shadow-xs"
          >
            <Users size={15} /> View Customers
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
              ${stats.totalSales.toFixed(2)}
            </h2>
            <p className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
              <TrendingUp size={13} /> Active Store Sales
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Orders
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
              {stats.totalOrders}
            </h2>
            <p className="mt-1 text-xs text-blue-600 font-medium flex items-center gap-1">
              <Clock size={13} /> {stats.pendingOrders} Processing
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingCart size={24} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Customers
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
              {stats.totalCustomers}
            </h2>
            <p className="mt-1 text-xs text-purple-600 font-medium">
              Registered Shoppers
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Low Stock Alert
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">
              {stats.lowStockCount}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Items with ≤ 10 units
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Catalog Products
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {stats.totalProducts}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Catalog Categories
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {stats.totalCategories}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
            <Grid2X2 size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-base">Recent Orders</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Latest customer purchases from the store
              </p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-500">
                No orders placed yet. Orders will appear here in real-time.
              </p>
            ) : (
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-[11px] uppercase font-bold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-gray-900">
                        {ord.orderNumber}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        {ord.customerDetails?.name || "Customer"}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">
                        ${ord.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.orderStatus === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : ord.orderStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-base">New Customers</h2>
              <p className="text-xs text-gray-500 mt-0.5">Recently registered buyers</p>
            </div>
            <Link
              to="/customers"
              className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentCustomers.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-500">
                No customer profiles recorded yet.
              </p>
            ) : (
              recentCustomers.map((c) => (
                <div key={c._id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0">
                      {`${c.firstName?.[0] || ""}${c.lastName?.[0] || ""}`.toUpperCase() || "C"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {c.name || `${c.firstName} ${c.lastName}`}
                      </p>
                      <p className="text-gray-400 truncate text-[11px]">{c.email}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-700 shrink-0 text-right">
                    ${(Number(c.totalSpent) || 0).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Low Stock Inventory</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Products that require immediate restocking
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            Manage Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {lowStockProducts.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-500">
              All inventory levels are healthy. No items below 10 units.
            </p>
          ) : (
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-[11px] uppercase font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Units Remaining</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/70 transition">
                    <td className="px-5 py-3 font-semibold text-gray-900">{p.name}</td>
                    <td className="px-5 py-3">₹{Number(p.finalPrice ?? p.price).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {p.stock} {p.unit || "kg"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          Number(p.stock) === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {Number(p.stock) === 0 ? "Out of Stock" : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
