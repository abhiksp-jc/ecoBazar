import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Clock,
  Trash2,
  Edit2,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Sparkles
} from "lucide-react";
import {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon
} from "../../services/authService";
import CouponModal from "../../components/coupons/CouponModal";
import CouponTableRow from "../../components/coupons/CouponTableRow";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const defaultExpiry = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderAmount: 0,
    expiryDate: defaultExpiry(),
    isActive: true
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAdminCoupons(statusFilter, searchQuery);
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCoupons();
  };

  const generateCode = () => {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const val = formData.discountValue || 20;
    setFormData((prev) => ({
      ...prev,
      code: `ECO${val}_${random}`
    }));
  };

  const setExpiryDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData((prev) => ({
      ...prev,
      expiryDate: d.toISOString().slice(0, 16)
    }));
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderAmount: 0,
      expiryDate: defaultExpiry(),
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().slice(0, 16)
        : defaultExpiry(),
      isActive: coupon.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showToast("Please enter a coupon code", "error");
      return;
    }
    if (!formData.expiryDate) {
      showToast("Please select expiry date & time", "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        expiryDate: new Date(formData.expiryDate),
        isActive: formData.isActive
      };

      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, payload);
        showToast("Coupon updated successfully");
      } else {
        await createCoupon(payload);
        showToast("Coupon created successfully");
      }

      setIsModalOpen(false);
      loadCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save coupon", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      await toggleCouponStatus(coupon._id);
      showToast(
        `Coupon ${coupon.code} is now ${coupon.isActive ? "disabled" : "enabled"}`
      );
      loadCoupons();
    } catch (err) {
      showToast("Failed to change status", "error");
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}"?`)) return;
    try {
      await deleteCoupon(coupon._id);
      showToast(`Coupon ${coupon.code} deleted`);
      loadCoupons();
    } catch (err) {
      showToast("Failed to delete coupon", "error");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied ${code} to clipboard`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold transition ${
            toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} className="text-red-500" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create discount codes and adjust expiration dates for shoppers.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add Coupon</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 text-sm outline-none focus:border-green-500"
            />
          </form>

          <div className="flex items-center gap-2">
            {["ALL", "ACTIVE", "EXPIRED"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === filter
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter === "ALL"
                  ? "All"
                  : filter === "ACTIVE"
                  ? "Active"
                  : "Expired"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-base font-semibold text-gray-700">No coupons found</p>
            <p className="text-xs text-gray-400 mt-1">
              Click "+ Add Coupon" to create your first discount code.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase text-gray-500">
                    Code
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase text-gray-500">
                    Discount
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase text-gray-500">
                    Min Order
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase text-gray-500">
                    Expiry Date &amp; Time
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <CouponTableRow
                    key={coupon._id}
                    coupon={coupon}
                    copyCode={copyCode}
                    handleToggle={handleToggle}
                    openEditModal={openEditModal}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simple Add / Edit Modal */}
      <CouponModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingCoupon={editingCoupon}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitting={submitting}
        generateCode={generateCode}
        setExpiryDays={setExpiryDays}
      />

    </div>
  );
};

export default AdminCoupons;
