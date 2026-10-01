import React from "react";
import { ArrowLeft } from "lucide-react";

const FAQFormView = ({
  backToList,
  editingId,
  handleSubmit,
  form,
  handleChange,
}) => {
  return (
    <div className="w-full">
      <button
        onClick={backToList}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={18} />
        Back to FAQs
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {editingId ? "Edit FAQ" : "Add FAQ"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Enter frequently asked question"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              placeholder="Enter detailed answer..."
              rows="7"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={backToList}
              className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
            >
              {editingId ? "Update FAQ" : "Save FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQFormView;
