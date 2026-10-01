import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Eye, X, Search, HelpCircle, Calendar, CheckCircle2 } from "lucide-react";
import FAQFormView from "../../components/faqs/FAQFormView";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [viewingFaq, setViewingFaq] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [form, setForm] = useState({
    question: "",
    answer: "",
    status: "active"
  });

  const token = localStorage.getItem("token");

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/faqs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFaqs(response.data.faqs || []);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const q = (faq.question || "").toLowerCase();
      const a = (faq.answer || "").toLowerCase();
      const s = search.toLowerCase();
      const matchesSearch = q.includes(s) || a.includes(s);
      const matchesStatus =
        statusFilter === "ALL" ||
        (faq.status || "active").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [faqs, search, statusFilter]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openAdd = () => {
    setEditingId(null);

    setForm({
      question: "",
      answer: "",
      status: "active"
    });

    setView("form");
  };

  const openEdit = (faq) => {
    setEditingId(faq._id);

    setForm({
      question: faq.question,
      answer: faq.answer,
      status: faq.status || "active"
    });

    setView("form");
  };

  const backToList = () => {
    setView("list");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/faqs/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/faqs",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      await fetchFAQs();
      setView("list");
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save FAQ:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save FAQ"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/faqs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchFAQs();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete FAQ"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">
          Loading FAQs...
        </p>
      </div>
    );
  }

  if (view === "form") {
    return (
      <FAQFormView
        backToList={backToList}
        editingId={editingId}
        handleSubmit={handleSubmit}
        form={form}
        handleChange={handleChange}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            FAQs
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage customer frequently asked questions
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 font-semibold transition shadow-xs"
        >
          <Plus size={18} />
          Add FAQ
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2 relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs by question or answer..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* FAQs Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <HelpCircle size={40} className="mx-auto mb-3 text-gray-400 opacity-60" />
            <p className="font-semibold text-gray-700">No FAQs found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or add a new question.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 w-12">
                    #
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 max-w-sm">
                    Question
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Answer Preview
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 w-28">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 w-36">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredFaqs.map((faq, index) => (
                  <tr
                    key={faq._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-xs font-medium text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {faq.question}
                      </p>
                    </td>

                    <td className="px-6 py-4 max-w-md">
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                          faq.status === "active"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {faq.status || "active"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setViewingFaq(faq)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
                          title="View Full FAQ"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEdit(faq)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition"
                          title="Edit FAQ"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(faq._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                          title="Delete FAQ"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View FAQ Modal */}
      {viewingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">FAQ Details</h2>
                  <p className="text-xs text-gray-500">Status: {viewingFaq.status || "active"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingFaq(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-xs font-semibold uppercase text-gray-400">Question</span>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  {viewingFaq.question}
                </h3>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-gray-400">Answer</span>
                <div className="mt-1.5 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {viewingFaq.answer}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-gray-400 border-t border-gray-100">
                <span className="capitalize font-semibold text-green-700">Status: {viewingFaq.status || "active"}</span>
                {viewingFaq.createdAt && (
                  <span>Created: {new Date(viewingFaq.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  const target = viewingFaq;
                  setViewingFaq(null);
                  openEdit(target);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
              >
                <Pencil size={14} /> Edit FAQ
              </button>
              <button
                type="button"
                onClick={() => setViewingFaq(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
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

export default FAQ;