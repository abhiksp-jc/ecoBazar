import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Trash2,
  Eye,
  X,
  Calendar,
  Building2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getCustomers, getCustomer, deleteCustomer } from "../../services/authService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCustomers = async (searchQuery = "") => {
    try {
      setLoading(true);
      setError("");
      const data = await getCustomers(searchQuery);
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleViewDetails = async (id) => {
    try {
      setModalLoading(true);
      const data = await getCustomer(id);
      setSelectedCustomer(data.customer);
      setCustomerOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customer details");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this customer record?")) return;
    try {
      setDeletingId(id);
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      if (selectedCustomer?._id === id) {
        setSelectedCustomer(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete customer");
    } finally {
      setDeletingId(null);
    }
  };

  const totalSpentAll = customers.reduce(
    (sum, c) => sum + (Number(c.totalSpent) || 0),
    0
  );
  const totalOrdersAll = customers.reduce(
    (sum, c) => sum + (Number(c.totalOrders) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            View registered customer profiles, billing addresses, and order histories
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
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{customers.length}</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Orders Placed</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalOrdersAll}</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalSpentAll.toFixed(2)}</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Active Accounts</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {customers.filter((c) => c.status !== "INACTIVE").length}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Showing {customers.length} customer records
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p className="text-sm">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <Users className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-base font-semibold text-gray-700">No Customers Found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Customers will automatically appear here once users enter their billing details on the store.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-200 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4 text-right">Total Spent</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => {
                  const initials = `${c.firstName?.[0] || ""}${c.lastName?.[0] || ""}`.toUpperCase() || "C";
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{c.name || `${c.firstName} ${c.lastName}`}</p>
                            {c.company && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Building2 size={12} /> {c.company}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Mail size={13} className="text-gray-400" />
                            <span>{c.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Phone size={13} className="text-gray-400" />
                            <span>{c.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {c.address?.city || c.address?.state || "N/A"}, {c.address?.country || "US"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                          {c.totalOrders || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-bold text-gray-900">
                          ${(Number(c.totalSpent) || 0).toFixed(2)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(c._id)}
                            title="View Customer Profile"
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deletingId === c._id}
                            title="Delete Customer"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-sm">
                  {`${selectedCustomer.firstName?.[0] || ""}${selectedCustomer.lastName?.[0] || ""}`.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCustomer.name || `${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                  </h3>
                  <p className="text-xs text-gray-500">Customer ID: {selectedCustomer._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </h4>
                  <p className="text-sm text-gray-800 flex items-center gap-2">
                    <Mail size={15} className="text-gray-400" /> {selectedCustomer.email}
                  </p>
                  <p className="text-sm text-gray-800 flex items-center gap-2">
                    <Phone size={15} className="text-gray-400" /> {selectedCustomer.phone}
                  </p>
                  {selectedCustomer.company && (
                    <p className="text-sm text-gray-800 flex items-center gap-2">
                      <Building2 size={15} className="text-gray-400" /> {selectedCustomer.company}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
                    <Calendar size={13} /> Joined on {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Billing Address
                  </h4>
                  <p className="text-sm text-gray-800">
                    {selectedCustomer.address?.street}
                  </p>
                  <p className="text-sm text-gray-800">
                    {selectedCustomer.address?.city}, {selectedCustomer.address?.state} {selectedCustomer.address?.zipCode}
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {selectedCustomer.address?.country}
                  </p>
                  {selectedCustomer.orderNotes && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg mt-2">
                      Notes: {selectedCustomer.orderNotes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                  <span>Order History</span>
                  <span className="text-xs font-normal text-gray-500">
                    {customerOrders.length} orders placed
                  </span>
                </h4>

                {modalLoading ? (
                  <div className="py-8 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    <p className="text-xs">Loading orders...</p>
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4 text-center bg-gray-50 rounded-xl">
                    No orders recorded for this customer yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-3.5 border border-gray-200 rounded-xl flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <p className="font-mono font-bold text-gray-900">{ord.orderNumber}</p>
                          <p className="text-gray-400 mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${ord.totalAmount?.toFixed(2)}</p>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              ord.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : ord.orderStatus === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
