import React from "react";
import { Mail, Lock, Loader2 } from "lucide-react";

const AuthSignInForm = ({
  handleSignIn,
  signInData,
  setSignInData,
  submitting,
  setSignUpData,
  setTab,
  setError,
  setSuccess,
}) => {
  return (
    <form onSubmit={handleSignIn} className="space-y-4">
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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
          />
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
            <span>Signing In...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      <p className="text-center text-xs text-gray-500 pt-2">
        Don't have an account yet?{" "}
        <button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setSignUpData((prev) => ({
              ...prev,
              email: signInData.email,
              password: signInData.password,
              confirmPassword: signInData.password,
            }));
            setTab("signup");
          }}
          className="text-green-600 hover:underline font-bold cursor-pointer"
        >
          Create Account
        </button>
      </p>
    </form>
  );
};

export default AuthSignInForm;
