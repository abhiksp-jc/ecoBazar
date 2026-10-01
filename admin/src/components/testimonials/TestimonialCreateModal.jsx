import React from "react";
import { Plus, X } from "lucide-react";

const TestimonialCreateModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  setFormData,
  setAvatarFile,
  handleCreateSubmit,
  formSubmitting,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
            <Plus size={16} className="text-[#00B207]" />
            Add Customer Review
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#00B207]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Tag</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Customer"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#00B207]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#00B207]"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="customer@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#00B207]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Avatar (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0] || null)}
              className="w-full text-xs text-gray-500 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Review Message *
            </label>
            <textarea
              rows={3}
              required
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="Write the customer testimonial here..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#00B207]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Homepage Visibility</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#00B207]"
            >
              <option value="APPROVED">Live on Homepage</option>
              <option value="PENDING">Pending Approval</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="flex-1 py-2 rounded-lg bg-[#00B207] hover:bg-[#009406] text-white text-xs font-semibold transition disabled:opacity-50"
            >
              {formSubmitting ? "Saving..." : "Save Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialCreateModal;
