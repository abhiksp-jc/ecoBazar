import { useState } from "react";
import {
  useOutletContext,
  useNavigate,
  useParams,
  Link
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  PERMISSIONS,
  ALL_READ_PERMISSIONS,
  ALL_CREATE_PERMISSIONS,
  ALL_EDIT_PERMISSIONS,
  ALL_DELETE_PERMISSIONS
} from "../../config/permissions";

const labels = {
  products: "Products",
  categories: "Categories",
  orders: "Orders",
  customers: "Customers",
  contentManagement: "Content Management",
  faqs: "FAQ"
};

const StaffFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, staff, onCreateStaff, onUpdateStaff } = useOutletContext();

  const isEdit = Boolean(id);
  const currentStaff = staff.find((item) => item._id === id);

  const [form, setForm] = useState({
    name: currentStaff?.name || "",
    email: currentStaff?.email || "",
    phone: currentStaff?.phone || "",
    password: "",
    status: currentStaff?.status || "ACTIVE",
    permissions: currentStaff?.permissions || []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  if (user?.role !== "ADMIN") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        Access denied.
      </div>
    );
  }
 
  if (isEdit && !currentStaff) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-600">Staff member not found</h2>
        <Link to="/staff" className="mt-4 inline-flex text-sm font-medium text-green-700">
          Back to Staff
        </Link>
      </div>
    );
  }

  const setPermissions = (permissions) => {
    setForm((prev) => ({
      ...prev,
      permissions: [...new Set(permissions)]
    }));
  };

  const togglePermission = (module, action) => {
    const permission = `${module}.${action}`;
    let next = form.permissions.includes(permission)
      ? form.permissions.filter((item) => item !== permission)
      : [...form.permissions, permission];

    if (action !== "read" && next.includes(permission)) {
      next.push(`${module}.read`);
    }

    setPermissions(next);
  };

  const hasPermission = (module, action) =>
    form.permissions.includes(`${module}.${action}`);

  const giveReadToAll = () => {
    setPermissions(
      form.permissions
        .filter((permission) => !permission.endsWith(".read"))
        .concat(ALL_READ_PERMISSIONS)
    );
  };

  const giveEditToAll = () => {
    setPermissions(
      form.permissions
        .filter(
          (permission) =>
            !permission.endsWith(".read") &&
            !permission.endsWith(".edit")
        )
        .concat(ALL_READ_PERMISSIONS, ALL_EDIT_PERMISSIONS)
    );
  };

  const giveCreateToAll = () => {
    setPermissions(
      form.permissions
        .filter(
          (permission) =>
            !permission.endsWith(".read") &&
            !permission.endsWith(".create")
        )
        .concat(ALL_READ_PERMISSIONS, ALL_CREATE_PERMISSIONS)
    );
  };

  const giveDeleteToAll = () => {
    setPermissions(
      form.permissions
        .filter(
          (permission) =>
            !permission.endsWith(".read") &&
            !permission.endsWith(".delete")
        )
        .concat(ALL_READ_PERMISSIONS, ALL_DELETE_PERMISSIONS)
    );
  };

  const clearAll = () => setPermissions([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("Email is required");
    if (!isEdit && !form.password.trim()) return setError("Password is required");
    if (!isEdit && form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      if (isEdit) {
        await onUpdateStaff(id, {
          name: form.name.trim(),
          phone: form.phone.trim(),
          status: form.status,
          permissions: form.permissions
        });
      } else {
        await onCreateStaff({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          permissions: form.permissions
        });
      }

      navigate("/staff");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to save staff"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/staff"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Staff" : "Add Staff"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? "Update staff information and permissions" : "Create a staff account and assign permissions"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required disabled={loading}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-green-600 disabled:bg-gray-100"
              placeholder="Enter staff name" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              disabled={isEdit || loading}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-green-600 disabled:bg-gray-100"
              placeholder="Enter staff email" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} disabled={loading}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-green-600 disabled:bg-gray-100"
              placeholder="Enter phone number" />
          </div>

          {!isEdit && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                required minLength={6} disabled={loading}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-green-600 disabled:bg-gray-100"
                placeholder="Enter password" />
            </div>
          )}

          {isEdit && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={form.status} onChange={handleChange} disabled={loading}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-green-600 disabled:bg-gray-100">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Permissions</h2>
              <p className="mt-1 text-sm text-gray-500">Give permissions for all modules  .</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={giveReadToAll} disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                Select All Read
              </button>
              <button type="button" onClick={giveCreateToAll} disabled={loading}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60">
                Select All Create
              </button>
              <button type="button" onClick={giveEditToAll} disabled={loading}
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60">
                Select All Edit
              </button>
              <button type="button" onClick={giveDeleteToAll} disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
                Select All Delete
              </button>
              <button type="button" onClick={clearAll} disabled={loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                Clear All
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Module</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Read</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Create</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Edit</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Delete</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(PERMISSIONS).map((module) => (
                  <tr key={module} className="border-b last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{labels[module]}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(module, "read")}
                        onChange={() => togglePermission(module, "read")}
                        disabled={loading}
                        className="h-4 w-4 accent-green-700"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(module, "create")}
                        onChange={() => togglePermission(module, "create")}
                        disabled={loading}
                        className="h-4 w-4 accent-green-700"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(module, "edit")}
                        onChange={() => togglePermission(module, "edit")}
                        disabled={loading}
                        className="h-4 w-4 accent-green-700"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(module, "delete")}
                        onChange={() => togglePermission(module, "delete")}
                        disabled={loading}
                        className="h-4 w-4 accent-green-700"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate("/staff")} disabled={loading}
            className="h-11 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="h-11 rounded-lg bg-green-700 px-6 text-sm font-semibold text-white hover:bg-green-800">
            {loading ? "Saving..." : isEdit ? "Update Staff" : "Create Staff"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffFormPage;
