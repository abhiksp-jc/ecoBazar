import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetalert";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }
    if (!formData.message.trim()) {
      errors.message = "Message content is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validate()) return;

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim() || "Website Inquiry",
        message: formData.message.trim()
      };

      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("Thank you! Your message has been sent successfully. We will be in touch shortly.");
        showSuccessAlert("Message Sent! ✉️", "Thank you! Your message has been sent successfully. We will get back to you shortly.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        setTimeout(() => setSuccessMessage(""), 6000);
      } else {
        const errorMsg = data.message || "Failed to submit message. Please try again.";
        setErrorMessage(errorMsg);
        showErrorAlert("Submission Failed", errorMsg);
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      const netMsg = "Network error. Please make sure the server is running and try again.";
      setErrorMessage(netMsg);
      showErrorAlert("Network Error", netMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 sm:p-10 shadow-xs border border-gray-150">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B207] mb-1 inline-block">
          Drop Us A Line
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Just Say Hello!
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 mb-6 leading-relaxed">
          Do you fancy saying hi to us or you want to give us some feedback? Fill out the form below and we will get back to you right away.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 border border-green-200 flex items-start gap-3 text-sm text-green-800">
          <CheckCircle2 size={20} className="text-[#00B207] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Message Received!</p>
            <p className="text-xs sm:text-sm mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3 text-sm text-red-800">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Submission Failed</p>
            <p className="text-xs sm:text-sm mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition ${
                fieldErrors.firstName ? "border-red-400 bg-red-50/20" : "border-gray-250 bg-white"
              }`}
            />
            {fieldErrors.firstName && (
              <span className="text-[11px] text-red-600 mt-1 block">
                {fieldErrors.firstName}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-250 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition bg-white"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition ${
                fieldErrors.email ? "border-red-400 bg-red-50/20" : "border-gray-250 bg-white"
              }`}
            />
            {fieldErrors.email && (
              <span className="text-[11px] text-red-600 mt-1 block">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-250 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition bg-white"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-250 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition bg-white"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Your Message *
          </label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition resize-y ${
              fieldErrors.message ? "border-red-400 bg-red-50/20" : "border-gray-250 bg-white"
            }`}
          />
          {fieldErrors.message && (
            <span className="text-[11px] text-red-600 mt-1 block">
              {fieldErrors.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B207] hover:bg-[#009406] text-white font-bold text-sm px-8 py-3.5 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
