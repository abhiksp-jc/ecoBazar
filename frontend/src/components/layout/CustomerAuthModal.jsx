import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { startCustomerSession } from "../../utils/authSession";
import CustomerSignInForm from "./CustomerSignInForm";
import CustomerSignUpForm from "./CustomerSignUpForm";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  const host =
    typeof window !== "undefined" && window.location.hostname
      ? window.location.hostname
      : "localhost";
  return `http://${host}:5000/api`;
};

const parseSafeJson = async (res) => {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

const CustomerAuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authTab, setAuthTab] = useState("signin");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!signInData.email.trim() || !signInData.password) {
      setAuthError("Please fill in both email and password");
      return;
    }

    setAuthSubmitting(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInData.email.trim(),
          password: signInData.password,
        }),
      });

      const data = await parseSafeJson(res);

      if (!res.ok || !data?.success) {
        if (data?.exists === false || res.status === 404) {
          setSignUpData((prev) => ({
            ...prev,
            email: signInData.email.trim(),
            password: signInData.password,
            confirmPassword: signInData.password,
          }));
          throw new Error("No account found with this email. Please create an account first.");
        }
        throw new Error(data?.message || "Failed to sign in. Please verify your credentials.");
      }

      if (data?.customer) {
        startCustomerSession(data.customer);
        if (onAuthSuccess) onAuthSuccess(data.customer);
        setAuthSuccess("Signed in successfully!");
        setTimeout(() => {
          onClose();
          setAuthSuccess("");
        }, 800);
      }
    } catch (err) {
      setAuthError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!signUpData.name.trim()) {
      setAuthError("Full name is required");
      return;
    }

    if (!signUpData.email.trim()) {
      setAuthError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email.trim())) {
      setAuthError("Please enter a valid email address");
      return;
    }

    if (!signUpData.password || signUpData.password.length < 6) {
      setAuthError("Password must be at least 6 characters long");
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }

    setAuthSubmitting(true);

    try {
      const checkRes = await fetch(`${getApiBaseUrl()}/customers/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signUpData.email.trim() }),
      });

      const checkData = await parseSafeJson(checkRes);

      if (checkData?.exists && checkData?.hasPassword) {
        setSignInData({
          email: signUpData.email.trim(),
          password: signUpData.password,
        });
        setAuthError("An account already exists with this email. Please sign in.");
        setAuthTab("signin");
        setAuthSubmitting(false);
        return;
      }

      const res = await fetch(`${getApiBaseUrl()}/customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name.trim(),
          email: signUpData.email.trim(),
          phone: signUpData.phone.trim(),
          password: signUpData.password,
        }),
      });

      const data = await parseSafeJson(res);

      if (!res.ok || !data?.success) {
        if (data?.exists) {
          setSignInData({
            email: signUpData.email.trim(),
            password: signUpData.password,
          });
          setAuthTab("signin");
          throw new Error("User already exists with this email. Please sign in.");
        }
        throw new Error(data?.message || "Failed to create account");
      }

      if (data?.customer) {
        startCustomerSession(data.customer);
        if (onAuthSuccess) onAuthSuccess(data.customer);
        setSignInData({
          email: signUpData.email.trim(),
          password: signUpData.password,
        });
        setAuthSuccess(`Welcome, ${data.customer.name}! Account registered and signed in successfully.`);
        setTimeout(() => {
          onClose();
          setAuthSuccess("");
        }, 1200);
      }
    } catch (err) {
      setAuthError(err.message || "Failed to create account. Please try again.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {authTab === "signin" ? "Sign In to Your Account" : "Create New Customer Account"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {authTab === "signin"
              ? "Access your saved profile, orders history, and faster checkout."
              : "We check user existence in MongoDB first and send a welcome confirmation email."}
          </p>
        </div>

        <div className="flex border-b border-gray-200 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthTab("signin");
              setAuthError("");
              setAuthSuccess("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition cursor-pointer text-center ${
              authTab === "signin"
                ? "border-b-2 border-green-600 text-green-700 font-bold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab("signup");
              setAuthError("");
              setAuthSuccess("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition cursor-pointer text-center ${
              authTab === "signup"
                ? "border-b-2 border-green-600 text-green-700 font-bold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Create Account
          </button>
        </div>

        {authError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl flex items-start gap-2 text-xs">
            <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <span>{authError}</span>
              {authError.includes("create an account first") && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthError("");
                    setAuthTab("signup");
                  }}
                  className="block text-green-700 font-bold underline mt-1 cursor-pointer"
                >
                  Click here to Create Account →
                </button>
              )}
              {authError.includes("already exists") && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthError("");
                    setAuthTab("signin");
                  }}
                  className="block text-green-700 font-bold underline mt-1 cursor-pointer"
                >
                  Click here to Sign In →
                </button>
              )}
            </div>
          </div>
        )}

        {authSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs">
            <CheckCircle2 size={16} className="shrink-0 text-green-600" />
            <span>{authSuccess}</span>
          </div>
        )}

        {authTab === "signin" ? (
          <CustomerSignInForm
            handleSignInSubmit={handleSignInSubmit}
            signInData={signInData}
            setSignInData={setSignInData}
            authSubmitting={authSubmitting}
            setAuthError={setAuthError}
            setAuthSuccess={setAuthSuccess}
            setSignUpData={setSignUpData}
            setAuthTab={setAuthTab}
          />
        ) : (
          <CustomerSignUpForm
            handleSignUpSubmit={handleSignUpSubmit}
            signUpData={signUpData}
            setSignUpData={setSignUpData}
            authSubmitting={authSubmitting}
            setAuthError={setAuthError}
            setAuthSuccess={setAuthSuccess}
            setSignInData={setSignInData}
            setAuthTab={setAuthTab}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerAuthModal;
