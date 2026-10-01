import React, { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import customerService from "../../services/customerService";

const BillingAddress = ({ customer, onAddressUpdated }) => {
  const currentAddress = customer?.address || {};

  const [form, setForm] = useState({
    firstName: customer?.firstName || (customer?.name ? customer.name.split(" ")[0] : "") || "",
    lastName: customer?.lastName || (customer?.name ? customer.name.split(" ").slice(1).join(" ") : "") || "",
    company: customer?.company || "",
    street: currentAddress.street || "",
    country: currentAddress.country || "United States",
    state: currentAddress.state || "",
    city: currentAddress.city || "",
    zipCode: currentAddress.zipCode || "",
    email: customer?.email || "",
    phone: customer?.phone || ""
  });

  React.useEffect(() => {
    if (customer) {
      const addr = customer.address || {};
      setForm((prev) => ({
        ...prev,
        firstName: customer.firstName || (customer.name ? customer.name.split(" ")[0] : "") || prev.firstName,
        lastName: customer.lastName || (customer.name ? customer.name.split(" ").slice(1).join(" ") : "") || prev.lastName,
        company: customer.company || prev.company,
        street: addr.street || prev.street,
        country: addr.country || prev.country || "United States",
        state: addr.state || prev.state,
        city: addr.city || prev.city,
        zipCode: addr.zipCode || prev.zipCode,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone
      }));
    }
  }, [customer]);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.street.trim()) {
      setErrorMsg("Street address is required");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        email: customer?.email || form.email,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        company: form.company.trim(),
        street: form.street.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        zipCode: form.zipCode.trim(),
        phone: form.phone.trim()
      };

      const res = await customerService.updateBillingAddress(payload);

      // Update local storage
      const current = JSON.parse(localStorage.getItem("ecobazar_user") || "{}");
      const updatedUser = {
        ...current,
        ...(res.customer || {}),
        company: form.company.trim(),
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zipCode: form.zipCode.trim(),
          country: form.country.trim()
        }
      };

      localStorage.setItem("ecobazar_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));

      if (onAddressUpdated) onAddressUpdated(updatedUser);

      setSuccessMsg("Billing address updated successfully");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Unable to update billing address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-2xs mb-8">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-5 border-b border-gray-100 mb-6">
        Billing Address
      </h2>

      {successMsg && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-[#00B207] text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: First Name | Last Name | Company Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Company Name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="Company name"
            />
          </div>
        </div>

        {/* Row 2: Street Address */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Street Address
          </label>
          <input
            type="text"
            required
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
            placeholder="Street address"
          />
        </div>

        {/* Row 3: Country / Region | State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Country / Region
            </label>
            <input
              type="text"
              required
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="United States"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              State
            </label>
            <input
              type="text"
              required
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="New Mexico"
            />
          </div>
        </div>

        {/* Row 4: City | Zip Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              City
            </label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="Allentown"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Zip Code
            </label>
            <input
              type="text"
              required
              value={form.zipCode}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="31134"
            />
          </div>
        </div>

        {/* Row 5: Email | Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#00B207] hover:bg-[#009406] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingAddress;
