import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import { showToast, showSuccessAlert, showErrorAlert } from "../utils/sweetalert";
import { startCustomerSession, clearCustomerSession } from "../utils/authSession";
import AuthSignInForm from "../components/auth/AuthSignInForm";
import AuthSignUpForm from "../components/auth/AuthSignUpForm";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
  return `http://${host}:5000/api`;
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterInitial = location.pathname.includes("register") || location.pathname.includes("signup");

  const [tab, setTab] = useState(isRegisterInitial ? "signup" : "signin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const parseSafeJson = async (res) => {
    try {
      const text = await res.text();
      if (!text || text.trim().startsWith("<")) return null;
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!signInData.email.trim() || !signInData.password) {
      setError("Please fill in both email and password");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInData.email.trim(),
          password: signInData.password
        })
      });

      const data = await parseSafeJson(res);

      if (!res.ok || !data?.success) {
        if (data?.exists === false || res.status === 404) {
          setSignUpData((prev) => ({
            ...prev,
            email: signInData.email.trim(),
            password: signInData.password,
            confirmPassword: signInData.password
          }));
          throw new Error("No account found with this email. Please create an account first.");
        }
        throw new Error(data?.message || "Failed to sign in. Please verify your credentials.");
      }

      if (data?.customer) {
        startCustomerSession(data.customer, data.token || null);
        setSuccess("Signed in successfully! Redirecting...");
        showToast(`Welcome back, ${data.customer.name}!`, "success");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 900);
      }
    } catch (err) {
      const msg = err.message || "Failed to sign in. Please check your credentials.";
      setError(msg);
      showErrorAlert("Sign In Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!signUpData.name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!signUpData.email.trim()) {
      setError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!signUpData.password || signUpData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const checkRes = await fetch(`${getApiBaseUrl()}/customers/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signUpData.email.trim() })
      });

      const checkData = await parseSafeJson(checkRes);

      if (checkData?.exists && checkData?.hasPassword) {
        setSignInData({
          email: signUpData.email.trim(),
          password: signUpData.password
        });
        setError("An account already exists with this email. Please sign in.");
        setTab("signin");
        setSubmitting(false);
        return;
      }

      const res = await fetch(`${getApiBaseUrl()}/customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name.trim(),
          email: signUpData.email.trim(),
          phone: signUpData.phone.trim(),
          password: signUpData.password
        })
      });

      const data = await parseSafeJson(res);

      if (!res.ok || !data?.success) {
        if (data?.exists) {
          setSignInData({
            email: signUpData.email.trim(),
            password: signUpData.password
          });
          setTab("signin");
          throw new Error("User already exists with this email. Please sign in.");
        }
        throw new Error(data?.message || "Failed to create account");
      }

      if (data?.customer) {
        // Ensure new account starts with completely clean and fresh data
        clearCustomerSession();
        startCustomerSession(data.customer, data.token || null);
        setSuccess(`Account registered and signed in! Welcome, ${data.customer.name}.`);
        showSuccessAlert("Account Created! 🎉", `Welcome to Ecobazar, ${data.customer.name}!`);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      const msg = err.message || "Failed to create account. Please try again.";
      setError(msg);
      showErrorAlert("Registration Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <TopHeader />
      <MainHeader />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {tab === "signin" ? "Sign In to Ecobazar" : "Create Customer Account"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {tab === "signin"
                ? "Enter your credentials to manage your orders and profile."
                : "Check user existence in MongoDB first and send welcome confirmation email."}
            </p>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setTab("signin");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition cursor-pointer text-center ${
                tab === "signin"
                  ? "border-b-2 border-green-600 text-green-700 font-bold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition cursor-pointer text-center ${
                tab === "signup"
                  ? "border-b-2 border-green-600 text-green-700 font-bold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm">
              <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <span>{error}</span>
                {error.includes("create an account first") && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setTab("signup");
                    }}
                    className="block text-green-700 font-bold underline mt-1 cursor-pointer"
                  >
                    Click here to Create Account →
                  </button>
                )}
                {error.includes("already exists") && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setTab("signin");
                    }}
                    className="block text-green-700 font-bold underline mt-1 cursor-pointer"
                  >
                    Click here to Sign In →
                  </button>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm">
              <CheckCircle2 size={18} className="shrink-0 text-green-600" />
              <span>{success}</span>
            </div>
          )}

          {tab === "signin" ? (
            <AuthSignInForm
              handleSignIn={handleSignIn}
              signInData={signInData}
              setSignInData={setSignInData}
              submitting={submitting}
              setSignUpData={setSignUpData}
              setTab={setTab}
              setError={setError}
              setSuccess={setSuccess}
            />
          ) : (
            <AuthSignUpForm
              handleSignUp={handleSignUp}
              signUpData={signUpData}
              setSignUpData={setSignUpData}
              submitting={submitting}
              setSignInData={setSignInData}
              setTab={setTab}
              setError={setError}
              setSuccess={setSuccess}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
