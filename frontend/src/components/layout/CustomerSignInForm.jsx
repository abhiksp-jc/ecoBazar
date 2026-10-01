import React from "react";
import { Mail, Lock, Loader2 } from "lucide-react";

const CustomerSignInForm = ({
  handleSignInSubmit,
  signInData,
  setSignInData,
  authSubmitting,
  setAuthError,
  setAuthSuccess,
  setSignUpData,
  setAuthTab,
}) => {
  return (
    <form onSubmit={handleSignInSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            required
            value={signInData.email}
            onChange={(e) =>
              setSignInData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="your.email@example.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            required
            value={signInData.password}
            onChange={(e) =>
              setSignInData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={authSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
      >
        {authSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Checking database &amp; signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      <p className="text-center text-xs text-gray-500 pt-2">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => {
            setAuthError("");
            setAuthSuccess("");
            setSignUpData((prev) => ({
              ...prev,
              email: signInData.email,
              password: signInData.password,
              confirmPassword: signInData.password,
            }));
            setAuthTab("signup");
          }}
          className="text-green-600 hover:underline font-bold cursor-pointer"
        >
          Create Account
        </button>
      </p>
    </form>
  );
};

export default CustomerSignInForm;
