import React from "react";
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react";

const AuthSignUpForm = ({
  handleSignUp,
  signUpData,
  setSignUpData,
  submitting,
  setSignInData,
  setTab,
  setError,
  setSuccess,
}) => {
  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            required
            value={signUpData.name}
            onChange={(e) =>
              setSignUpData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="John Doe"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            required
            value={signUpData.email}
            onChange={(e) =>
              setSignUpData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="john.doe@example.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            value={signUpData.phone}
            onChange={(e) =>
              setSignUpData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="+1 (555) 000-0000"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Min 6 chars"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={signUpData.confirmPassword}
              onChange={(e) =>
                setSignUpData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              placeholder="Confirm password"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Registering Account in MongoDB...</span>
          </>
        ) : (
          <span>Register Account</span>
        )}
      </button>

      <p className="text-center text-xs text-gray-500 pt-2">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setSignInData({
              email: signUpData.email,
              password: signUpData.password,
            });
            setTab("signin");
          }}
          className="text-green-600 hover:underline font-bold cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default AuthSignUpForm;
