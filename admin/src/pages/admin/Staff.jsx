import { useState } from "react";
import {
  Link,
  useOutletContext
} from "react-router-dom";

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";

const Staff = () => {
  const {
    user,
    staff,
    staffLoading,
    onDeleteStaff
  } = useOutletContext();

  const [viewingStaff, setViewingStaff] = useState(null);

  if (user?.role !== "ADMIN") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        Access denied.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Staff
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage Ecobazar staff accounts and permissions
          </p>
        </div>

        <Link
          to="/staff/add"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white hover:bg-green-800 transition"
        >
          <Plus size={18} />
          Add Staff
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {staffLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading staff...
          </div>
        ) : staff.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold text-gray-800">
              No staff found
            </h3>

            <Link
              to="/staff/add"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={17} />
              Add Staff
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Name
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {staff.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50/70 transition last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                          {item.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.role || "STAFF"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.email}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.phone || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "ACTIVE"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setViewingStaff(item)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit Button */}
                        <Link
                          to={`/staff/${item._id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete staff member "${item.name}"?`)) {
                              onDeleteStaff(item._id);
                            }
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition"
                          title="Delete"
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

      {/* View Staff Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">
                  {viewingStaff.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{viewingStaff.name}</h2>
                  <p className="text-xs text-gray-500">{viewingStaff.role || "STAFF"} Details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingStaff(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Mail size={18} className="text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase text-gray-400">Email</span>
                    <p className="text-sm font-medium text-gray-900 break-all">{viewingStaff.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Phone size={18} className="text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase text-gray-400">Phone</span>
                    <p className="text-sm font-medium text-gray-900">{viewingStaff.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Shield size={18} className="text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase text-gray-400">Account Status</span>
                    <p className="text-sm font-semibold">
                      <span className={viewingStaff.status === "ACTIVE" ? "text-green-600" : "text-red-500"}>
                        {viewingStaff.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Calendar size={18} className="text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase text-gray-400">Created At</span>
                    <p className="text-sm font-medium text-gray-900">
                      {viewingStaff.createdAt
                        ? new Date(viewingStaff.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                  Assigned Permissions
                </h3>
                {viewingStaff.permissions && viewingStaff.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {viewingStaff.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-800 text-xs font-medium border border-green-200"
                      >
                        <CheckCircle2 size={13} className="text-green-600" />
                        {perm}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No custom permissions specified (standard role default).</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-gray-50">
              <Link
                to={`/staff/${viewingStaff._id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
              >
                <Edit size={15} /> Edit Staff
              </Link>
              <button
                type="button"
                onClick={() => setViewingStaff(null)}
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

export default Staff;