import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  X,
  AlertCircle
} from "lucide-react";
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage
} from "../../services/authService";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getContactMessages(statusFilter, searchQuery);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadMessages();
  };

  const handleToggleStatus = async (msg) => {
    try {
      const newStatus = msg.status === "READ" ? "UNREAD" : "READ";
      await updateContactMessageStatus(msg._id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
      setSuccess("Message deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "UNREAD") {
      try {
        await updateContactMessageStatus(msg._id, "READ");
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: "READ" } : m))
        );
      } catch (e) {}
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage customer inquiries and messages submitted through the Contact Us page.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {["ALL", "UNREAD", "READ"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700 flex items-center gap-2 border border-green-200">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-green-600 focus:outline-none bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-medium text-sm rounded-lg transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-sm text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center p-8 text-center">
            <MessageSquare size={44} className="text-gray-300 mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">No contact messages found</h2>
            <p className="text-sm text-gray-400 mt-1">
              Customer inquiries submitted on the Contact Us page will show up here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email / Phone</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`hover:bg-gray-50 transition cursor-pointer ${
                      msg.status === "UNREAD" ? "bg-amber-50/30 font-medium" : ""
                    }`}
                    onClick={() => handleOpenMessage(msg)}
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          msg.status === "UNREAD"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{msg.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-700">{msg.email}</div>
                      {msg.phone && <div className="text-xs text-gray-400">{msg.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-gray-800 max-w-xs truncate">{msg.subject || "(No Subject)"}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-1.5 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded transition"
                          title="View Message"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(msg)}
                          className="px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded border border-gray-200 transition"
                          title={msg.status === "READ" ? "Mark Unread" : "Mark Read"}
                        >
                          {msg.status === "READ" ? "Unread" : "Read"}
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                          title="Delete Message"
                        >
                          <Trash2 size={16} />
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-gray-200 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-gray-150 pb-4 mb-4">
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${
                    selectedMessage.status === "UNREAD"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedMessage.status}
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedMessage.subject || "Contact Inquiry"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">From</div>
                  <div className="font-bold text-gray-900 mt-0.5">{selectedMessage.name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">Submitted Date</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">Email Address</div>
                  <span className="text-gray-900 font-semibold block truncate select-all">
                    {selectedMessage.email}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">Phone Number</div>
                  <div className="text-gray-800">{selectedMessage.phone || "Not provided"}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Message</div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-150 pt-4">
              <button
                onClick={() => handleToggleStatus(selectedMessage)}
                className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {selectedMessage.status === "READ" ? "Mark as Unread" : "Mark as Read"}
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-lg transition"
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

export default Messages;
